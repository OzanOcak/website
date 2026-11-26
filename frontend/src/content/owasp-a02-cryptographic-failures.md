---
title: "OWASP A02:2021 — Cryptographic Failures"
slug: owasp-a02-cryptographic-failures
description: "A practical investigation of OWASP A02:2021 Cryptographic Failures, examining password hashing, OTP generation, JWT signing and validation, refresh-token rotation, secret management, and OAuth security in a Node.js authentication system."
imageUrl: /images/7.webp
author: o. ocak
date: 21.11.2026
tags:
  - OWASP
  - Cryptographic Failures
  - API Security
  - Authentication
  - JWT
  - OAuth 2.0
  - Password Security
  - Node.js
  - Express
published: true
---

# OWASP A02:2021 — Cryptographic Failures

Cryptography is one of the foundations of application security. It protects passwords, authentication tokens, session data, and sensitive information exchanged between clients and servers.

However, using a cryptographic library does not automatically make an application secure. Weak configuration, incorrect token validation, poor secret management, and inappropriate cryptographic design can undermine otherwise sound implementations.

In this investigation, I reviewed the authentication system of my own application to understand how it handles passwords, one-time passwords (OTPs), JSON Web Tokens (JWTs), refresh-token rotation, environment secrets, and Google OAuth authentication.

The objective was not simply to identify whether encryption was present, but to examine whether cryptographic mechanisms were being used correctly.

## What is OWASP A02:2021?

OWASP A02:2021 — Cryptographic Failures — covers weaknesses that expose sensitive information because cryptography is missing, insufficient, or incorrectly implemented.

Common examples include:

- Storing passwords in plaintext or using weak password hashing.
- Transmitting sensitive information without appropriate transport encryption.
- Using weak or predictable cryptographic keys.
- Exposing sensitive information through logs, responses, or storage.
- Incorrectly implementing encryption, token signing, or verification.
- Failing to manage cryptographic secrets securely.

The important distinction is that cryptography must protect data throughout its lifecycle: when it is transmitted, stored, and processed.

## Password Storage — bcrypt

The first area I examined was password registration and authentication.

During registration, the application hashes the submitted password before storing it:

```ts
const hashedPassword = await bcrypt.hash(password, 10);
```

During login, it verifies the submitted password against the stored hash:

```ts
const isPasswordValid = await bcrypt.compare(password, user[0].password);
```

This is preferable to storing passwords using reversible encryption or a general-purpose hash function such as SHA-256.

### Why bcrypt?

bcrypt is a password-hashing algorithm designed to make password guessing computationally expensive.

It also generates a unique salt for each password. The salt and cost information are incorporated into the resulting hash, so a separate manually generated salt is not required.

The application currently uses a cost factor of 10.

This is a valid bcrypt configuration, but password-hashing cost should be benchmarked against the hardware and expected authentication workload. A higher cost increases the computational effort required for password guessing, but also increases the server resources consumed by legitimate login requests.

Argon2id is another suitable option for modern password storage.

**Assessment:** The application uses an appropriate password-hashing algorithm. The cost factor should be reviewed and benchmarked rather than automatically classified as a vulnerability.

## OTP Generation and Expiration

The application uses a six-digit email verification code during registration.

The OTP is generated using Node.js's cryptographic random number generator:

```ts
const otp = randomInt(100000, 999999).toString();
```

Using `crypto.randomInt()` is important because security-sensitive codes should not rely on predictable pseudo-random values such as `Math.random()`.

The application temporarily stores the registration data in memory:

```ts
const timerId = setTimeout(() => {
  delete unverifiedUsers[otp];
}, 300000);

unverifiedUsers[otp] = {
  username,
  email,
  hashedPassword,
  storedOtp: otp,
  timerId,
};
```

The five-minute timeout limits how long the registration information remains available for verification.

### Security considerations

A six-digit OTP has one million possible combinations. Cryptographically secure generation is necessary, but it is not sufficient by itself.

The verification endpoint should also enforce:

- A strict expiration check.
- A maximum number of verification attempts.
- Rate limiting.
- Single-use verification.
- Cleanup after successful verification.

There is another implementation consideration: the OTP is stored in plaintext in application memory.

For a small, single-instance application, this may be a deliberate temporary-storage design. However, process memory exposure could reveal active verification codes. If the application moves to persistent or shared storage, storing an HMAC of the OTP with a separate server-side secret is preferable to storing the raw value. A plain unsalted hash is insufficient protection for a six-digit code because its search space is very small.

The current in-memory design also means registration state disappears when the process restarts and is not shared between multiple application instances. A shared store such as Redis with expiration support would be more suitable for a horizontally scaled deployment.

**Assessment:** Secure OTP generation is implemented. Storage, attempt limiting, and verification behavior require additional review.

## JWT Signing and Validation

The application uses separate environment secrets for access and refresh JWTs:

