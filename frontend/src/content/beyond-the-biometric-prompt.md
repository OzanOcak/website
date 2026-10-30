---
title: "Beyond the Biometric Prompt: Designing Mobile Authentication"
slug: beyond-the-biometric-prompt
description: A practical look at separating mobile sessions from biometric device credentials in React Native, using Node.js, Keychain, Zustand, and OAuth. Covers token lifecycle, biometric access control, session restoration, and native authentication boundaries.
imageUrl: /images/6.webp
author: o. ocak
date: 30.10.2026
tags:
  - React Native
  - Authentication
  - Face ID
  - iOS
  - Node.js
  - Security
published: true
---

# Beyond the Biometric Prompt: Designing Mobile Authentication

Adding Face ID to a React Native application initially sounds straightforward: display a biometric prompt, verify the user, and let them in.

But the biometric prompt is only one part of the authentication process.

The more interesting engineering challenge is deciding what happens before and after that prompt. Where should credentials be stored? How should they be protected? What happens when an application is terminated? How can a user remain signed in without repeatedly authenticating with Face ID?

To answer these questions, I separated authentication into two independent mechanisms:

- **Session authentication:** Maintains the user's normal authenticated session.
- **Device authentication:** Allows the user to establish a new session using a credential protected by the device's biometric authentication mechanism.

This separation made the implementation easier to reason about and gave each credential a distinct purpose and lifecycle.

## 1. Separating session credentials from device credentials

The first architectural decision was not to reuse the normal refresh token for Face ID login.

Instead, I introduced two credential categories.

| Credential            | Purpose                                                | Storage                           |
| --------------------- | ------------------------------------------------------ | --------------------------------- |
| Access token          | Authorizes API requests                                | Application memory                |
| Session refresh token | Renews an existing session                             | Keychain                          |
| Device token          | Establishes a session through biometric authentication | Biometric-protected Keychain item |

The distinction matters because the credentials have different security requirements.

A session refresh token should be accessible to the application when it needs to restore an existing session. A device token should only become accessible after the user explicitly completes biometric authentication.

Using the same credential for both purposes would make it harder to enforce those separate access rules.

### Backend endpoints

I implemented a dedicated set of endpoints for device authentication:

```http
POST   /mobile/faceid-auth/device-token
POST   /mobile/faceid-auth/device-login
DELETE /mobile/faceid-auth/device-token
```

Their responsibilities are different:

**Register a device credential**

```http
POST /mobile/faceid-auth/device-token
Authorization: Bearer <access-token>
```

The backend verifies the authenticated session and issues a dedicated device credential.

**Authenticate using a device credential**

```http
POST /mobile/faceid-auth/device-login
Content-Type: application/json
```

```json
{
  "deviceToken": "...",
  "deviceTokenId": "..."
}
```

The backend validates the device credential and issues a normal session.

**Revoke a device credential**

```http
DELETE /mobile/faceid-auth/device-token
Authorization: Bearer <access-token>
```

This endpoint disables the registered device credential.

I also added a token type to the database so that session credentials and device credentials cannot be used interchangeably.

For example:

```ts
type TokenType = "session" | "device";
```

The backend must enforce this distinction during token validation, not merely rely on the frontend to send the correct token to the correct endpoint.

A device credential should also have its own expiration, revocation status, and user/device association. It should be stored hashed in the database rather than as a reusable plaintext credential.

## 2. Protecting credentials with iOS Keychain

On the React Native side, I used `react-native-keychain` to access the iOS Keychain.

The important detail is that I use separate Keychain services for session credentials and device credentials.

### Session credentials

The normal refresh token is stored without biometric access control:

```ts
await Keychain.setGenericPassword(refreshTokenId, refreshToken, {
  service: "session-tokens",
});
```

This allows the application to retrieve the refresh token when restoring a session without displaying a Face ID prompt.

The access token remains in memory rather than being persisted to AsyncStorage.

### Device credentials

When the user enables Face ID, the backend issues a separate device credential.

I store it using biometric access control:

```ts
await Keychain.setGenericPassword(deviceTokenId, deviceToken, {
  service: "device-token",
  accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
});
```

`BIOMETRY_CURRENT_SET` ties access to the currently enrolled biometric set. Changes to the enrolled biometric configuration can invalidate access to the protected item.

This is an important distinction: the application does not receive or process the user's facial data. iOS handles biometric verification and controls access to the protected Keychain item.

Keychain uses the iOS Security framework to protect stored credentials. Depending on the device, configuration, and protection class, hardware-backed security mechanisms may also be involved. It is more accurate to describe this as Keychain-protected, biometric-gated storage than to claim that every token is directly encrypted by the Secure Enclave.

The application only receives the device credential after the operating system grants access.

## 3. Zustand persistence and asynchronous hydration

I use Zustand to manage application authentication state.

