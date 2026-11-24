---
title: "OWASP A02:2025 — Security Misconfiguration: Hardening Content Security Policy in Next.js"
slug: owasp-a02-security-misconfiguration-csp-hardening-nextjs
description: "A practical investigation of OWASP A02:2025 Security Misconfiguration, covering Content Security Policy, removal of unsafe-inline and unsafe-eval, nonce-based CSP implementation in Next.js, dynamic rendering, inline-style violations, Chrome DevTools analysis, and security testing with OWASP ZAP."
imageUrl: /images/8.webp
author: o. ocak
date: 24.11.2026
tags:
  - OWASP
  - Security Misconfiguration
  - Content Security Policy
  - CSP
  - Next.js
  - Web Security
  - XSS
  - Nonce
  - OWASP ZAP
published: true
---

**A practical security walkthrough based on hardening `oocak.com`**

## 1. Understanding the Security Problem

A web application can have authentication, authorization, input validation, and secure API endpoints and still expose users to browser-side attacks.

One example is Cross-Site Scripting (XSS).

XSS occurs when an attacker manages to make a victim's browser execute JavaScript that the application did not intend to execute. Depending on the vulnerability and the application's security controls, that JavaScript might:

- Modify the page displayed to the user.
- Perform actions using the victim's authenticated session.
- Read information available to JavaScript in the page.
- Display a fake login interface.
- Interact with application APIs using the victim's browser context.

Content Security Policy (CSP) is a browser-enforced security policy that restricts which resources can load and which scripts or styles can execute.

CSP is a **defense-in-depth control**. It can reduce the impact of some XSS vulnerabilities, but it does not make unsafe HTML rendering safe.

### What happens without a restrictive CSP?

Consider this deliberately vulnerable example:

```html
<div id="comment"></div>

<script>
  const comment = new URLSearchParams(location.search).get("comment");

  document.querySelector("#comment").innerHTML = comment;
</script>
```

If a user visits:

```text
https://example.test/?comment=<img src=x onerror=alert(document.domain)>
```

the browser may execute the event handler when the image fails to load.

The underlying problem is the use of `innerHTML` with untrusted input.

A safer implementation for plain text is:

```js
const comment = new URLSearchParams(location.search).get("comment");

document.querySelector("#comment").textContent = comment;
```

`textContent` inserts text rather than interpreting the input as HTML.

CSP adds another layer of protection, but the safer rendering approach remains necessary.

## 2. Why This Belongs to OWASP A02

OWASP Top 10:2025 classifies Security Misconfiguration as **A02**.

Security misconfiguration includes weaknesses caused by missing, incorrect, or overly permissive security settings.

Examples include:

- Missing security headers.
- Overly permissive CSP directives.
- Unnecessary HTTP methods or exposed services.
- Default credentials or unnecessary features.
- Incorrect CORS configuration.
- Unnecessary information disclosure.

Our CSP work primarily addresses the browser security policy configuration.

## 3. Understanding the CSP Directives

Before changing the policy, it is important to understand what each directive controls.

| Directive         | Purpose                                                              |
| ----------------- | -------------------------------------------------------------------- |
| `default-src`     | Fallback policy for resource types without a more specific directive |
| `script-src`      | Controls JavaScript sources and execution                            |
| `style-src`       | Controls stylesheets and inline styles                               |
| `img-src`         | Controls image sources                                               |
| `font-src`        | Controls font sources                                                |
| `connect-src`     | Controls `fetch`, XMLHttpRequest, WebSocket and similar connections  |
| `frame-src`       | Controls nested browsing contexts such as iframes                    |
| `object-src`      | Controls plugins and embedded objects                                |
| `base-uri`        | Restricts the document's base URL                                    |
| `form-action`     | Restricts form submission destinations                               |
| `frame-ancestors` | Controls which sites can embed the application                       |

For example:

```http
Content-Security-Policy: default-src 'self'; object-src 'none'; base-uri 'self'
```

This means:

- Resources default to the application's own origin.
- Plugins and object embeds are disabled.
- An attacker cannot use an injected `<base>` element to change the base URL.

A critical distinction: `default-src` is a fallback, not a universal override. If you specify `script-src`, that directive controls scripts instead of inheriting `default-src`.

## 4. The Original CSP and Its Weaknesses

