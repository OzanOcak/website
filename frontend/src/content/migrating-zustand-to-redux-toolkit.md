---
title: "Migrating from Zustand to Redux Toolkit: A React Native Case Study"
slug: migrating-zustand-to-redux-toolkit
description: A practical comparison of Zustand and Redux Toolkit through a React Native authentication project, covering store configuration, slices, typed hooks, asynchronous workflows, middleware, persistence, selectors, and state-management architecture.
imageUrl: /images/3.webp
author: O. Ocak
date: 02.11.2026
tags:
  - React Native
  - Redux Toolkit
  - Zustand
  - TypeScript
  - State Management
  - JavaScript
published: true
---

## Introduction

When building a React Native application, choosing an appropriate state-management solution becomes increasingly important as the application grows.

Initially, I used Zustand because of its simplicity, minimal boilerplate and flexibility. It allowed me to implement authentication flows without introducing unnecessary architectural complexity.

However, I wanted to gain practical experience with Redux Toolkit (RTK), particularly because Redux is widely used in enterprise React and React Native applications.

This led me to explore migrating an existing Zustand implementation to Redux Toolkit.

The objective wasn't to fix a problem with Zustand. The existing implementation was working correctly. Instead, I wanted to understand the architectural differences, learn Redux Toolkit's patterns and demonstrate that I could work with either state-management solution.

This article explores the migration using a React Native authentication system as a practical example.

The application uses:

- React Native and TypeScript.
- Redux Toolkit.
- React Redux.
- Axios for HTTP communication.
- TanStack Query for server-state management.
- AsyncStorage for non-sensitive persistent application preferences.
- OAuth 2.0 with PKCE for authentication.
- A Node.js and Express backend.

---

## Understanding the Architectural Differences

Before migrating, it's important to understand how Zustand and Redux Toolkit approach state management differently.

### Zustand: Minimal and Flexible

Zustand provides a relatively small API.

A store can be created using a single `create` function, with state and actions defined together.

```typescript
import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  deviceId: string | null;

  setAuthenticated: (value: boolean) => void;
  setDeviceId: (id: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  deviceId: null,

  setAuthenticated: (value) => set({ isAuthenticated: value }),

  setDeviceId: (id) => set({ deviceId: id }),
}));
```

Components can access individual state properties directly:

```typescript
const deviceId = useAuthStore((state) => state.deviceId);
```

State can also be accessed outside React components:

```typescript
const deviceId = useAuthStore.getState().deviceId;
```

This flexibility makes Zustand convenient for smaller applications and projects where minimal setup is desirable.

### Redux Toolkit: Explicit State Transitions

Redux Toolkit introduces a more structured approach.

Instead of directly invoking store setters, components dispatch actions. Reducers process those actions and calculate the next application state.

Redux Toolkit uses Immer internally, allowing developers to write mutation-like reducer logic while maintaining immutable state updates.

For example:

```typescript
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  deviceId: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  deviceId: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },

    setDeviceId: (state, action: PayloadAction<string>) => {
      state.deviceId = action.payload;
    },
  },
});

export const { setAuthenticated, setDeviceId } = authSlice.actions;

export default authSlice.reducer;
```

Although the reducer appears to modify the state directly, Immer produces an immutable next state.

This provides a predictable state-transition model without requiring developers to manually spread objects at every level.

---

## Store Configuration

The store is the central location that holds the application's Redux state.

### Zustand: Store Composition

In Zustand, middleware can be composed around a store.

For example, the original implementation used persistence, Immer, Redux DevTools integration and selector subscriptions.

```typescript
export const useStore = create<Store>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set) => ({
          ...createAuthSlice(set),
        })),
      ),
      {
        name: "store",
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({
          deviceId: state.deviceId,
          isFaceIdEnabled: state.isFaceIdEnabled,
        }),
      },
    ),
  ),
);
```

The `partialize` option is particularly important because it controls which state properties are persisted.

### Redux Toolkit: configureStore

Redux Toolkit provides `configureStore`, which simplifies store creation and includes useful defaults.

```typescript
// src/stores/index.ts

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
```

The resulting state has a predictable structure:

```typescript
{
  auth: {
    isAuthenticated: false,
    deviceId: null
  }
}
```

The `RootState` type represents the complete Redux state tree.

`AppDispatch` represents the store's dispatch function, including the middleware-enhanced dispatch capabilities.

These types are particularly useful in TypeScript applications.

---

## State Persistence and Security

React Native applications frequently need to retain certain preferences and application settings between launches.

However, not all application state should be persisted.

In an authentication system, this distinction becomes particularly important.

For example:

| State               | Persistence                                                  |
| ------------------- | ------------------------------------------------------------ |
| Device ID           | AsyncStorage, subject to its security requirements           |
| Face ID preference  | AsyncStorage                                                 |
| Access token        | Memory                                                       |
| Refresh credentials | Secure storage, depending on the authentication architecture |
| Private keys        | iOS Keychain / Secure Enclave where applicable               |

