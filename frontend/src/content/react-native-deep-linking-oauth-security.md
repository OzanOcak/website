---
title: "Deep Linking in React Native: Routing, OAuth Callbacks, and Security"
slug: react-native-deep-linking-oauth-security
description: >-
  Understanding React Native deep linking, app routing, OAuth callbacks, and
  security considerations for custom URL schemes, Universal Links, and Android App Links.
imageUrl: /images/9.webp
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

In React Native, deep linking bridges the operating system's URL handling with your JavaScript navigation and application logic.

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

Universal Links and App Links provide a stronger domain-to-app association than custom schemes. However, their configuration and fallback behavior still need testing.

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

Imagine a React Native app that authenticates through an external browser while using an existing backend.

The flow is:

1. The app generates a random PKCE `code_verifier` and derives its `code_challenge`.
2. The app initiates the authorization flow with the backend.
3. The system authentication browser opens the identity provider's sign-in page.
4. The user authenticates, and the identity provider redirects to the backend's registered callback.
5. The backend completes the authorization-code exchange using the matching PKCE verifier.
6. The backend redirects to the app's registered deep link.
7. The app resumes and completes its own session-establishment flow with the backend.

For example:

```text
https://identity.example.com/oauth/callback
                 |
                 v
Backend completes OAuth exchange
                 |
                 v
oocakrn://oauth/callback
                 |
                 v
React Native app resumes
```

The backend callback and the mobile callback serve different purposes:

- **Backend callback:** Receives the identity provider's authorization response and completes the OAuth exchange.
- **Mobile callback:** Returns control to the application so it can finish establishing its own session.

The exact sequence depends on the authentication architecture. If the app itself performs the authorization-code exchange, it must retain the verifier securely and follow the provider's native-app OAuth requirements.

## Deep-Link Security Risks

A deep link is external input. Even if the operating system launches your app correctly, the application must not automatically trust the URL or its parameters.

### Risk 1: Custom Scheme Hijacking

Two apps can potentially register the same custom URL scheme. A malicious app may attempt to intercept a callback intended for your app.

PKCE protects the authorization code against redemption by a party that lacks the verifier. It does not guarantee that the correct app receives the callback, nor does it prevent every form of login disruption.

**Mitigation:** Prefer verified Universal Links or App Links when appropriate. Use PKCE for authorization-code flows, validate the OAuth transaction, and avoid exposing credentials in URLs.

### Risk 2: Untrusted Navigation

An attacker may craft a link that tries to send the application to an unexpected screen or trigger an unsafe action.

For example:

```text
oocakrn://admin/delete-account
```

Receiving such a URL must not automatically authorize an operation.

**Mitigation:** Allowlist supported hosts, paths, and actions. Require normal authentication and authorization checks for protected screens and operations.

### Risk 3: Credential Leakage

URLs can appear in logs, analytics, browser history, crash reports, or other diagnostic systems.

Putting access tokens, refresh tokens, passwords, or other long-lived credentials directly in deep links can expose them.

**Mitigation:** Avoid placing sensitive credentials in URLs. Keep OAuth codes short-lived, use PKCE, validate state, and exchange the callback for an application session through a controlled process.

### Risk 4: Replay and Forged Callbacks

An attacker may attempt to send a fabricated or previously captured callback to the application.

**Mitigation:** Bind callbacks to the original authorization transaction. Validate the expected state and transaction status, reject expired or reused authorization codes, and ensure the backend independently validates identity-provider responses.

## Security Checklist

Before shipping a deep-link-enabled React Native application:

- Register only the URL schemes, domains, and paths the app needs.
- Configure and verify Universal Links or Android App Links when appropriate.
- Handle both cold-start URLs and warm-start URL events.
- Validate incoming URLs before navigating.
- Keep authentication and authorization decisions on the backend.
- Use PKCE for authorization-code flows where required.
- Validate OAuth `state` and other relevant protocol parameters.
- Never treat a deep link as proof that a user is authenticated.
- Never put long-lived tokens in a URL.
- Test malformed links, duplicate callbacks, cancellation, expired sessions, and links received while the app is already open.

## Conclusion

Deep linking is the mechanism that connects external URLs to application behavior. In React Native, it depends on both native operating-system configuration and JavaScript routing.

For browser-based OAuth, it also provides the bridge back to the application after authentication. Custom URL schemes are convenient, while verified Universal Links and App Links offer stronger domain association.

The key principle is simple: **a deep link can tell the app what was requested, but it must never grant permission to perform the requested action.** Authentication, authorization, and credential validation must remain separate security responsibilities.

### Useful references for your implementation

\- [React Native: Linking API](https://reactnative.dev/docs/linking)\
\- [RFC 8252: OAuth 2.0 for Native Apps](https://datatracker.ietf.org/doc/html/rfc8252)\
\- [RFC 7636: Proof Key for Code Exchange (PKCE)](https://datatracker.ietf.org/doc/html/rfc7636)\
\- [Apple: Supporting Associated Domains](https://developer.apple.com/documentation/xcode/supporting-associated-domains)\
\- [Android: Verify Android App Links](https://developer.android.com/training/app-links/verify-android-applinks)\
