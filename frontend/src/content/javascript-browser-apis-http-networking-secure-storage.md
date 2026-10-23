---
title: "How JavaScript, Browser APIs, HTTP Networking, and Secure Storage Work"
slug: javascript-browser-apis-http-networking-secure-storage
description: "Understand how JavaScript communicates with browser internals, how HTTP requests carry cookies and authentication headers, why HttpOnly works, and how iOS Keychain and Android Keystore protect credentials."
imageUrl: /images/9.webp
author: ozan
date: 23.10.2026
tags:
  - JavaScript
  - Browser Internals
  - HTTP
  - Networking
  - Web Security
  - React Native
  - iOS
  - Android
published: true
---

# How JavaScript, Browser APIs, HTTP Networking, and Secure Storage Work

When you write JavaScript in a web application, you can make HTTP requests, navigate between pages, read certain cookies, and interact with the browser. But JavaScript cannot directly access every part of the browser's internal implementation.

Why?

Because **JavaScript runs inside an environment that exposes specific APIs instead of giving application code unrestricted access to the browser's internal memory and operating-system resources.**

Understanding this boundary explains several important security concepts:

- Why JavaScript cannot read an `HttpOnly` cookie.
- How the browser can send that same cookie to a server.
- How an HTTP request is constructed and transmitted.
- Why React Native handles authentication differently from a web browser.
- How iOS Keychain and Android Keystore help protect credentials.
- Why secure storage does not automatically make a credential inaccessible to application code.

We'll build a mental model from the bottom up, using JavaScript, simplified C code, HTTP messages, and native platform examples.

> **Code note:** The C examples in this article are illustrative pseudocode, not copied from Chrome, Safari, an operating system, or another browser's source code. They demonstrate the responsibilities and boundaries of the components involved. The Swift example uses Apple's real public APIs.

## JavaScript does not directly control the browser

Consider this JavaScript:

```javascript
console.log(document.cookie);

fetch("/api/profile");

window.location.href = "/login";
```

These statements use three browser APIs:

- `document.cookie` accesses cookies exposed to the current document.
- `fetch()` requests a resource over the network.
- `window.location` interacts with browser navigation.

JavaScript can call these APIs because the browser exposes them to the JavaScript environment.

But where are these functions actually implemented?

A simplified browser architecture looks like this:

```text
┌─────────────────────────────────────┐
│          Web application            │
│                                     │
│  JavaScript: fetch(), cookie, etc.  │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│          Browser APIs               │
│                                     │
│  Request creation                   │
│  Cookie access rules                │
│  Navigation                         │
│  Security checks                    │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│       Browser implementation        │
│                                     │
│  JavaScript engine                  │
│  Cookie storage                     │
│  Networking implementation          │
│  Browser process / other processes  │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│       Operating system              │
│                                     │
│  Network sockets                    │
│  Memory management                  │
│  Process isolation                  │
└─────────────────────────────────────┘
```

This is a conceptual diagram, not a universal process diagram. Modern browsers may use multiple processes, and their exact implementations differ.

The important distinction is that JavaScript interacts with browser functionality through defined interfaces. It does not automatically receive access to the browser's internal data structures or native functions.

### A simplified example of a browser API

Imagine a browser implemented in C++ that exposes a function to its JavaScript engine.

The native implementation might conceptually look like this:

```c
// Illustrative pseudocode, not actual browser source.

void browser_fetch(
    JavaScriptContext *context,
    JavaScriptArguments *arguments
) {
    const char *url = read_string_argument(arguments, 0);

    Request request = create_request(url);

    networking_start_request(&request);
}
```

The JavaScript engine connects the JavaScript call to the native implementation.

Your application writes:

```javascript
fetch("/api/profile");
```

The browser's implementation performs the native work behind that API.

You do not need to know how its request objects, networking threads, or internal memory structures are implemented to use `fetch()`.

The browser deliberately exposes a limited interface rather than allowing arbitrary JavaScript to call arbitrary native functions.

This boundary is one of the foundations of browser security.

## How the browser decides what JavaScript can access

Let's look at cookies.

Suppose a server responds with:

```http
HTTP/1.1 200 OK
Set-Cookie: session=abc123; HttpOnly; Secure; Path=/
Content-Type: application/json

{"authenticated":true}
```

