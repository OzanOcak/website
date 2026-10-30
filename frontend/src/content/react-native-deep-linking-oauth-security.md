---
title: "Deep Linking in React Native: Routing, OAuth Callbacks, and Security"
slug: react-native-deep-linking-oauth-security
description: "Understanding React Native deep linking, app routing, OAuth callbacks, PKCE, and security considerations for custom URL schemes, Universal Links, and Android App Links."
imageUrl: /images/7.webp
author: ozan
date: 22.10.2026
tags:
  - React Native
  - Deep Linking
  - OAuth 2.0
  - PKCE
  - Cybersecurity
published: true
---

## Why Do React Native Apps Need Deep Links?

Normally, users open an app by tapping its icon. Deep linking allows an app to open a specific screen or handle a particular action from an external source.

For example:

- `oocakrn://blog/react-native` opens a blog screen.
- `https://oocak.com/blog/react-native` can open the same screen through a web link.
- `oocakrn://oauth/callback` can return the user to the app after browser-based authentication.

Deep links connect mobile apps to websites, emails, notifications, other applications, and external authentication providers.

In React Native, deep linking bridges the operating system's URL handling with its JavaScript navigation and application logic.

## The Three Main Types of Deep Links

### Custom URL Schemes

A custom scheme uses an application-defined protocol:

```text
oocakrn://oauth/callback
```

The app registers the scheme with iOS and Android. When the operating system receives a matching URL, it may launch the app and pass the URL to it.

**Advantages:** Simple to configure and useful for development or application-specific links.

**Security limitation:** Another installed app may register the same scheme. The operating system does not necessarily guarantee that your app alone receives the URL.

### Universal Links on iOS

Universal Links use regular HTTPS URLs:

```text
https://oocak.com/oauth/callback
```

The website publishes an Apple App Site Association (AASA) file that establishes an association between the domain and the app. The app must also have the appropriate Associated Domains entitlement.

When configured and verified correctly, iOS can open the associated app for eligible links.

### Android App Links

Android App Links also use HTTPS URLs. The app declares supported links, and the website publishes a Digital Asset Links file, usually at:

```text
https://oocak.com/.well-known/assetlinks.json
```

Android verifies the relationship between the domain and the app's signing identity.

Universal Links and App Links provide a stronger domain-to-app association than custom schemes. However, their configuration, verification, and fallback behavior still need testing.

## How Deep Linking Works in React Native

A typical deep-linking flow has four stages:

1. **URL creation:** A website, notification, browser, or authentication service creates or opens a URL.
2. **Operating-system resolution:** iOS or Android checks which app can handle the URL.
3. **Application delivery:** The operating system launches the app or delivers the URL to an already-running app.
4. **Application routing:** React Native parses the URL and navigates to the corresponding screen or processes the callback.

There are two important application states:

- **Cold start:** The app is not running when the link is opened. The initial URL must be handled.
- **Warm start:** The app is already running. A URL event is delivered to the application.

React Native exposes these mechanisms through the `Linking` API.

```typescript
import { Linking } from "react-native";

// Handle a URL that launched the app.
const initialUrl = await Linking.getInitialURL();

// Handle a URL delivered while the app is running.
const subscription = Linking.addEventListener("url", ({ url }) => {
  console.log("Received deep link:", url);
});

// Remove the listener when no longer needed.
subscription.remove();
```

This is a minimal illustration. A real application should register listeners at the appropriate lifecycle boundary, avoid duplicate handling, validate incoming URLs, and integrate the logic with its navigation system.

For a React Native CLI project, native configuration is also required. A JavaScript listener cannot receive a URL that iOS or Android has not configured to deliver.

## Deep Linking in OAuth 2.0 + PKCE

Deep linking is particularly important when an app uses browser-based OAuth authentication.

OAuth 2.0 allows an application to obtain authorization through an identity provider. OpenID Connect (OIDC), when used, adds an identity layer that helps the application establish who signed in.

PKCE (Proof Key for Code Exchange) protects authorization codes by requiring a party redeeming a code to demonstrate possession of a secret verifier.

A key distinction is that **the identity provider's authorization code and the application's own single-use code are not necessarily the same code**. A backend-mediated mobile authentication flow can use two separate exchanges.

### Understanding the Two PKCE Verifiers

In a backend-mediated architecture, two transactions may need protection:

**1. Google OAuth transaction**

The backend acts as the OAuth client. It generates and stores its own Google PKCE verifier, derives the corresponding challenge, and includes that challenge in the Google authorization request when supported.

When Google redirects to the backend, the backend exchanges Google's authorization code using its own stored verifier.

**2. Mobile application transaction**