```env
ACCESS_JWT_SECRET=...
REFRESH_JWT_SECRET=...
```

The secrets were generated using Node.js's cryptographic random number generator:

```js
require("crypto").randomBytes(64).toString("hex");
```

This generates 64 random bytes, represented as a 128-character hexadecimal string.

Using independently generated secrets for access and refresh tokens is a good security practice. Compromise of one signing secret should not automatically compromise both token types.

### Token expiration

The application uses the following lifetimes:

| Token            |   Lifetime |
| ---------------- | ---------: |
| Access token     | 15 minutes |
| Refresh token    |     5 days |
| Registration OTP |  5 minutes |

Short-lived access tokens reduce the period during which a compromised token can be used.

However, expiration alone does not establish what a token is allowed to do.

### Token purpose separation

One issue identified during the review was that the registration-verification JWT uses the same `ACCESS_JWT_SECRET` as normal access tokens.

The registration token is created with an OTP-related identifier:

```ts
const accessToken = jwt.sign({ id: otp }, process.env.ACCESS_JWT_SECRET!, {
  expiresIn: "15m",
});
```

Although this token has a different purpose, it is signed using the same secret as the application's access tokens.

A token verifier that checks only the signature and expiration may accept a token that was originally created for another purpose.

The safer design is to use separate signing keys for different token purposes, or at minimum enforce distinct, mandatory claims such as:

```ts
{
  sub: "user-or-registration-id",
  purpose: "email_verification"
}
```

The access-token verifier should explicitly require:

```ts
{
  purpose: "access";
}
```

Every verifier must enforce the expected purpose. Merely adding a claim without checking it does not provide protection.

### Algorithm restrictions and claim validation

JWT verification should explicitly restrict accepted algorithms to the algorithm used by the application.

For example, if the application signs tokens using HS256:

```ts
const payload = jwt.verify(accessToken, process.env.ACCESS_JWT_SECRET!, {
  algorithms: ["HS256"],
});
```

The application should also validate the structure and meaning of the payload.

A valid signature does not guarantee that the claims are valid for the application's authorization model.

For example:

- Is the user ID present and of the expected type?
- Is the role one of the supported roles?
- Is the token intended for this application and this operation?
- Is the account still active?

The signing algorithm must match the application's actual configuration. The example above assumes HS256.

## Refresh-Token Rotation

The application uses a refresh-token ID stored in the database alongside a refresh JWT held in an HttpOnly cookie.

When a client requests a new access token, the backend checks the refresh-token ID, verifies the refresh JWT, issues replacement tokens, stores a new ID, and deletes the previous ID.

This provides a server-side mechanism for invalidating refresh sessions.

During the code review, several important issues emerged.

### Database ownership validation

The backend checks whether the supplied refresh-token ID exists in the database.

However, existence alone is insufficient.

After verifying the JWT, the application must also confirm that the database record belongs to the user identified by the JWT payload.

Conceptually:

```ts
if (storedToken.userId !== payload.id) {
  throw new Error("Invalid refresh token");
}
```

Without this binding, the application does not fully establish that the presented database session identifier and signed JWT belong to the same user.

### Concurrent refresh requests

There is also a potential race condition.

Imagine two refresh requests arriving almost simultaneously:

1. Both requests check the old refresh-token ID.
2. Both find the ID in the database.
3. Both verify the refresh JWT.
4. Both generate new refresh tokens.
5. Both insert replacement IDs.
6. Both attempt to delete the old ID.

The application needs to ensure that the old refresh-token ID can be consumed only once.

A safer implementation uses a database transaction and an atomic conditional delete or update. The replacement token should be issued only when exactly one request successfully consumes the previous session identifier.

This is important for reliable refresh-token rotation and replay resistance.

### Token expiration consistency

The application also had an expiration mismatch between the refresh JWT and its cookie during login:

- JWT expiration: 5 days.
- Cookie maximum age: 7 days.

The cookie should not outlive the token it contains. These values should be aligned.

**Assessment:** The application has a useful refresh-token rotation design, but ownership validation and atomic consumption need to be enforced.

## Secret Management

Cryptographic security depends heavily on protecting signing keys and application secrets.

The application stores its secrets in environment variables rather than hardcoding actual values into application source code.

The example environment file contains placeholders:

```env
ACCESS_JWT_SECRET=replace_with_a_random_secret
REFRESH_JWT_SECRET=replace_with_a_random_secret
COOKIE_KEY=replace_with_a_random_secret
SESSION_SECRET=replace_with_a_random_secret
```

The actual secrets are stored separately in the local environment file.

I also checked whether `.env` was ignored by Git:

```bash
git check-ignore .env
```

The file was ignored in both the project root and backend directory.

However, an important distinction exists: `.gitignore` prevents new untracked files from being added accidentally. It does not remove a file that was already committed.