The `Set-Cookie` response header instructs the browser to store a cookie.

The attributes have different purposes:

- `HttpOnly` prevents JavaScript from reading the cookie through interfaces such as `document.cookie`.
- `Secure` restricts transmission to secure connections, subject to the platform's rules and exceptions.
- `Path=/` specifies which URL paths match the cookie.

The browser's cookie storage manages the cookie and its attributes.

A simplified internal representation might look like this:

```c
// Illustrative C structure.

typedef struct {
    char *name;
    char *value;
    char *domain;
    char *path;

    bool http_only;
    bool secure;
} Cookie;
```

When the browser receives `Set-Cookie`, its cookie-handling implementation parses the header, applies the relevant rules, and stores an accepted cookie.

Conceptually:

```c
// Illustrative pseudocode.

void handle_set_cookie(Response *response) {
    Cookie cookie = parse_set_cookie(response);

    if (cookie_is_acceptable(&cookie, response)) {
        cookie_store_save(&cookie);
    }
}
```

The actual implementation is more involved. It must account for expiration, domain matching, `SameSite`, secure contexts, cookie policies, and other rules.

The important part is that the browser stores the cookie independently of whether JavaScript is allowed to read its value.

### What can JavaScript see?

Consider these two cookies:

```http
Set-Cookie: theme=dark; Path=/
Set-Cookie: session=abc123; HttpOnly; Secure; Path=/
```

JavaScript may be able to read the first cookie:

```javascript
console.log(document.cookie);

// Example output:
// theme=dark
```

But it cannot read the `session` cookie through `document.cookie`.

```javascript
console.log(document.cookie);

// The HttpOnly session cookie is not included.
```

The browser doesn't need to delete the cookie or hide it from every internal component. It simply restricts what the JavaScript-facing API exposes.

This is an example of **access control enforced by the implementation behind an API**.

Reference: [MDN — Document.cookie](https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie).

## Why can the browser send a cookie that JavaScript cannot read?

This is the key concept.

There are two different operations:

1. Letting JavaScript read a cookie's value.
2. Letting the browser attach that cookie to an HTTP request.

These operations do not have to share the same permission rules.

Imagine the browser exposes this simplified JavaScript-facing function:

```c
// Illustrative pseudocode.

char *get_cookie_for_javascript(Cookie *cookie) {
    if (cookie->http_only) {
        return NULL;
    }

    return cookie->value;
}
```

If JavaScript calls `document.cookie`, the browser's implementation exposes only the cookies allowed by that interface.

Now consider a request being sent to the server.

The browser's networking implementation performs a different operation:

```c
// Illustrative pseudocode.

void prepare_request(Request *request) {
    CookieList cookies =
        cookie_store_find_matching(request->url);

    for (int i = 0; i < cookies.count; i++) {
        Cookie *cookie = &cookies.items[i];

        if (cookie_matches_request_rules(cookie, request)) {
            add_cookie_to_request(request, cookie);
        }
    }
}
```

Notice what is missing: there is no rule that excludes every `HttpOnly` cookie.

The browser's networking implementation can attach a matching `HttpOnly` cookie because `HttpOnly` restricts JavaScript access, not normal cookie transmission.

The browser must still apply the cookie's domain, path, expiration, `Secure`, `SameSite`, and other applicable rules.

**The security boundary is between JavaScript's access to the cookie value and the browser's permitted use of that value.**

JavaScript asks the browser to perform an operation. The browser applies its own rules while performing it.

This is why an `HttpOnly` cookie can be used for authentication without exposing its value to page JavaScript.

Reference: [MDN — Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie).

## How an HTTP request is constructed and sent

Let's follow an authenticated request from your web application to your backend.

Your application calls:

```javascript
fetch("/api/profile", {
  credentials: "include",
});
```

For browser `fetch()`, `credentials: "include"` allows credentials to be included even for cross-origin requests, subject to cookie policies and other restrictions. The default is `same-origin`.

What happens next?

### Step 1: JavaScript requests an operation

The JavaScript engine executes the call to `fetch()` and passes the request information to the browser's implementation.

The request might contain:

```text
URL: https://example.com/api/profile
Method: GET
```

JavaScript does not need to construct every protocol-level detail manually.

