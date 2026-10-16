---
title: Building Custom Authentication with JWT, Refresh Tokens, and MFA
slug: custom-jwt-authentication
description: How I built a custom authentication system for my Next.js application using JWTs, HttpOnly refresh-token cookies, rotating refresh-token IDs, Google OAuth 2.0 with PKCE, email OTP, TOTP, and role-based access control.
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

I built my authentication system from scratch to understand how authentication works beyond simply integrating a library. I wanted to understand how tokens are issued, how sessions are maintained, how refresh-token IDs are rotated, and how an application can support multiple authentication methods while maintaining a consistent security model.

My application uses a Next.js frontend hosted on Vercel and an Express.js backend running on a Raspberry Pi. PostgreSQL stores application data, including user accounts and the server-side information needed to manage refresh sessions.

Rather than relying on a complete authentication framework, I implemented the authentication flows myself. This gave me more control over the architecture, but it also meant taking responsibility for token handling, session management, authorization, and security-related edge cases.

In this article, I'll explain why I chose this approach, how the token architecture works, and the security considerations involved in maintaining authentication throughout a session.

## Why I Chose Client-Side Authentication

I chose to manage the authentication experience primarily in the client application rather than building the entire experience around server-managed sessions.

For my Next.js application, this approach allows me to manage authentication state, token refreshes, protected routes, and API requests in the frontend while keeping authentication and authorization decisions on the backend.

There is an important distinction here: **client-side authentication logic does not mean trusting the client to enforce security.** The browser can coordinate the user experience, but the backend must validate credentials and enforce authorization on every protected operation.

My main reasons for choosing this approach were:

- **Control:** I wanted to understand and implement the authentication lifecycle instead of depending on a complete authentication library.
- **Separation of responsibilities:** The frontend coordinates authentication state and API requests, while the backend validates tokens and protects resources.
- **Token-based API access:** JWTs allow the API to validate signed access tokens without requiring a traditional server-side session lookup for every authenticated request.
- **Learning:** Building the system helped me understand the trade-offs involved in token expiration, refresh-token handling, rotation, and multi-factor authentication.

This approach introduced additional complexity. I had to consider expired tokens, concurrent requests, refresh failures, logout behavior, and how to prevent invalid or compromised credentials from remaining useful.

## Understanding My Token Architecture

My implementation separates three components: the access token, the refresh token, and the refresh-token ID.

Each has a different responsibility, and understanding the distinction is important to understanding how my authentication system works.

### Access token

The access token is a short-lived JSON Web Token (JWT) used to authenticate API requests.

After successful authentication, the client uses the access token when calling protected backend endpoints. The Express.js backend validates the token before allowing the request to proceed.

The short lifetime limits how long an access token remains valid after it has been issued. It does not eliminate the risk of token theft, but it reduces the period during which a stolen token can be reused.

### Refresh token

The refresh token allows the application to obtain a new access token without requiring the user to enter their credentials every time the access token expires.

In my implementation, **the refresh token is delivered through an HttpOnly cookie and is never stored in PostgreSQL or local storage**. The browser sends the cookie with eligible refresh requests, allowing the backend to validate the refresh flow without exposing the refresh-token value to ordinary client-side JavaScript.

The HttpOnly attribute prevents JavaScript running in the browser from directly reading the cookie. This reduces exposure to refresh-token theft through certain cross-site scripting (XSS) attacks, although it does not eliminate all XSS risks or prevent malicious scripts from initiating requests through the browser.

### Refresh-token ID

I use a separate refresh-token ID to identify the refresh session. Unlike the refresh token itself, this identifier is stored in both PostgreSQL and the browser's local storage.

The ID connects the client-side refresh flow to the corresponding server-side session record. When the access token expires, the client provides the current refresh-token ID as part of the refresh request, while the browser sends the HttpOnly refresh-token cookie.

The backend validates the refresh-token credential and checks the identifier against its database record before issuing a new access token.