The React Native app generates a separate PKCE verifier and challenge. The app keeps the verifier on the device and sends only the challenge to the backend when initiating the mobile flow.

After the backend completes Google's authentication, it creates a separate, short-lived, single-use application authorization code associated with the app's challenge.

The app receives that code through a deep link and redeems it by sending the code and its original verifier to the backend.

These are separate security relationships. The app's verifier cannot be used to redeem Google's authorization code unless it was specifically the verifier used for Google's request—and that would require the backend to possess it.

### A Secure Backend-Mediated OAuth Flow

Consider a React Native app called `oocakrn` that authenticates with Google through an existing backend.

The flow is:

1. **Generate the mobile PKCE pair.** The app generates a cryptographically random `code_verifier` and derives its `code_challenge` using SHA-256 and Base64URL encoding without padding, as specified by PKCE.

2. **Initiate authentication.** The app sends the `code_challenge` to `POST /api/oauth-mobile/url`. The mobile verifier stays on the device.

3. **Prepare Google's authorization request.** The backend creates a random OAuth `state` value and, when using PKCE with Google, generates a separate Google verifier and challenge. It securely associates the Google transaction and mobile challenge with the state.

4. **Open the system browser.** The app opens the returned Google authorization URL using an appropriate system authentication session or browser flow.

5. **Receive Google's callback.** After authentication, Google redirects to the registered backend callback with an authorization code and the original state.

6. **Validate and complete Google's exchange.** The backend validates the state, retrieves the corresponding Google verifier, exchanges Google's authorization code, and validates the resulting identity information.

7. **Create an application authorization code.** After successfully validating the identity, the backend generates a separate, cryptographically random, single-use code. It associates the code with the original mobile PKCE challenge and the necessary short-lived authentication transaction data.

8. **Redirect to the app.** The backend redirects to the registered app callback, carrying only the application authorization code:

   ```text
   oocakrn://oauth/callback?code=ONE_TIME_CODE
   ```

9. **Redeem the code.** React Native extracts and validates the callback URL, then sends the code and original mobile verifier to `POST /api/oauth-mobile/exchange`.

   ```json
   {
     "code": "ONE_TIME_CODE",
     "code_verifier": "ORIGINAL_DEVICE_VERIFIER"
   }
   ```

10. **Establish the application session.** The backend verifies that the code exists, has not expired or been used, and is bound to the matching PKCE challenge. It atomically consumes the code and issues the application's own access and refresh credentials.

11. **Store credentials appropriately.** The app stores its credentials using suitable secure storage and uses them for subsequent authenticated API requests.

The flow can be summarized as:

```text
React Native app
  |
  | Generate mobile verifier + challenge
  | POST challenge to backend
  v
Backend creates OAuth state and Google PKCE pair
  |
  v
System browser -> Google sign-in
  |
  v
Google redirects to backend callback
  |
  v
Backend validates state and exchanges Google's code
  |
  | Create single-use application code
  v
oocakrn://oauth/callback?code=ONE_TIME_CODE
  |
  v
React Native app resumes
  |
  | POST code + mobile verifier
  v
Backend validates PKCE and consumes the code
  |
  v
Application session and tokens issued
```

This approach separates identity-provider authentication from establishing the mobile application's own session.

### Why Not Put an Access Token in the Deep Link?

A tempting implementation is to redirect directly to the app with an access token:

```text
oocakrn://oauth/callback?accessToken=TEMPORARY_TOKEN
```

Even a short-lived token can be exposed if a custom scheme is intercepted or the URL appears in diagnostic logs.

A short expiration reduces the period of potential misuse, but it does not prevent interception. A short-lived, single-use authorization code bound to the mobile PKCE challenge is a safer handoff.

The application code is not itself an authenticated session. The backend issues application tokens only after the code and verifier have been validated.

### What Must the Backend Store?

The backend needs enough temporary information to validate each stage of the flow.

For example:

- OAuth state associated with the original transaction.
- The mobile application's PKCE challenge.
- The Google PKCE verifier, if PKCE is used for Google's authorization-code exchange.
- The short-lived application code and the transaction data needed to complete the exchange.
- Expiration and consumption status.

Temporary codes must be unpredictable, expire quickly, and be redeemable only once. Code consumption should be atomic to prevent concurrent redemption attempts.

An in-memory store can illustrate this flow during development, but it has limitations: pending transactions disappear when the process restarts, and multiple backend instances may not share the same state. A shared store with expiration and atomic operations is more suitable for a multi-instance deployment.

## Deep-Link Security Risks

A deep link is external input. Even if the operating system launches your app correctly, the application must not automatically trust the URL or its parameters.

### Risk 1: Custom Scheme Hijacking