### Step 2: The browser prepares the request

The browser determines the applicable request configuration and looks up eligible cookies.

Suppose its cookie store contains:

```text
theme=dark
session=abc123; HttpOnly
```

If both cookies match the request's rules, the browser can prepare this HTTP request:

```http
GET /api/profile HTTP/1.1
Host: example.com
Cookie: theme=dark; session=abc123
Accept: */*
```

This is a simplified HTTP/1.1 representation. Actual browser traffic may use HTTP/2 or HTTP/3, where headers are represented differently on the wire.

JavaScript did not read the `session` cookie. The browser's networking implementation retrieved it from its cookie store and attached it to the request.

### Step 3: The operating system transports the data

The browser's networking implementation uses operating-system networking facilities to communicate with the server.

At a simplified level:

```text
Browser networking implementation
              │
              ▼
      OS networking APIs
              │
              ▼
        TCP or QUIC
              │
              ▼
       Network interface
              │
              ▼
           Internet
              │
              ▼
        Backend server
```

This is an abstraction. TLS encryption, process boundaries, proxies, DNS resolution, connection reuse, and other details may introduce additional components.

The OS networking layer transports data. It does not decide whether your application user is authorized to view a profile.

Your backend must validate the received credential and apply authorization rules.

### Step 4: The server responds

The backend may return:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{"id":"123","username":"ozan"}
```

The browser receives the response, and the `fetch()` promise resolves to a `Response` object.

JavaScript can read the response body if the applicable browser security rules permit it:

```javascript
const response = await fetch("/api/profile", {
  credentials: "include",
});

if (!response.ok) {
  throw new Error("Request failed");
}

const profile = await response.json();