The exact storage strategy depends on the threat model and backend authentication design.

### Zustand Persistence

Zustand provides persistence middleware.

```typescript
persist(storeCreator, {
  name: "store",

  storage: createJSONStorage(() => AsyncStorage),

  partialize: (state) => ({
    deviceId: state.deviceId,
    isFaceIdEnabled: state.isFaceIdEnabled,
  }),
});
```

The `partialize` function ensures that only explicitly selected properties are written to persistent storage.

### Redux Toolkit Persistence

Redux Toolkit does not include built-in persistence functionality.

A common option is Redux Persist.

```typescript
import AsyncStorage from "@react-native-async-storage/async-storage";

import { persistReducer, persistStore } from "redux-persist";

import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth-slice";

const authPersistConfig = {
  key: "auth",
  storage: AsyncStorage,
  whitelist: ["deviceId", "isFaceIdEnabled"],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
});

export const persistor = persistStore(store);
```

The whitelist specifies which properties are persisted.

An important security consideration: a persistence whitelist is not a security boundary. Sensitive credentials should not be placed in the persisted Redux state in the first place.

Also, Redux Persist is optional. An application can retain an existing custom AsyncStorage persistence implementation without introducing Redux Persist.

---

## Understanding Hydration

Hydration is the process of restoring previously persisted application state when the application starts.

Because AsyncStorage operations are asynchronous, the application might initially render with default state before persistent state has been restored.

### Zustand: Custom Hydration Handling

A custom hook can monitor Zustand's hydration lifecycle.

```typescript
import { useEffect, useState } from "react";
import { useStore } from "./useStore";

export function useStoreHydration() {
  const [hydrated, setHydrated] = useState(useStore.persist.hasHydrated());

  useEffect(() => {
    const unsubscribe = useStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    return unsubscribe;
  }, []);

  return hydrated;
}
```

Components can use this hook to avoid rendering UI that depends on persisted state before hydration completes.

### Redux Toolkit: PersistGate

Redux Persist provides `PersistGate`.

It prevents its children from rendering until persisted state has been rehydrated.

```tsx
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { store, persistor } from "./stores";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <AppNavigator />
      </PersistGate>
    </Provider>
  );
}
```

This centralizes the hydration gate rather than requiring individual components to check hydration status.

However, `PersistGate` only waits for Redux Persist's rehydration process. Other asynchronous initialization tasks, such as loading secure credentials or checking biometric availability, still require their own handling.

---

## Reading State: useSelector and Typed Hooks

Redux uses React Redux to connect React components to the store.

### Zustand

```typescript
const deviceId = useStore((state) => state.deviceId);
```

### Redux Toolkit

```typescript
import { useSelector } from "react-redux";
import type { RootState } from "../../stores";

const deviceId = useSelector((state: RootState) => state.auth.deviceId);
```

For larger TypeScript applications, defining typed hooks avoids repeating types throughout the application.

```typescript
// src/stores/hooks.ts

import { useDispatch, useSelector, useStore } from "react-redux";

import type { RootState, AppDispatch } from "./index";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export const useAppSelector = useSelector.withTypes<RootState>();

export const useAppStore = useStore.withTypes<typeof store>();
```

The typed hooks can then be used throughout the application:

```typescript
const dispatch = useAppDispatch();

const deviceId = useAppSelector((state) => state.auth.deviceId);
```

This improves consistency and provides better TypeScript inference.

---

## Updating State: Dispatch and Actions

One of the most important architectural differences between Zustand and Redux is how state updates are initiated.

### Zustand: Direct Store Actions

Zustand allows actions to be called directly through the store.

For example, an authentication function can update state outside React components.

```typescript
const loginUser = async (credentials) => {
  const response = await axios.post("/login", credentials);

  useAuthStore.getState().setAuthenticated(true);

  return response.data;
};
```

### Redux Toolkit: Dispatching Actions

Redux uses dispatch to send actions to the store.

Inside a React component or custom hook:

```typescript
const dispatch = useAppDispatch();

dispatch(setAuthenticated(true));
```

Outside React components, such as in an Axios interceptor, the application can import the configured store:

```typescript
import { store } from "../stores";
import { setAuthenticated } from "../stores/auth-slice";

store.dispatch(setAuthenticated(true));
```

Similarly, state can be accessed through:

```typescript
const state = store.getState();

const authenticated = state.auth.isAuthenticated;
```

This is useful when integrating Redux with external services or infrastructure code.

However, directly importing the store into HTTP clients can introduce circular dependencies if the store also imports those clients.

A dependency-injection approach or a dedicated authentication service can help avoid that problem.

---

## Asynchronous Operations with createAsyncThunk