**The refresh-token ID rotates after every successful use and has its own expiration.** After a successful rotation, the previous ID must no longer be accepted under the rotation policy.

The ID is not the refresh token itself, and storing it in local storage does not make it a secret. Its purpose is to identify the refresh session, while the HttpOnly cookie carries the actual refresh-token credential.

```text
Access token expires
       │
       ▼
Browser sends refresh request
       │
       ├── Refresh-token ID (JWT)
       │
       └── HttpOnly cookie
               │
               ▼
       Express.js validates
       cookie + database ID (Rotates)
               │
         ┌─────┴─────┐
         ▼           ▼
       Valid     Invalid
         │           │
         ▼           ▼
    Issue new      Reject refresh
    access token   Require login
    Rotate ID
         │
         ▼
    Store new ID
    in localStorage
```

### How the components work together

At a high level, the authentication lifecycle looks like this:

1. The user signs in using an available authentication method.
2. The backend validates the authentication attempt and issues an access token, establishes the HttpOnly refresh-token cookie, and creates the corresponding refresh-session record.
3. The client stores the refresh-token ID in local storage and uses the access token to make authenticated API requests.
4. When the access token expires, the client initiates a refresh request using the current refresh-token ID. The browser sends the HttpOnly cookie according to its configuration.
5. The backend validates the refresh-token credential and checks the associated database record.
6. If the request is valid, the backend issues a new access token and rotates the refresh-token ID. The client replaces the previous ID with the new one.
7. If validation fails or the session expires, the backend rejects the refresh request and the client handles reauthentication.

The goal is to separate frequent API authentication from the longer-lived process of maintaining a session.

## Refresh-Token Rotation and Session Management

Refresh-token handling requires particular care because refresh credentials can be used to obtain new access tokens.

My implementation uses a rotating refresh-token ID and database-backed session information rather than storing the refresh-token value itself in the database.

After a successful refresh, the ID is replaced with a new one. The backend uses PostgreSQL to validate the current ID and maintain the associated session state.

This approach provides several benefits:

- **Server-side validation:** The backend checks the supplied ID against the corresponding database record.
- **Expiration:** Refresh-session information has a limited lifetime, and expired sessions must be rejected.
- **Rotation:** Replacing the ID after successful use reduces reliance on a single, reusable identifier.
- **Session invalidation:** Server-side state can support logout and session revocation.
- **Separation of credentials:** The refresh token remains in the HttpOnly cookie rather than being stored in browser-accessible local storage or PostgreSQL.

Rotation also introduces implementation challenges. Concurrent refresh requests, retries, and failures during session updates can cause inconsistencies if they are not handled carefully.

For a robust implementation, the backend should ensure that the same ID cannot be successfully consumed multiple times. Atomic database updates or transactions can help enforce this, depending on the implementation.

The client also needs to coordinate concurrent refresh requests so that multiple API failures do not trigger conflicting refresh operations.

A database record does not automatically make a token system secure. The actual security depends on how credentials are generated, stored, validated, rotated, expired, and revoked.

## Protecting the Authentication Flow

Building the authentication system myself meant thinking about security across the entire request lifecycle, not just the login endpoint.

### HttpOnly cookies

I use an HttpOnly cookie to carry the refresh token. This prevents ordinary client-side JavaScript from directly reading the refresh-token value.

Cookie security also depends on other settings, including `Secure`, `SameSite`, domain, path, and expiration. These must be configured appropriately for the application's deployment and cross-origin requirements.

HttpOnly cookies do not replace output encoding or other defenses against XSS. Cookie-based authentication also requires appropriate consideration of cross-site request forgery (CSRF).

### Short-lived access tokens

Short-lived access tokens reduce the amount of time a stolen token can remain useful.

The backend must validate token signatures, expiration, and relevant claims. It should also verify that the authenticated identity has permission to perform the requested action.

### Server-side session validation

Keeping refresh-session information in PostgreSQL gives the backend a source of truth for refresh operations.