console.log(profile.username);
```

The browser can therefore use a credential that the application JavaScript cannot read.

That is the practical value of `HttpOnly`.

## Cookies and Authorization headers are different mechanisms

You may already use both mechanisms in your authentication system.

### Cookie-based authentication

The server sends a cookie:

```http
Set-Cookie: refreshToken=secret-value; HttpOnly; Secure; Path=/
```

The browser stores it and attaches it to eligible requests.

```http
GET /api/refresh HTTP/1.1
Host: example.com
Cookie: refreshToken=secret-value
```

JavaScript does not need to know the cookie's value.

### Bearer-token authentication

Alternatively, JavaScript can hold an access token and add it to a request:

```javascript
fetch("/api/profile", {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
```

The resulting request contains:

```http
GET /api/profile HTTP/1.1
Host: example.com
Authorization: Bearer eyJ...
```

In this case, the JavaScript code has access to the token because it constructs the header.

The browser does not automatically turn every token stored in JavaScript into an authorization header. Your application code or an HTTP library, such as Axios, must add it.

| Property                                    | HttpOnly cookie                              | Bearer token in JavaScript                                                         |
| ------------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------- |
| JavaScript reads the credential             | No                                           | Yes, if the token is held in JavaScript                                            |
| Browser can attach credential automatically | Yes, when cookie rules allow                 | No; application code normally adds the header                                      |
| Automatically sent to matching endpoints    | According to cookie rules                    | Only when the application adds it                                                  |
| CSRF considerations                         | Important for cookie-authenticated requests  | Different risk profile; XSS can still steal or use a token available to JavaScript |
| Protection against XSS token theft          | Helps prevent direct cookie-value extraction | Does not prevent theft of a token accessible to JavaScript                         |

Neither mechanism eliminates all security risks. Cookies can be vulnerable to CSRF if the application is not designed appropriately, while JavaScript-accessible tokens can be stolen by malicious script execution.

## What changes in React Native?

React Native gives JavaScript APIs such as `fetch()` and `XMLHttpRequest` for networking. You can use Axios on top of these APIs.

For example:

```typescript
const response = await fetch("https://api.example.com/profile", {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
```

The app's JavaScript requests an HTTP operation, and React Native's native networking implementation carries it out.

But React Native is not a normal web browser.

It does not automatically give the app the same integrated browser cookie environment used by a web page.

Consider a Google sign-in flow:

```text
System browser
    │
    │ User signs in to Google
    ▼
Your backend OAuth callback
    │
    │ Sets a cookie in the browser's environment
    ▼
System browser
```

Your React Native app has its own JavaScript runtime and native networking implementation.

A cookie set by the system browser is not automatically shared with the app's networking implementation. Browser and native-app storage are separate environments, and the app should not assume it can access the browser's cookie jar.

### Can React Native use cookies?

Yes. Native networking implementations can support cookie storage and cookie transmission. React Native does not fundamentally prohibit cookie-based authentication.

However, its networking behavior is not identical to a full browser. The React Native networking documentation has also documented limitations with cookie-based authentication, including cookie handling around redirects.

Reference: [React Native — Networking](https://reactnative.dev/docs/network).

For an application that already has a web authentication system, the important question is not whether cookies are theoretically possible. It is how the mobile app will securely receive, store, and send its credentials across the native authentication flow.

## iOS: URLSession and HTTP cookie storage

On iOS, Apple's Foundation framework provides `URLSession` for network requests and `HTTPCookieStorage` for HTTP cookies.

A simplified Swift example using Apple's actual APIs looks like this:

```swift
import Foundation

let configuration = URLSessionConfiguration.default

configuration.httpCookieStorage =
    HTTPCookieStorage.shared

configuration.httpShouldSetCookies = true

let session = URLSession(
    configuration: configuration
)

let url = URL(
    string: "https://example.com/api/profile"
)!

let task = session.dataTask(with: url) {
    data, response, error in

    if let error = error {
        print("Request failed:", error)
        return
    }

    guard let data = data else {
        return
    }

    print(String(data: data, encoding: .utf8) ?? "")
}

task.resume()
```

This example configures a `URLSession` to use shared HTTP cookie storage and allows cookies to be set on requests.

Apple also supports other session configurations, including ephemeral sessions with private, in-memory cookie storage.

Reference: [Apple — URLSessionConfiguration.httpCookieStorage](https://developer.apple.com/documentation/foundation/urlsessionconfiguration/httpcookiestorage).

But here is the important distinction:

**`HTTPCookieStorage` is a cookie-management API. It is not automatically the same security boundary as a browser's JavaScript-facing `HttpOnly` implementation.**

`HttpOnly` is a cookie attribute enforced by the relevant user agent. You should not assume that every native API or React Native bridge enforces the same JavaScript access restrictions as Safari.

If a native module makes a cookie's value available to React Native JavaScript, that value is accessible to the JavaScript code receiving it.

So cookie storage and cookie confidentiality are related, but they are not identical concepts.

## iOS Keychain: storing credentials outside ordinary application storage

Suppose a native application needs to persist a refresh token after the user signs in.

One option is the iOS Keychain.

Apple's Keychain Services API provides encrypted storage for small secrets, such as passwords, tokens, and cryptographic keys.

Conceptually, the flow looks like this:

```text
React Native JavaScript
          │
          │ Calls a native module
          ▼
Native Swift / Objective-C code
          │
          │ Keychain Services API
          ▼
      iOS Keychain
          │
          ▼
Protected credential storage
```

The actual storage and protection details are managed by the operating system.

### A simplified Swift example

This example shows the real Keychain Services APIs for storing and retrieving a generic secret. Error handling and production concerns are abbreviated.

```swift
import Foundation
import Security

func saveSecret(_ secret: String) -> OSStatus {
    let data = Data(secret.utf8)

    let query: [String: Any] = [
        kSecClass as String: kSecClassGenericPassword,
        kSecAttrService as String: "com.example.myapp",
        kSecAttrAccount as String: "refresh-token",
        kSecValueData as String: data,
        kSecAttrAccessible as String:
            kSecAttrAccessibleWhenUnlockedThisDeviceOnly
    ]

    // A real implementation should handle an existing item,
    // for example by updating it or deleting it before adding.
    return SecItemAdd(query as CFDictionary, nil)
}
```

To retrieve the stored value:

```swift
func loadSecret() -> String? {
    let query: [String: Any] = [
        kSecClass as String: kSecClassGenericPassword,
        kSecAttrService as String: "com.example.myapp",
        kSecAttrAccount as String: "refresh-token",
        kSecReturnData as String: true,
        kSecMatchLimit as String: kSecMatchLimitOne
    ]

    var result: CFTypeRef?

    let status = SecItemCopyMatching(
        query as CFDictionary,
        &result
    )

    guard status == errSecSuccess,
          let data = result as? Data else {
        return nil
    }

    return String(data: data, encoding: .utf8)
}
```

The calls `SecItemAdd` and `SecItemCopyMatching` are real Apple APIs. The sample illustrates the basic storage operation, not a complete production credential manager.

The chosen accessibility setting means the item is available when the device is unlocked and is restricted to that device's keychain context rather than being migratable to another device through normal backup restoration. Choose accessibility based on your app's actual requirements.

Reference: [Apple — Keychain Services](https://developer.apple.com/documentation/security/keychain-services).

### Does Keychain mean JavaScript can never read the token?

No.

If a React Native app calls a native module to retrieve a token from Keychain, the native module can return the token to JavaScript.

Once returned, the JavaScript runtime can access it.

Keychain protects the stored credential and controls access to it. It does not magically prevent authorized application code from using a credential that the application itself retrieves.

This is why a common design is to keep a refresh credential in secure storage and keep the short-lived access token in memory for API requests.

The exact implementation depends on the app's architecture and threat model.

## Android: Keystore is not exactly the same as Keychain

Android provides the Android Keystore system for managing cryptographic keys.

The distinction matters: **Keystore primarily protects cryptographic key material; it is not simply a generic token-storage database equivalent to a cookie jar.**

A common secure-storage design is:

1. Generate or obtain an encryption key managed by Android Keystore.
2. Encrypt a credential before persisting it.
3. Store the encrypted credential in app-private storage.
4. Retrieve the encrypted value when needed.
5. Ask the platform to perform the required cryptographic operation using the protected key.

Conceptually:

```text
Refresh token
     │
     ▼
App encrypts using a Keystore-managed key
     │
     ▼
Encrypted token stored in app-private storage
     │
     ▼
App reads encrypted token later
     │
     ▼
Keystore-managed key decrypts it
     │
     ▼
Token becomes available to the app
```

A simplified Kotlin illustration of obtaining an Android Keystore key looks like this:

```kotlin
import java.security.KeyStore

val keyStore = KeyStore.getInstance("AndroidKeyStore")
keyStore.load(null)

// A key generated and stored in Android Keystore
// can be retrieved by its alias.
val key = keyStore.getKey("refresh-token-encryption", null)
```

This code assumes the key already exists. A complete implementation must generate the key, choose appropriate cryptographic parameters, encrypt and decrypt the stored value, and handle errors.

The important property is that a Keystore-managed key can be non-exportable: the application can request an authorized cryptographic operation without receiving the key material itself.

Depending on the device and key configuration, protection may be backed by secure hardware.

Reference: [Android — Keystore system](https://developer.android.com/privacy-and-security/keystore).

### What can JavaScript access?

As with iOS, if a React Native native module decrypts a token and returns it to JavaScript, JavaScript can access that returned token.

The Keystore can protect the encryption key from extraction, but it cannot prevent application code from using plaintext data that the application has legitimately obtained.

## Three different kinds of protection

The concepts are easier to remember when we separate them.

| Mechanism                 | What it protects or controls                                                                 | What it does not guarantee                                                       |
| ------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Browser `HttpOnly` cookie | Prevents page JavaScript from reading that cookie through normal cookie APIs                 | Does not prevent the browser from sending it or eliminate every XSS or CSRF risk |
| iOS Keychain              | Protects stored secrets and controls access according to item attributes and platform policy | Does not prevent app code from reading a secret it retrieves                     |
| Android Keystore          | Protects cryptographic keys and restricts how they may be used                               | Does not automatically protect every plaintext token stored elsewhere            |

These mechanisms solve related but different problems.

A browser's `HttpOnly` cookie primarily establishes an access boundary between page JavaScript and cookie values.

Keychain and Keystore provide OS-level mechanisms for protecting secrets or cryptographic keys.

Neither removes the need to secure the application code that uses those credentials.

## Connecting this to OAuth, PKCE, and React Native

Now we can connect these concepts to a practical authentication flow.

In a web application, your backend may set an `HttpOnly` cookie and redirect the browser to your Next.js app. The browser can send the cookie on later requests without exposing its value to JavaScript.

In a native application, the system browser used for OAuth and the React Native app are separate environments. The app should not rely on automatically inheriting the browser's cookie storage.

A recommended mobile flow is:

```text
React Native app
    │
    │ Generate PKCE verifier + challenge
    ▼
Backend starts OAuth flow
    │
    ▼
System browser → Google sign-in
    │
    ▼
Backend OAuth callback
    │
    │ Validate OAuth state
    │ Exchange Google's authorization code
    │ Verify the identity
    │ Create a short-lived, single-use app code
    ▼
Deep link back to React Native
    │
    │ Contains the single-use code, not a JWT
    ▼
React Native app
    │
    │ POST code + PKCE verifier over HTTPS
    ▼
Backend validates and consumes the code
    │
    │ Issues application credentials
    ▼
React Native app
    │
    ├── Short-lived access token in memory
    │
    └── Persistent refresh credential in secure storage
```

The single-use code is a handoff mechanism. It allows the application to return from the system browser without putting a reusable application token in the deep-link URL.

The PKCE verifier proves that the party exchanging the app code possesses the secret associated with the original challenge. The backend must also validate expiration and enforce single-use redemption.

There are two separate authorization-code exchanges in this backend-mediated design:

- The backend exchanges Google's authorization code with Google, using the verifier associated with Google's OAuth transaction if PKCE is used there.
- The React Native app exchanges the separate application code with your backend using the app-generated PKCE verifier.

These are different transactions with different verifiers.

For the mobile application's subsequent API requests, the app can add its access token explicitly:

```typescript
const response = await fetch("https://api.example.com/profile", {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
```

When the access token expires, the app can use its securely stored refresh credential to obtain a new one, provided the backend validates the refresh credential and its associated session or token record.

Secure storage protects the persisted credential at rest. HTTPS protects it while being transmitted. Token expiry, refresh-token rotation, revocation, and backend authorization provide additional layers of security.

No single mechanism replaces the others.

For the OAuth standards and native-app recommendations, see [RFC 7636 — PKCE](https://www.rfc-editor.org/rfc/rfc7636), [RFC 8252 — OAuth 2.0 for Native Apps](https://www.rfc-editor.org/rfc/rfc8252), and [RFC 9700 — OAuth 2.0 Security Best Current Practice](https://www.rfc-editor.org/rfc/rfc9700).

## The mental model to remember

When you call an API from JavaScript, you're not directly controlling every internal operation. You're asking an implementation to perform an operation through an exposed interface.

In a browser:

- JavaScript calls browser APIs.
- The browser applies its security rules.
- The browser's cookie storage keeps cookie state.
- The networking implementation attaches eligible cookies to requests.
- The operating system provides lower-level networking facilities.
- The backend validates credentials and authorizes access.

In a React Native app:

- JavaScript calls React Native networking APIs.
- Native networking implementations perform HTTP requests.
- The app can use authorization headers or native cookie handling.
- Keychain or Keystore-backed storage can protect persistent credentials.
- A native module can still expose a stored credential to JavaScript if the app asks for it.
- The backend remains responsible for authentication and authorization.

The core principle is simple:

**Security depends on which component can access a credential, what that component is allowed to do with it, and how the credential is protected while stored and transmitted.**

Once you understand that boundary, `HttpOnly`, browser networking, native secure storage, and the OAuth handoff stop looking like unrelated technologies. They're different mechanisms for managing access to credentials across different execution environments.

## References

- [MDN — Using HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies)
- [MDN — Using the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [MDN — Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie)
- [React Native — Networking](https://reactnative.dev/docs/network)
- [Apple — URLSessionConfiguration.httpCookieStorage](https://developer.apple.com/documentation/foundation/urlsessionconfiguration/httpcookiestorage)
- [Apple — Keychain Services](https://developer.apple.com/documentation/security/keychain-services)
- [Android — Keystore system](https://developer.android.com/privacy-and-security/keystore)
- [RFC 7636 — Proof Key for Code Exchange (PKCE)](https://www.rfc-editor.org/rfc/rfc7636)
- [RFC 8252 — OAuth 2.0 for Native Apps](https://www.rfc-editor.org/rfc/rfc8252)
- [RFC 9700 — OAuth 2.0 Security Best Current Practice](https://www.rfc-editor.org/rfc/rfc9700)