Asynchronous operations are a major part of modern applications.

Authentication, API requests and remote data retrieval all involve asynchronous execution.

Redux Toolkit provides `createAsyncThunk` to simplify common asynchronous workflows.

### Creating an Async Thunk

```typescript
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: string;
    email: string;
  };
}

export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: string }
>(
  "auth/loginUser",

  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post("/login", credentials);

      return response.data;
    } catch {
      return rejectWithValue("Authentication failed");
    }
  },
);
```

`createAsyncThunk` automatically generates three lifecycle actions:

1. `pending`
2. `fulfilled`
3. `rejected`

These represent the different stages of the asynchronous operation.

### Handling Lifecycle Actions with extraReducers

The slice can respond to these actions using `extraReducers`.

```typescript
const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unexpected error";
      });
  },
});
```

### reducers vs extraReducers

These two properties serve different purposes.

| reducers                                 | extraReducers                                  |
| ---------------------------------------- | ---------------------------------------------- |
| Defines actions belonging to the slice   | Handles actions defined elsewhere              |
| Generates action creators                | Does not generate action creators              |
| Commonly handles synchronous transitions | Commonly handles async thunk lifecycle actions |

An important architectural consideration is that `createAsyncThunk` is not mandatory for every API request.

Since this application already uses TanStack Query, remote server state should generally remain in TanStack Query rather than being duplicated in Redux.

Redux can manage client-side application state while TanStack Query handles server-state caching, synchronization and request lifecycle management.

---

## Selectors and createSelector

Selectors provide a way to read and derive information from the Redux state.

A basic selector can retrieve a property:

```typescript
export const selectDeviceId = (state: RootState) => state.auth.deviceId;
```

Components can use it directly:

```typescript
const deviceId = useAppSelector(selectDeviceId);
```

For more complex derived values, Redux Toolkit re-exports `createSelector` from Reselect.

```typescript
import { createSelector } from "@reduxjs/toolkit";

const selectAuth = (state: RootState) => state.auth;

export const selectIsAuthenticated = createSelector([selectAuth], (auth) =>
  Boolean(auth.user),
);
```

Memoized selectors can avoid unnecessary recalculations when their input values have not changed.

They are particularly useful when:

- Combining multiple state properties.
- Filtering large collections.
- Performing expensive calculations.
- Deriving values used by multiple components.

Not every selector needs memoization. Simple property access usually doesn't benefit from `createSelector`.

---

## Middleware and Side Effects

Redux middleware provides an extension point between dispatching an action and the reducer processing it.

Middleware can be used for:

- Logging.
- Analytics.
- Asynchronous workflows.
- Error reporting.
- Monitoring application behavior.
- Coordinating side effects.

Redux Toolkit automatically configures useful middleware through `configureStore`.

### Default Middleware

Redux Toolkit includes:

- `redux-thunk` for asynchronous action logic.
- Immutable state checks in development.
- Serializable state and action checks in development.

For example:

```typescript
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },

  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
```

You can also customize the middleware configuration.

### Custom Middleware

A simple logging middleware:

```typescript
const loggerMiddleware = (store) => (next) => (action) => {
  console.log("Dispatching:", action);

  const result = next(action);

  console.log("Updated state:", store.getState());

  return result;
};
```

It can be registered through `configureStore`.

In production applications, be careful not to log credentials, access tokens or other sensitive authentication information.

### createListenerMiddleware

Redux Toolkit also provides `createListenerMiddleware`.

It allows developers to execute side effects in response to Redux actions or state changes.

For example, a logout action could trigger additional application cleanup.

```typescript
import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";

import { logout } from "./auth-slice";

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: isAnyOf(logout),

  effect: async (_action, listenerApi) => {
    // Perform application cleanup.
    // For example, clear user-specific caches.
  },
});
```

This separates side-effect coordination from reducer logic.

Reducers should remain pure and should not perform API requests, access storage or execute other external operations.

---

## RTK Query vs TanStack Query

Redux Toolkit includes another important feature: RTK Query.

RTK Query is an API data-fetching and caching solution built into Redux Toolkit.

It provides:

- Request lifecycle management.
- Automatic caching.
- Request deduplication.
- Cache invalidation.
- Loading and error states.
- Query subscriptions.
- Generated React hooks.

A basic example:

```typescript
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.example.com",
  }),

  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => "/profile",
    }),
  }),
});

export const { useGetProfileQuery } = userApi;
```

The generated hook can be used in a component:

```typescript
const { data, isLoading, error } = useGetProfileQuery();
```

### RTK Query vs TanStack Query

| Feature                 | RTK Query     | TanStack Query              |
| ----------------------- | ------------- | --------------------------- |
| API integration         | Redux Toolkit | Independent library         |
| Caching                 | Yes           | Yes                         |
| Request deduplication   | Yes           | Yes                         |
| Cache invalidation      | Tag-based     | Query keys and invalidation |
| Generated hooks         | Yes           | Query hooks through its API |
| Redux store integration | Native        | Independent                 |
| Mutations               | Yes           | Yes                         |