Our original production policy included permissive script and style directives:

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval'
    https://accounts.google.com https://apis.google.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:
    https://lh3.googleusercontent.com https://github.com;
  font-src 'self' data:;
  connect-src 'self' http://localhost:3000
    https://api.oocak.com
    https://accounts.google.com
    https://oauth2.googleapis.com
    https://www.googleapis.com;
  frame-src https://accounts.google.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self' https://accounts.google.com;
  frame-ancestors 'self';
```

This is a readable, multiline representation. The actual HTTP header is sent as a single line.

### Why `unsafe-inline` matters

Consider:

```html
<script>
  alert("JavaScript executed");
</script>
```

And:

```html
<button onclick="alert('JavaScript executed')">Click me</button>
```

With `script-src 'unsafe-inline'`, the policy permits these inline script execution patterns.

Now imagine an application has an XSS vulnerability and an attacker can inject HTML into a page.

A harmless demonstration payload is:

```html
<img src="x" onerror="alert(document.domain)" />
```

If the injected HTML reaches an unsafe rendering sink and the policy permits inline event handlers, the browser may execute the JavaScript.

This demonstrates why allowing arbitrary inline JavaScript weakens CSP.

### Why `unsafe-eval` matters

JavaScript can execute strings as code through APIs such as:

```js
eval("alert('Executed through eval')");
```

Or:

```js
const run = new Function("alert('Executed through Function')");
run();
```

With `unsafe-eval` in `script-src`, these string-to-code operations are permitted.

Without it, a restrictive script policy blocks these operations.

This does not mean that every use of `eval()` is an exploitable vulnerability. The risk depends on whether an attacker can influence the evaluated string. But permitting it unnecessarily expands the execution surface.

## 5. Removing `unsafe-eval` and `unsafe-inline`

We first removed `unsafe-eval` from the production script policy.

Then we removed `unsafe-inline` from `script-src`.

The resulting direction was:

```http
script-src 'self'
  https://accounts.google.com
  https://apis.google.com;
```

However, this introduced a compatibility problem.

Next.js uses inline scripts for framework functionality, including parts of the rendering and hydration process.

When we removed `unsafe-inline`, the browser began blocking scripts that did not have an approved nonce or hash. The application then encountered React rendering errors, including minified React error #412.

The lesson:

**Removing a permissive directive is not sufficient. The application must have an alternative mechanism for authorizing legitimate scripts.**

For our application, that mechanism was a per-request nonce.

## 6. Implementing Nonce-Based CSP in Next.js

A nonce is a randomly generated value associated with a particular HTTP response.

The server places the nonce in the CSP header and on the inline script or style elements that it intends the browser to trust.

For example:

```http
Content-Security-Policy:
  script-src 'self' 'nonce-abc123';
```

The corresponding HTML could contain:

```html
<script nonce="abc123">
  console.log("Authorized script");
</script>
```

The browser allows the script because its nonce matches the policy.

An injected script without the nonce is not authorized by that nonce source.

### Why the nonce must be unique

A nonce should be:

- Unpredictable.
- Generated using a cryptographically secure random source.
- Unique for each response.
- Kept out of reusable static HTML and shared caches.

If the same nonce is reused across many responses, an attacker who learns it may be able to reuse it.

This is why we generate a new nonce for each request.

### Our `middleware.ts` implementation

This is the implementation we used:

```tsx
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://accounts.google.com https://apis.google.com`,
    `style-src 'self' 'nonce-${nonce}'`,
    "img-src 'self' data: blob: https://lh3.googleusercontent.com https://github.com",
    "font-src 'self' data:",
    "connect-src 'self' http://localhost:3000 https://api.oocak.com https://accounts.google.com https://oauth2.googleapis.com https://www.googleapis.com",
    "frame-src https://accounts.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://accounts.google.com",
    "frame-ancestors 'self'",
  ].join("; ");

  const requestHeaders = new Headers(request.headers);

  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("Content-Security-Policy", csp);

  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
