---
title: Building Custom Authentication with JWT, Refresh Tokens, and MFA
slug: custom-jwt-authentication
description: How I built a custom authentication system for my Next.js application using JWTs, database-backed refresh tokens, OAuth2 with PKCE, email OTP, TOTP, and role-based access control.
imageUrl: /images/9.webp
author: O. Ocak
date: 15.10.2026
tags:
  - Authentication
  - JWT
  - Security
  - Next.js
  - Node.js
published: true
---

# Building Custom Authentication with JWT, Refresh Tokens, and MFA

I built my authentication system from scratch to understand how authentication works beyond simply integrating a library. I wanted to understand how tokens are issued, how sessions are maintained, how refresh tokens are rotated, and how an application can support multiple authentication methods without losing control over its security model.

My application uses a Next.js frontend hosted on Vercel and an Express.js backend running on a Raspberry Pi. PostgreSQL stores application data, including the server-side information needed to manage refresh tokens and user accounts.

Rather than relying on a complete authentication framework, I implemented the authentication flows myself. This gave me more control over the architecture, but it also meant taking responsibility for token handling, session management, authorization, and security-related edge cases.

In this article, I'll explain why I chose this approach, how the token architecture works, and the security measures I implemented along the way.

## Why I Chose Client-Side Authentication

I chose to manage the authentication experience primarily in the client application rather than building the entire experience around server-managed sessions.

For my Next.js application, this approach allowed me to manage login states, token refreshes, protected routes, and API requests within the frontend while keeping authentication decisions on the backend.

There is an important distinction here: **client-side authentication logic does not mean trusting the client to enforce security.** The browser can manage the user experience, but the backend must still validate authentication and enforce authorization on every protected operation.

My main reasons for choosing this approach were:

- **Control:** I wanted to understand and implement the authentication lifecycle instead of depending on a complete authentication library.
- **Separation of responsibilities:** The frontend handles authentication state and API requests, while the backend validates credentials and protects resources.
- **Token-based API access:** JWTs allow the API to verify signed access tokens without requiring a traditional server-side session lookup for every authenticated request.
- **Learning:** Building the system helped me understand the trade-offs involved in authentication, token expiration, refresh-token rotation, and multi-factor authentication.

This approach introduced additional complexity. I had to consider expired tokens, concurrent requests, refresh failures, logout behavior, and how to prevent a compromised token from remaining useful indefinitely.

## Understanding My Token Architecture

The central part of my implementation is the relationship between the access token, the refresh token, and the server-side record associated with the refresh session.

These components have different responsibilities.

### Access token

The access token is a short-lived JWT used to authenticate API requests.

After successful authentication, the client can use the access token when calling protected backend endpoints. The Express.js backend verifies the token before allowing the request to proceed.

The short lifetime limits how long an access token remains valid after it has been issued. It does not eliminate the risk of token theft, but it reduces the period during which a stolen token can be reused.

### Refresh token

The refresh token allows the application to obtain a new access token without requiring the user to enter their credentials every time the access token expires.

In my implementation, the refresh token is associated with a server-side database record and is delivered through an HttpOnly cookie.

The HttpOnly attribute prevents ordinary JavaScript running in the browser from directly reading the cookie. This reduces exposure to token theft through certain cross-site scripting attacks, although it does not eliminate XSS risks or all cookie-related attack scenarios.

### Refresh-token identifier

I also use a refresh-token identifier on the client side. The identifier is associated with the refresh session, but it is not the refresh token itself.

Keeping these concepts separate matters. An identifier is not a substitute for a secret credential, and it should not independently authorize a session.

The backend uses the relevant session information when processing refresh requests and deciding whether a token can be renewed.

### How the components work together

At a high level, the authentication lifecycle looks like this:

1. The user signs in using an available authentication method.
2. The backend verifies the authentication attempt and issues the appropriate tokens.
3. The client uses the access token to make authenticated API requests.
4. When the access token expires, the client initiates a refresh request.
5. The backend validates the refresh-session information and checks the associated server-side state.
6. If the refresh request is valid, the backend issues a new access token and updates the refresh-session credentials as appropriate.
7. If the refresh request is invalid or the session has expired, the client must stop treating the user as authenticated and follow the appropriate recovery flow.

The goal is to separate frequent API authentication from the longer-lived process of maintaining a session.

## Refresh-Token Rotation and Session Management

Refresh tokens require particular care because they can be used to obtain new access tokens.

A long-lived refresh token that remains valid after being stolen can give an attacker continued access to an account. For that reason, refresh-token handling should include server-side validation, expiration, and a deliberate rotation strategy.

My implementation connects refresh-token handling to database-backed session information rather than relying exclusively on data held by the browser.

The intended flow is to validate the current refresh session before issuing replacement credentials. The previous refresh credential should no longer be accepted after a successful rotation.

This approach provides several advantages:

- **Server-side control:** Session information can be checked against database state.
- **Expiration:** Refresh credentials have a limited lifetime.
- **Rotation:** Replacing refresh credentials reduces reliance on a single long-lived token.
- **Session invalidation:** Server-side state can support logout and session revocation.
- **Additional validation:** The backend can reject refresh requests that do not satisfy the expected session requirements.

Rotation also introduces implementation challenges. Concurrent refresh requests, retries, and failures between issuing and storing replacement credentials can cause inconsistencies if they are not handled carefully.

For a robust implementation, rotation should be atomic where possible, and the application should have a clearly defined policy for handling reuse of an already-rotated refresh token.

A database record does not automatically make a token system secure. The actual security depends on how credentials are generated, stored, validated, rotated, expired, and revoked.

## Protecting the Authentication Flow

Building the authentication system myself meant I needed to think about security across the entire request lifecycle, not just the login endpoint.

### HttpOnly cookies

I use an HttpOnly cookie for the refresh token. This prevents client-side JavaScript from directly reading the refresh-token value.

Cookie security also depends on other settings, including Secure, SameSite, domain, path, and expiration. These must be configured appropriately for the application's deployment and cross-origin requirements.

HttpOnly cookies do not replace output encoding, input validation, or other defenses against XSS. Cookie-based authentication also requires appropriate consideration of cross-site request forgery.

### Short-lived access tokens

Short-lived access tokens reduce the amount of time a stolen token can remain useful.

The application must still validate token signatures, expiration, and the relevant claims. The backend should also verify that the authenticated identity has permission to perform the requested action.

### Server-side session validation

Keeping refresh-session information in PostgreSQL gives the backend a source of truth for refresh operations.

This makes it possible to apply expiration and revocation rules using server-side state instead of trusting the browser to decide whether a session is valid.

### Role-based access control

I implemented role-based access control (RBAC) so that authentication and authorization remain separate concerns.

Authentication answers the question, "Who is making this request?"

Authorization answers, "Is this user allowed to perform this operation?"

A valid JWT should not automatically grant access to every protected resource. The backend must enforce the required permissions on the relevant endpoints.

### Input validation

I use Zod to validate application data at appropriate boundaries.

Validation helps ensure that incoming data has the expected shape and types. It does not replace authorization checks, parameterized database queries, or context-specific security controls.

## Supporting Multiple Authentication Methods

I wanted the system to support different ways of authenticating without creating an entirely separate authorization model for each method.

### Email-based authentication and OTP

The application includes registration, login, password recovery, and email OTP flows.

Email OTP provides an additional verification step for supported workflows. OTPs need short expiration periods, attempt limits, and appropriate protections against replay and brute-force attacks.

An email OTP should not automatically be described as equivalent to a phishing-resistant authentication factor. Its security depends on the threat model and the protections surrounding the email account and verification flow.

### Google OAuth 2.0 with PKCE

I also implemented Google OAuth 2.0 with PKCE.