Two apps can potentially register the same custom URL scheme. A malicious app may attempt to intercept a callback intended for your app.

PKCE protects an authorization code against redemption by a party that lacks the correct verifier. It does not guarantee that the correct app receives the callback, and it does not prevent every form of interception, denial of service, or login disruption.

**Mitigation:** Prefer verified Universal Links or Android App Links when appropriate. Use PKCE, validate the OAuth transaction, and avoid exposing credentials in URLs.

### Risk 2: Untrusted Navigation

An attacker may craft a link that tries to send the application to an unexpected screen or trigger an unsafe action.

For example:

```text
oocakrn://admin/delete-account
```

Receiving such a URL must not automatically authorize an operation.

**Mitigation:** Allowlist supported schemes, hosts, paths, and actions. Require normal authentication and authorization checks for protected screens and operations.

### Risk 3: Credential Leakage

URLs can appear in logs, analytics, crash reports, or other diagnostic systems. Browser history and other URL-handling components may also expose information depending on the flow.

Putting access tokens, refresh tokens, passwords, or other long-lived credentials directly in deep links can expose them.

**Mitigation:** Never place long-lived credentials in URLs. Use short-lived, single-use codes, bind the redemption to PKCE, validate state, and exchange the code through a controlled backend process.

### Risk 4: Replay and Forged Callbacks

An attacker may attempt to send a fabricated or previously captured callback to the application.

**Mitigation:** Bind callbacks to the original authorization transaction. Validate the expected state and transaction status, reject expired or reused codes, and independently validate identity-provider responses on the backend. A callback should never establish an authenticated session by itself.

### Risk 5: Account-Linking Errors

OAuth authentication can introduce account-linking risks if the backend automatically links an identity to an existing account based only on matching email addresses.

For example, an unverified or incorrectly trusted email match could associate an external identity with an account that belongs to someone else.

**Mitigation:** Validate the identity provider's response, require an appropriately verified email when relying on it, and check the exact provider and provider-user identifier before linking accounts. Handle conflicts safely instead of silently linking identities.

### Risk 6: Code Brute-Force and Concurrent Redemption

A single-use code should be practically impossible to guess, but the exchange endpoint is still exposed to incoming requests.

**Mitigation:** Generate codes using a cryptographically secure random source, apply expiration and atomic single-use enforcement, and rate-limit the exchange endpoint. Avoid revealing unnecessary details about why a code redemption failed.

## Security Checklist

Before shipping a deep-link-enabled React Native application:

- Register only the URL schemes, domains, and paths the app needs.
- Configure and verify Universal Links or Android App Links when appropriate.
- Handle both cold-start URLs and warm-start URL events.
- Validate incoming URLs before navigating.
- Keep authentication and authorization decisions on the backend.
- Use PKCE for authorization-code flows where required.
- Keep each PKCE verifier associated with the transaction it protects.
- Validate OAuth `state` and other relevant protocol parameters.
- Never treat a deep link as proof that a user is authenticated.
- Never put long-lived tokens in a URL.
- Expire and atomically consume one-time authorization codes.
- Protect account linking against unverified or conflicting identities.
- Apply suitable rate limits to authentication endpoints.
- Store mobile credentials using appropriate secure storage.
- Test malformed links, duplicate callbacks, cancellation, expired sessions, replay attempts, and links received while the app is already open.

## Conclusion

Deep linking connects external URLs to application behavior. In React Native, it depends on both native operating-system configuration and JavaScript routing.

For browser-based OAuth, deep linking also provides the bridge back to the application after authentication. Custom URL schemes are convenient, while verified Universal Links and Android App Links provide stronger domain-to-app association.

A backend-mediated OAuth flow adds another important distinction: the identity provider authenticates the user, while the application's backend establishes its own session. PKCE, transaction validation, short-lived single-use codes, and secure credential storage help protect the boundaries between these steps.

The key principle is simple: **a deep link can tell the app what was requested, but it must never grant permission to perform the requested action.** Authentication, authorization, and credential validation must remain separate security responsibilities.

## Useful References

- [React Native: Linking API](https://reactnative.dev/docs/linking)
- [RFC 8252: OAuth 2.0 for Native Apps](https://datatracker.ietf.org/doc/html/rfc8252)
- [RFC 7636: Proof Key for Code Exchange (PKCE)](https://datatracker.ietf.org/doc/html/rfc7636)
- [RFC 9700: Best Current Practice for OAuth 2.0 Security](https://datatracker.ietf.org/doc/html/rfc9700)
- [Apple: Supporting Associated Domains](https://developer.apple.com/documentation/xcode/supporting-associated-domains)
- [Android: Verify Android App Links](https://developer.android.com/training/app-links/verify-android-applinks)