The backend can use this state to enforce expiration, reject invalid IDs, and support session invalidation rather than relying on the browser to decide whether a session remains valid.

The refresh-token ID is not sufficient to authenticate a session on its own. The backend must also validate the refresh-token credential presented through the HttpOnly cookie.

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

Email verification should not automatically be described as equivalent to phishing-resistant multi-factor authentication. Its security depends on the threat model and the protections surrounding the email account and verification flow.

### Google OAuth 2.0 with PKCE

I also implemented Google OAuth 2.0 with Proof Key for Code Exchange (PKCE).

PKCE adds protection to the authorization-code flow by binding the authorization request to a verifier that is checked during code exchange. It helps protect against authorization-code interception.

OAuth configuration also requires correct redirect URI validation, state handling, and careful management of credentials and tokens. PKCE is an additional protection, not a replacement for the rest of the OAuth security model.

### TOTP-based multi-factor authentication

The application also includes time-based one-time password (TOTP) authentication.

TOTP generates time-based verification codes from a shared secret. It can add another verification factor beyond a password, provided that enrollment, secret storage, verification, recovery, and rate limiting are implemented appropriately.

Adding multiple authentication methods made the system more flexible, but it also increased the number of security-sensitive flows I needed to test.

## Managing Authentication in the Frontend

The frontend coordinates authentication state and API requests, but it must never be treated as the final security boundary.

I use an Axios interceptor to support authenticated API requests and access-token refresh handling.

The intended behavior is straightforward:

1. Send an API request with the available access token.
2. Detect an authentication failure that indicates the access token has expired.
3. Initiate the refresh flow using the current refresh-token ID. The browser sends the HttpOnly cookie with the eligible request.
4. If refresh succeeds, update the access token and replace the stored refresh-token ID.
5. Retry the original request when appropriate.
6. If refresh fails, stop the retry cycle and handle the invalid session.

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
- Attempts to reuse rotated refresh-token IDs.
- Logout followed by an attempted refresh.
- Multiple requests trying to refresh simultaneously.
- Invalid JWT signatures and malformed claims.
- Missing or incorrect authorization roles.
- Repeated OTP verification attempts.
- OAuth failures and invalid callback parameters.
- Network failures during token refresh.
- Session behavior across multiple devices.

These scenarios are important because authentication bugs frequently occur at the boundaries between otherwise functional components.

## Trade-Offs of Building Authentication From Scratch

Implementing authentication without a complete authentication library gave me direct experience with token lifecycles, OAuth, MFA, and authorization.

However, it also meant that I was responsible for more code and more security decisions.

A custom implementation can be useful for learning or when an application has specific requirements, but it is not automatically safer or simpler than a mature authentication solution.

Libraries and managed identity providers can reduce the amount of security-sensitive code an application needs to maintain. They still require careful configuration, dependency updates, and an understanding of their behavior.

My objective was to understand the underlying mechanisms rather than simply connect an application to an existing authentication provider.

The experience helped me see how individual decisions—token expiration, cookie configuration, refresh-token ID rotation, database state, and authorization checks—combine into a complete security model.

## Conclusion

Building this authentication system was an opportunity to explore the complete authentication lifecycle in a real application.

The architecture combines JWT access tokens, an HttpOnly refresh-token cookie, rotating refresh-token IDs, database-backed session information, Google OAuth 2.0 with PKCE, email OTP, TOTP, and role-based access control.

The most important distinction in my implementation is that the refresh token itself is never stored in PostgreSQL or local storage. The refresh-token ID is stored in both places, rotates after successful use, and is validated against server-side session state.

The broader lesson is that authentication is not just about generating a token after login. It is about managing identity and trust throughout the lifetime of a session, including expiration, renewal, revocation, authorization, and failure recovery.

The project remains a learning experience and an evolving implementation. Security requires continued testing, dependency maintenance, and review rather than assuming that a working login flow proves that the entire system is secure.