One issue I encountered was that Zustand's persistence middleware uses AsyncStorage, which is asynchronous in React Native.

This creates a hydration race condition.

When the application starts, React can render before Zustand has finished restoring its persisted state. A component might initially see:

```ts
isFaceIdEnabled: false;
```

even though the persisted value is actually `true`.

This caused the Face ID login button to disappear during the initial render.

### Waiting for hydration

I solved this by checking the persistence middleware's hydration status:

```tsx
import { useEffect, useState } from "react";
import { useStore } from "../../stores/useStore";

export const useStoreHydration = () => {
  const [hasHydrated, setHasHydrated] = useState(
    useStore.persist.hasHydrated(),
  );

  useEffect(() => {
    const unsubscribe = useStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });

    // Hydration may have completed before the subscription.
    setHasHydrated(useStore.persist.hasHydrated());

    return unsubscribe;
  }, []);

  return hasHydrated;
};
```

A component can now wait until hydration is complete:

```tsx
const hasHydrated = useStoreHydration();

const isFaceIdEnabled = useStore((state) => state.isFaceIdEnabled);

if (!hasHydrated) {
  return null;
}

if (!isFaceIdEnabled) {
  return null;
}
```

The important point is that the application should not make authentication or UI decisions based on persisted state until hydration has completed.

I also avoid persisting sensitive session data unnecessarily. My intended storage responsibilities are:

- Access token: in-memory Zustand state.
- Refresh token: Keychain.
- Device token: biometric-protected Keychain.
- UI configuration, including the Face ID enabled flag: AsyncStorage through Zustand.

The Face ID flag is only a UI indicator. It is not an authentication credential and must not be trusted as proof that the Keychain item is still available.

## 4. Avoiding unexpected biometric prompts

Another issue appeared when I visited the Profile screen.

The application displayed the Face ID prompt even though I had not pressed the Face ID login button.

The cause was a Keychain read inside the `EnableFaceIdButton` component:

```tsx
useEffect(() => {
  const checkStatus = async () => {
    const credentials = await Keychain.getGenericPassword();

    setIsEnabled(!!credentials);
  };

  checkStatus();
}, []);
```

This looked like a harmless existence check, but it was actually attempting to retrieve a credential protected by biometric access control.

iOS therefore requested biometric authentication.

### Using Zustand for the UI instead

I removed the Keychain read and used the persisted Zustand flag:

```tsx
const isEnabled = useStore((state) => state.isFaceIdEnabled);
```

After successful registration:

```ts
useStore.getState().setIsFaceIdEnabled(true);
```

Now the Profile screen can display the correct configuration state without attempting to retrieve the protected credential.

The device credential is only retrieved when the user explicitly presses the Face ID login button.

This is an important design principle: **checking whether a feature is configured should not require exercising the protected credential.**

## 5. Restoring a session after application termination

Another important distinction is the difference between closing an application and logging out.

When iOS terminates an application, its in-memory state disappears. This includes the access token stored in Zustand.

That is expected.

I intentionally do not persist the access token. However, this means the application must restore the session when it starts again.

The solution is to retrieve the normal refresh token from the separate, non-biometric Keychain service.

### Session restoration

The startup sequence is:

1. Wait for Zustand hydration.
2. Check whether a session refresh credential exists in Keychain.
3. Send the refresh credential to the backend.
4. Receive a new access token and rotated refresh credential.
5. Update Zustand and Keychain.
6. Display the authenticated application.

A simplified implementation looks like this:

```ts
import * as Keychain from "react-native-keychain";
import axiosInstance from "../../lib/http/nodeAuthClient";
import { useStore } from "../../stores/useStore";

export const restoreSession = async () => {
  const credentials = await Keychain.getGenericPassword({
    service: "session-tokens",
  });

  if (!credentials) {
    return false;
  }

  try {
    const refreshTokenId = credentials.username;
    const refreshToken = credentials.password;

    const response = await axiosInstance.post("/mobile/oauth/refresh", {
      refreshToken,
      refreshTokenId,
    });

    const {
      accessToken,
      refreshToken: newRefreshToken,
      refreshTokenId: newRefreshTokenId,
    } = response.data;

    // Update in-memory application state.
    useStore.getState().setToken(accessToken);

    useStore.getState().setRefreshTokenId(newRefreshTokenId);

    // Persist the rotated refresh credential.
    await Keychain.setGenericPassword(newRefreshTokenId, newRefreshToken, {
      service: "session-tokens",
    });

    return true;
  } catch (error) {
    // Handle invalid or revoked sessions.
    await Keychain.resetGenericPassword({
      service: "session-tokens",
    });

    useStore.getState().clearToken();

    return false;
  }
};
```

This is a simplified example. In production, the refresh request should use an HTTP client that cannot recursively trigger the same refresh interceptor. Refresh-token rotation should also be handled atomically on the backend to prevent concurrent requests from invalidating each other.