To verify whether the environment files are tracked:

```bash
git ls-files .env backend/.env
```

If the command returns no matching files, those paths are not currently tracked.

Secrets should never be committed to source control. If a real secret has been exposed or committed, removing it from the latest commit is not sufficient; the secret must be rotated.

For production systems, a dedicated secrets manager is preferable to relying exclusively on local environment files.

## HTTPS and Sensitive Data in Transit

Passwords and authentication tokens must be protected while travelling between the client and server.

The application uses HTTPS for its production API.

It is important to understand that a password appearing in a `curl` command or HTTP request body does not mean it is being transmitted unencrypted.

For example:

```bash
curl -X POST https://api.example.com/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"example"}'
```

The password exists in plaintext inside the client process before transmission. HTTPS protects the connection by encrypting the data in transit.

However, plaintext can still be exposed through other mechanisms, including:

- Shell history.
- Process arguments.
- Terminal recordings.
- Application request-body logging.
- Reverse proxies or monitoring systems configured to record sensitive data.

Sensitive credentials should not be logged, and production TLS configuration should be reviewed independently.

The refresh-token cookie also uses security attributes:

```ts
{
  httpOnly: true,
  secure: process.env.NODE_ENV !== "development",
  sameSite: "strict"
}
```

These settings provide useful protection:

- `HttpOnly` prevents ordinary JavaScript access to the cookie.
- `Secure` restricts cookie transmission to HTTPS.
- `SameSite` provides additional cross-site request protection.

These attributes do not replace server-side authorization or CSRF analysis, but they are important parts of session security.

## Google OAuth and Token Security

The application supports Google authentication.

Its account lifecycle works as follows:

1. A user authenticates through Google.
2. On the first successful login, the backend creates an application account and associates the Google identity.
3. On subsequent logins, the existing account is used instead of creating another one.
4. The backend issues application access and refresh tokens.

This is a normal OAuth-based registration and login model.

However, account creation and account linking must depend on a verified Google identity.

The backend must validate the Google identity token or obtain trusted profile information from Google's authenticated user information endpoint. If account linking relies on email, the backend must also establish that the email is verified.

The code reviewed so far does not establish whether this verification is performed in the preceding OAuth callback. That part requires further inspection.

The OAuth callback also uses the access-token signing secret for its temporary callback JWT. As with registration verification, a separate token purpose and validation rules should be used.

**Assessment:** The first-login registration behavior is expected. The upstream Google identity verification and callback-token implementation require further review before a security conclusion can be made.

## Findings and Recommendations

The investigation identified several areas that deserve attention.

| Area                   | Observation                                        | Recommended action                                              |
| ---------------------- | -------------------------------------------------- | --------------------------------------------------------------- |
| Password hashing       | bcrypt cost 10                                     | Benchmark cost and consider Argon2id                            |
| OTP generation         | Uses `crypto.randomInt()`                          | Retain secure random generation                                 |
| OTP storage            | Plaintext in process memory                        | Consider HMAC storage and shared TTL storage                    |
| JWT purpose            | Registration and access JWT share a signing secret | Separate token purposes and enforce claims                      |
| JWT verification       | Explicit algorithm restriction not shown           | Restrict accepted algorithms and validate claims                |
| Refresh-token binding  | Database ownership check missing                   | Bind token ID to JWT user ID                                    |
| Refresh-token rotation | Concurrent consumption not atomic                  | Use transactional, single-use rotation                          |
| Cookie expiration      | Login cookie outlives refresh JWT                  | Align expiration values                                         |
| Secret management      | Random secrets and Git ignore rules                | Verify files are untracked and use production secret management |
| Google OAuth           | Upstream identity verification not yet established | Verify Google identity and email before account linking         |

Not every observation is a confirmed vulnerability. Some are implementation improvements, while others require additional testing or inspection.

## Conclusion

This investigation demonstrated that cryptographic security is not simply a matter of selecting a strong hashing algorithm or generating a long random secret.

A secure authentication system requires multiple mechanisms to work together:

- Passwords must be stored using appropriate password-hashing algorithms.
- OTPs must be generated securely and protected against brute-force attempts.
- JWTs must have appropriate lifetimes, signing keys, purposes, and validation rules.
- Refresh-token rotation must prevent replay and concurrent reuse.
- Secrets must remain outside source control and be protected in production.
- OAuth identity information must be verified before creating or linking accounts.
- Sensitive information must be protected during transmission and must not leak through application logging.

The most important lesson from reviewing my own implementation was that a cryptographically valid token is not necessarily a token that should be accepted for a particular operation.

**Cryptographic integrity, token purpose, identity verification, and authorization are separate requirements. They must all be enforced by the application.**

The investigation is ongoing. The next step is to complete the review of the OAuth callback and OTP verification endpoints, then validate the findings with targeted tests.