```

### Understanding the important parts

**1. Generate the nonce**

```tsx
const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
```

`crypto.randomUUID()` generates a random UUID. Base64 encoding produces a convenient nonce representation.

Base64 is an encoding, not encryption. The security comes from the unpredictability of the random value.

**2. Add the nonce to the policy**

```tsx
`script-src 'self' 'nonce-${nonce}' https://accounts.google.com https://apis.google.com`;
```

This authorizes scripts from the listed sources and inline scripts carrying the correct nonce.

**3. Forward the nonce to Next.js**

```tsx
requestHeaders.set("x-nonce", nonce);
requestHeaders.set("Content-Security-Policy", csp);
```

The incoming request headers are forwarded so that Next.js can inspect the policy and nonce while rendering the page.

**4. Set the response policy**

```tsx
response.headers.set("Content-Security-Policy", csp);
```

This is what tells the browser which policy to enforce.

The request-side and response-side headers serve different purposes. Forwarding the policy to the rendering process does not replace sending the policy to the browser.

**5. Exclude static assets and API routes**

Our matcher avoids running this page-rendering CSP middleware for the excluded paths.

The exclusions are specific to our application. They should be reviewed against the actual routes and security headers required by the API and static resources.

### A configuration detail to review

Our current `connect-src` includes:

```text
http://localhost:3000
```

That is useful for local development, but should not be present in the production CSP unless there is a deliberate reason for the production browser to connect to localhost.

Production and development policies should be separated.

For example, build the allowed connection origins from validated environment-specific configuration rather than shipping development origins in the production policy.

## 7. Why We Enabled Dynamic Rendering

We added this to the root layout:

```tsx
export const dynamic = "force-dynamic";
```

Why?

A static page can be generated once and reused. A nonce-based CSP requires a nonce associated with the current response.

Next.js needs request-time rendering to propagate the nonce into its generated HTML.

The trade-off is significant:

- Static rendering is disabled for routes under this layout.
- Incremental Static Regeneration is no longer available for those routes in the same way.
- Request-time rendering can increase server workload.
- Caching needs to be designed carefully to avoid reusing HTML with an old nonce.

This is an architectural decision, not simply a security header change.

## 8. Why Nonce-Based `style-src` Caused New Errors

After removing `unsafe-inline` from `style-src`, Chrome Headless began reporting violations.

Our policy now contained:

```http
style-src 'self' 'nonce-abc123';
```

This permits matching nonce-authorized style elements, but it does **not** authorize arbitrary style attributes.

For example, this is not authorized merely because the page has a nonce:

```html
<div style="color: red">Hello</div>
```

Nor is this:

```js
element.setAttribute("style", "color: red");
```

This distinction became important when we investigated the generated JavaScript chunks.

### Finding the source in the generated JavaScript

We found two relevant files:

```text
.next/static/chunks/1st3w0fdoswhf.js
.next/static/chunks/3e9ex-ikrrq04.js
```

We searched their contents:

```bash
grep -oE '.{0,120}(style\.cssText|style\.setProperty|\.style\.[a-zA-Z_$]+|style:).{0,160}' \
  .next/static/chunks/1st3w0fdoswhf.js | head -30
```

And:

```bash
grep -oE '.{0,120}(style\.cssText|style\.setProperty|\.style\.[a-zA-Z_$]+|style:).{0,160}' \
  .next/static/chunks/3e9ex-ikrrq04.js | head -30
```

The second file contained this code:

```js
let canvas = document.createElement("neural-canvas");

canvas.setAttribute("id", "neural-bg");

canvas.setAttribute(
  "style",
  "position: absolute; inset: 0; z-index: 0; pointer-events: none; width: 100%; height: 100%; opacity: 0.3;",
);
```

We traced the generated code back to:

```text
src/components/custom/neuralBackground.tsx
```

This is a useful security investigation technique: generated production chunks can help identify the source of browser violations when the browser does not make the original source obvious.

### The planned correction

Instead of applying an inline style attribute:

```js
canvas.setAttribute(
  "style",
  "position: absolute; inset: 0; z-index: 0; pointer-events: none; width: 100%; height: 100%; opacity: 0.3;",
);
```

Use a CSS class:

```js
canvas.classList.add("neural-background");
```

Then define the styling in an external stylesheet:

```css
.neural-background {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  width: 100%;
  height: 100%;
  opacity: 0.3;
}
```

This allows the browser to load the styles through the permitted same-origin stylesheet rather than an inline style attribute.

**Important:** This is a proposed correction based on the component code we identified. The complete component still needs to be reviewed and tested before declaring the violation resolved.

## 9. Understanding the Security Impact: Controlled Exploit Demonstrations

The following examples are for a local test page or a system you own. They demonstrate why CSP matters without attempting to steal credentials or access another person's data.

### Experiment A: Inline JavaScript Without CSP

Create a local HTML file:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>CSP Lab</title>
  </head>
  <body>
    <h1>CSP Experiment</h1>

    <div id="output"></div>

    <script>
      const params = new URLSearchParams(location.search);
      const input = params.get("message");

      document.querySelector("#output").innerHTML = input;
    </script>
  </body>
</html>
```

Serve it locally:

```bash
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000/?message=<img src=x onerror=alert(document.domain)>
```

If the input reaches `innerHTML` and no policy blocks the event handler, the alert can execute.

This is a simple reflected DOM-based XSS demonstration.

### Experiment B: Add a Restrictive CSP

Add this response header using a local server or proxy:

```http
Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none'; base-uri 'self'
```

Now test the same input.

The injected event handler should be blocked.

However, notice something important: the original application still uses `innerHTML`.

CSP has reduced the ability to execute the injected JavaScript, but the unsafe HTML insertion remains.

Fix the root cause:

```js
document.querySelector("#output").textContent = input;
```

This is the difference between mitigating an attack and removing its underlying vulnerability.

### Experiment C: Compare `unsafe-inline` and Nonce-Based CSP

Consider these two policies.

Permissive policy:

```http
Content-Security-Policy: script-src 'self' 'unsafe-inline'
```

Nonce-based policy:

```http
Content-Security-Policy: script-src 'self' 'nonce-random-value'
```

With the first policy, an inline script such as this is allowed:

```html
<script>
  alert("Inline JavaScript executed");
</script>
```

With the second policy, the script needs the matching nonce:

```html
<script nonce="random-value">
  alert("Authorized inline JavaScript");
</script>
```

This script has no nonce and should be blocked:

```html
<script>
  alert("This should be blocked");
</script>
```

The key security difference is that a nonce authorizes selected script elements rather than all inline scripts.

A nonce is not a substitute for output encoding or safe DOM APIs.

### Experiment D: Demonstrate `unsafe-eval`

With a policy that does not include `unsafe-eval`:

```http
Content-Security-Policy: script-src 'self'
```

Try:

```js
eval("alert('Testing eval')");
```

And:

```js
const test = new Function("return 2 + 2");
console.log(test());
```

The browser should block these string-to-code operations under the restrictive policy.

Now compare with:

```http
Content-Security-Policy: script-src 'self' 'unsafe-eval'
```

The operations are permitted.

This demonstrates why we removed `unsafe-eval` from the production policy.

### Experiment E: Test Inline Styles

Try this HTML:

```html
<div style="color: red">Inline style test</div>
```

Under:

```http
Content-Security-Policy: style-src 'self' 'nonce-random-value'
```

The style attribute is blocked.

But this is permitted:

```html
<link rel="stylesheet" href="/styles.css" />
```

provided `/styles.css` is served from the same origin.

And a nonce-authorized style element is permitted:

```html
<style nonce="random-value">
  .example {
    color: red;
  }
</style>

<div class="example">Nonce style test</div>
```

This experiment reproduces the distinction we encountered with `neural-canvas`.

## 10. How We Tested the Implementation

We used three different approaches: HTTP inspection, browser inspection, and ZAP.

They answer different questions.

### A. Inspect the Response Header

We ran:

```bash
curl -sS -D /tmp/oocak-headers.txt \
  http://localhost:5173/ \
  -o /tmp/oocak-home.html
```

Then:

```bash
grep -i content-security-policy /tmp/oocak-headers.txt
```

This lets us inspect the actual policy returned by the server.

### B. Inspect the HTML Nonce

We searched for the stylesheet link:

```bash
grep -oE '<link[^>]*stylesheet[^>]*>' /tmp/oocak-home.html
```

We found a link containing:

```html
<link
  rel="stylesheet"
  href="/_next/static/chunks/example.css"
  nonce="GENERATED_NONCE"
  data-precedence="next"
/>
```

We compared that nonce against the CSP header from the same response.

They matched.

This verified that the stylesheet link had the nonce expected by the response policy.

It did not prove that every inline style in the application was authorized.

### C. Inspect Chrome DevTools

We used Chrome Headless through ZAP and observed errors such as:

```text
Applying inline style violates the following Content Security Policy directive
'style-src ...'
```

These messages indicate that the browser blocked a style operation.

They do not automatically prove an exploitable vulnerability.

They can indicate:

- An application component relying on inline styles.
- A third-party library injecting styles.
- A component that needs to be refactored.
- A legitimate browser operation incompatible with the current policy.

We traced one such issue to the neural background component.

### D. Use ZAP

ZAP helps inspect HTTP responses and identify security configuration problems.

We observed that after introducing the stricter CSP, the CSP finding no longer appeared in the scan.

However, a clean ZAP header finding does not guarantee that every browser operation works correctly.

This is why we also inspected the Chrome Headless console.

**A security scanner checks configuration and behavior within its testing coverage. It cannot establish that the application is free of XSS or all other vulnerabilities.**