The navigation layer should wait until restoration finishes before deciding whether to display the authenticated application or the login screen.

This gives the user a persistent session without having to authenticate with Face ID every time they reopen the application.

## 6. The actual Face ID login flow

Session restoration and biometric login are separate processes.

Session restoration retrieves the normal refresh credential without biometric authentication.

Face ID login retrieves the dedicated device credential after the user explicitly requests biometric authentication.

The flow looks like this:

```ts
import * as Keychain from "react-native-keychain";
import axiosInstance from "../../lib/http/nodeAuthClient";
import { useStore } from "../../stores/useStore";

export const loginWithFaceId = async () => {
  const credentials = await Keychain.getGenericPassword({
    service: "device-token",
  });

  if (!credentials) {
    throw new Error("No biometric credential is available.");
  }

  const response = await axiosInstance.post(
    "/mobile/faceid-auth/device-login",
    {
      deviceTokenId: credentials.username,
      deviceToken: credentials.password,
    },
  );

  const { accessToken, refreshToken, refreshTokenId } = response.data;

  useStore.getState().setToken(accessToken);

  useStore.getState().setRefreshTokenId(refreshTokenId);

  await Keychain.setGenericPassword(refreshTokenId, refreshToken, {
    service: "session-tokens",
  });
};
```

Because the device credential is protected by biometric access control, the Keychain retrieval triggers the operating system's authentication mechanism.

The backend then validates the credential and issues a normal session.

A production implementation should rotate the device credential after successful authentication, update the protected Keychain item, and reject replayed or revoked credentials. The frontend should also handle biometric cancellation, failed authentication, unavailable biometrics, and invalidated Keychain items separately.

## 7. Fixing the OAuth invalid-state issue

I also encountered an OAuth issue when signing in with Google for a second time after logging out.

The backend generated a new OAuth state, but React Query was returning a previously cached sign-in URL.

OAuth state is temporary and should be generated for each authentication attempt. Reusing an old URL can result in an invalid-state error when the callback is processed.

Instead of using a cached query result, I used `queryClient.fetchQuery` directly inside the button's press handler:

```ts
const data = await queryClient.fetchQuery({
  queryKey: ["googleSignInUrl", Date.now()],
  queryFn: async () => {
    // Request a fresh OAuth URL from the backend.
  },
});
```

The timestamp makes each query key unique, preventing the previous URL from being reused.

For this particular operation, the important requirement is that every sign-in attempt obtains a fresh OAuth state and that the backend validates the returned state against the original authentication transaction.

## 8. Putting the authentication lifecycle together

The final architecture has three distinct operations.

**Normal sign-in**

1. The user signs in using email/password or Google OAuth.
2. The backend issues session credentials.
3. The refresh token is stored in the normal Keychain service.
4. The access token remains in memory.

**Application restart**

1. Zustand restores its persisted non-sensitive state.
2. The application retrieves the normal refresh token from Keychain.
3. The backend validates and rotates the refresh credential.
4. The application receives a new access token.
5. The user returns to the authenticated application without a biometric prompt.

**Face ID sign-in**

1. The user explicitly chooses Face ID login.
2. iOS requests biometric authentication.
3. Keychain releases the protected device credential after successful authentication.
4. The backend validates the device credential.
5. The backend issues a new normal session.
6. The application stores the new session refresh credential and keeps the access token in memory.

This separation also makes logout behavior clearer. Logging out revokes the normal session, while the device credential can remain registered if the user wants to use Face ID again later. Disabling Face ID is a separate operation that revokes the device credential and removes its Keychain item.

## 9. Moving closer to native authentication

Implementing this flow also made me more interested in the boundary between React Native and native iOS functionality.

React Native provides the application layer, while iOS controls important security operations such as biometric verification and protected credential access.

For this implementation, `react-native-keychain` provides the interface I need without requiring a custom Swift implementation.

However, I want to explore building native modules and plugins for more advanced authentication workflows. That means understanding how JavaScript communicates with native code, how native APIs expose protected resources, and how to manage platform-specific behavior without unnecessarily moving application logic out of React Native.

The next step in this direction is to investigate how to keep sensitive authentication operations inside native modules rather than exposing credentials to JavaScript whenever that is technically and architecturally justified.

## Conclusion

The biggest lesson from this implementation is that a biometric prompt alone does not create a secure authentication system.

The security comes from the entire credential lifecycle: separating session and device credentials, protecting them with the appropriate Keychain access controls, handling token rotation, restoring sessions after application termination, and ensuring that biometric authentication only happens when the user explicitly requests it.

Separating these responsibilities made the implementation easier to maintain and gave me a clearer understanding of how React Native applications interact with native iOS security mechanisms.

It also provided a practical starting point for exploring native authentication plugins and the boundary between JavaScript and platform-level security.