In this application, TanStack Query is already responsible for server state.

There is no architectural reason to migrate to RTK Query simply because Redux Toolkit is being introduced.

Both solutions are valid. The important thing is to avoid maintaining duplicate server-state caches.

---

## Testing Redux Toolkit

Redux Toolkit makes it possible to test reducers and asynchronous workflows independently of React components.

### Testing a Reducer

```typescript
import authReducer, { setDeviceId } from "./auth-slice";

test("should update device ID", () => {
  const initialState = {
    deviceId: null,
    isAuthenticated: false,
  };

  const nextState = authReducer(initialState, setDeviceId("device-123"));

  expect(nextState.deviceId).toBe("device-123");
});
```

### Testing Asynchronous Workflows

Async thunks can be tested by mocking their API dependencies.

Important cases include:

- Successful requests.
- Failed requests.
- Invalid credentials.
- Network failures.
- Repeated requests.
- Cancellation where supported.
- Concurrent operations.

For a production authentication system, testing token refresh races, logout during an active request and stale authentication responses is particularly important.

---

## Important Architectural Considerations

Migrating to Redux Toolkit doesn't mean moving every piece of application state into Redux.

Different types of state have different responsibilities.

A reasonable architecture for this application is:

| Responsibility                | Technology             |
| ----------------------------- | ---------------------- |
| Client-side application state | Redux Toolkit          |
| Server state and caching      | TanStack Query         |
| HTTP communication            | Axios                  |
| Authentication backend        | Node.js / Express      |
| Persistent preferences        | AsyncStorage           |
| Sensitive native credentials  | Keychain / SecureStore |
| Navigation                    | React Navigation       |

### Avoid Duplicating Server State

For example, if TanStack Query retrieves a user profile, there is generally no reason to copy the same profile into Redux.

Doing so introduces synchronization problems.

Similarly, Redux should not automatically become the location for every API request.

### Keep Reducers Pure

Reducers should only calculate state transitions.

They should not:

- Make HTTP requests.
- Access AsyncStorage.
- Read native Keychain values.
- Generate cryptographic keys.
- Execute biometric authentication.

These operations belong in services, middleware, thunks or other appropriate application layers.

### Be Careful with Circular Dependencies

Importing the Redux store into Axios interceptors is possible, but dependency direction matters.

For larger applications, keeping authentication services independent of the store and injecting the necessary dependencies can make the architecture easier to test and maintain.

---

## Final Comparison: Zustand vs Redux Toolkit

| Characteristic        | Zustand             | Redux Toolkit          |
| --------------------- | ------------------- | ---------------------- |
| Setup complexity      | Low                 | Moderate               |
| Boilerplate           | Minimal             | Structured             |
| State updates         | Store actions       | Dispatch and reducers  |
| Async operations      | Flexible            | Thunks and middleware  |
| Middleware            | Supported           | Standardized ecosystem |
| TypeScript            | Excellent           | Excellent              |
| DevTools              | Supported           | Strong integration     |
| Persistence           | Built-in middleware | External library       |
| Server-state solution | External library    | RTK Query              |
| Architecture          | Flexible            | More standardized      |

Neither library is universally superior.

Zustand is an excellent choice for applications that benefit from simplicity and flexibility.

Redux Toolkit is particularly useful when a team wants standardized state-management patterns, centralized action handling, middleware integration and a familiar architecture across a larger codebase.

The choice should depend on application requirements, team conventions and maintainability rather than assuming one library is inherently faster or better.

---

## Conclusion

Migrating from Zustand to Redux Toolkit provided an opportunity to understand a different state-management architecture using an existing React Native application.

The migration introduced several important concepts:

1. Centralized store configuration with `configureStore`.
2. Predictable state transitions with `createSlice`.
3. Action dispatching through React Redux.
4. Asynchronous workflows with `createAsyncThunk`.
5. Lifecycle handling through `extraReducers`.
6. Typed selectors and dispatch hooks.
7. Persistence and hydration with Redux Persist.
8. Middleware and side-effect management.
9. Memoized selectors with `createSelector`.
10. API caching and request management with RTK Query.

The most important lesson is that state management is not simply about choosing a library.

It is about understanding where application state belongs, how state transitions occur, how asynchronous operations are coordinated and how different application layers communicate without becoming tightly coupled.

The objective of this migration was not to replace a working Zustand implementation because it was inadequate. It was to develop practical experience with Redux Toolkit and understand the architectural trade-offs between two widely used state-management solutions.

That flexibility is valuable when working across different React and React Native projects, particularly in enterprise environments where established architectural conventions often influence technology choices.