## 11. Further CSP Improvements to Consider

The following are possible future improvements, not changes we have already completed.

| Improvement                                  | Why consider it                                                                            |
| -------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `frame-ancestors 'none'`                     | Prevent other sites from embedding the application, if embedding is not required           |
| `upgrade-insecure-requests`                  | Upgrade eligible insecure resource requests to HTTPS                                       |
| CSP reporting endpoint                       | Collect violations for analysis                                                            |
| `report-to`                                  | Configure browser violation reporting                                                      |
| `strict-dynamic`                             | Allow trusted nonce-authorized scripts to load additional scripts under a strict CSP model |
| Remove unnecessary domains                   | Reduce the number of trusted resource origins                                              |
| Separate development and production policies | Avoid shipping development permissions in production                                       |
| Review `img-src data:` and `blob:`           | Remove them if the application does not require them                                       |
| Review `form-action` and `frame-src`         | Keep only the destinations required by the application                                     |

### Why `strict-dynamic` needs careful consideration

For example:

```http
script-src 'nonce-random-value' 'strict-dynamic'
```

This changes the trust model for scripts loaded by an authorized script.

It can be useful for applications with complex script-loading requirements, but you must understand which scripts receive trust and how they load other scripts.

It is not something to add automatically just because a security guide includes it.

### CSP Report-Only Mode

Another useful technique is to test a proposed policy without enforcing it.

For example:

```http
Content-Security-Policy-Report-Only:
  default-src 'self';
  script-src 'self' 'nonce-example';
  object-src 'none';
```

The browser reports violations but does not block the resources under that report-only policy.

This is useful when introducing CSP into a complex application because it allows you to identify legitimate dependencies before enforcing a stricter policy.

Be aware that a report-only policy does not replace the enforced CSP.

## 12. Current Project Status

This is the actual status of our work, not a list of tasks assumed to be finished.

### Implemented

- Initial CSP policy.
- Removal of production `unsafe-eval`.
- Removal of production script `unsafe-inline`.
- Per-request nonce generation.
- Nonce in `script-src`.
- Nonce in `style-src`.
- Request-header forwarding.
- CSP response header.
- Next.js dynamic rendering configuration.
- Verification of a Next.js stylesheet nonce.

### Pending Validation

- Refactor `neuralBackground.tsx` to use an external CSS class.
- Identify the remaining Chrome Headless style violations.
- Test Google authentication and other application flows.
- Confirm that the production CSP does not contain development-only origins.
- Run the final ZAP scan.
- Verify production deployment behavior and caching.

Our Git branch:

```text
security/csp-hardening
```

Suggested commit after validation:

```bash
git add next.config.ts src/app/layout.tsx middleware.ts \
  src/components/custom/neuralBackground.tsx

git commit -m "security: harden CSP with nonce-based policies"

git push -u origin security/csp-hardening
```

## 13. What to Remember

The most important lessons from this exercise:

1. **CSP is not a replacement for secure coding.** Fix unsafe HTML insertion, validate data, and encode output.
2. **`unsafe-inline` weakens script restrictions.** Nonces allow specific inline scripts instead.
3. **`unsafe-eval` enables string-to-code execution APIs.** Avoid it when possible.
4. **Nonces must be unpredictable and generated per response.**
5. **Next.js nonce support affects rendering and caching architecture.**
6. **A style nonce does not authorize arbitrary style attributes.**
7. **A scanner finding disappearing does not prove that the browser has no policy violations.**
8. **Test actual application functionality after tightening security controls.**

The most useful thing about this work is that we did not simply add a security header. We investigated the application's dependencies, identified why the original policy was permissive, introduced a stricter authorization mechanism, and traced a real browser violation back to application code.

## References and Further Reading

1. [OWASP Top 10:2025 — A02 Security Misconfiguration](https://owasp.org/Top10/2025/A02_2025-Security_Misconfiguration/)
2. [OWASP Next.js Security Cheat Sheet](https://cheatsheetseries.owasp.org/)
3. [MDN — CSP implementation guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)
4. [MDN — style-src directive](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/style-src)
5. [Next.js — Content Security Policy](https://nextjs.org/docs/app/guides/content-security-policy)
6. [MDN — Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

---

**Final takeaway:** Keep this as an A02 article and use the neural-canvas investigation as the practical case study. It is a stronger technical article when it distinguishes what we actually implemented, what we observed, and what remains to be tested rather than claiming the entire application is now secure.