PKCE adds protection to the authorization-code flow by binding the authorization request to a verifier that is checked during code exchange. It helps protect against authorization-code interception.

OAuth configuration also requires correct redirect URI validation, state handling, and careful management of credentials and tokens. PKCE is an additional protection, not a replacement for the rest of the OAuth security model.

### TOTP-based multi-factor authentication

The application also includes TOTP-based multi-factor authentication.

TOTP generates time-based one-time codes from a shared secret. It can add a verification factor beyond a password, provided that enrollment, secret storage, verification, recovery, and rate limiting are implemented appropriately.

Adding multiple authentication methods made the system more flexible, but it also increased the number of security-sensitive flows I needed to test.

## Managing Authentication in the Frontend

The frontend is responsible for coordinating authentication state and making requests to the backend, but it must never be treated as the final security boundary.

I use an Axios interceptor to support authenticated API requests and token-refresh handling.

The intended behavior is straightforward:

1. Send an API request with the available access token.
2. Detect an authentication failure that indicates the access token has expired.
3. Initiate the refresh flow when appropriate.
4. Retry the original request with the renewed access token if refresh succeeds.
5. End or recover the authenticated client state if refresh fails.

This requires careful error handling. An interceptor should not endlessly retry requests, refresh in response to every kind of error, or trigger multiple competing refresh operations unnecessarily.

Concurrent requests are particularly important. If several API calls fail because the access token has expired at the same time, the client needs a consistent strategy for coordinating refresh requests.

The frontend can improve the user experience by handling these cases cleanly, but the backend must independently validate every protected request.

## Testing Beyond the Happy Path

An authentication system can appear to work correctly when testing only successful logins. The more revealing cases involve expiration, invalid credentials, interrupted requests, and unexpected sequences of operations.

I experimented with my authentication implementation on a Raspberry Pi with limited memory, including testing repeated refresh activity and multiple devices.

That work helped me think about the system as a long-running service rather than simply a set of endpoints that work individually.

Important cases to test include:

- Expired access tokens.
- Expired, invalid, or revoked refresh sessions.
- Attempts to reuse rotated refresh tokens.
- Logout followed by an attempted refresh.
- Multiple requests trying to refresh simultaneously.
- Invalid JWT signatures and malformed claims.
- Missing or incorrect authorization roles.
- Repeated OTP verification attempts.
- OAuth failures and invalid callback parameters.
- Network failures during token refresh.
- Session behavior across multiple devices.

Testing these scenarios is important because authentication bugs frequently occur at the boundaries between otherwise functional components.

## 8. Trade-Offs of Building Authentication From Scratch

Implementing authentication without a complete authentication library gave me direct experience with token lifecycles, OAuth, MFA, and authorization.

However, it also meant that I was responsible for more code and more security decisions.

A custom implementation can be useful for learning or when an application has specific requirements, but it is not automatically safer or simpler than a mature authentication solution.

Libraries and managed identity providers can reduce the amount of security-sensitive code an application needs to maintain. They also require careful configuration, dependency updates, and an understanding of their behavior.

My objective was to understand the underlying mechanisms rather than simply connect an application to an existing authentication provider.

The experience helped me see how individual decisions—token expiration, cookie configuration, refresh rotation, database state, and authorization checks—combine into a complete security model.

## Conclusion

Building this authentication system was an opportunity to explore the complete authentication lifecycle in a real application.

The architecture combines JWT access tokens, refresh-token handling, database-backed session information, Google OAuth 2.0 with PKCE, email OTP, TOTP, and role-based access control.

The biggest lesson was that authentication is not just about generating a token after login. It is about managing identity and trust throughout the lifetime of a session, including expiration, renewal, revocation, authorization, and failure recovery.

Implementing the system myself gave me a deeper understanding of these mechanisms and the trade-offs involved in maintaining them.

The project remains a learning experience and an evolving implementation. Security requires continued testing, dependency maintenance, and review rather than assuming that a working login flow is proof that the entire system is secure.
