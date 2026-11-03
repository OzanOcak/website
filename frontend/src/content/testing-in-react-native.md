---
title: "Testing in React Native: From Manual Debugging to Automated Testing"
slug: testing-in-react-native
description: A practical guide to React Native testing, covering Jest, React Native Testing Library, MSW, state management, API integration, authentication, native module mocking, and end-to-end testing.
imageUrl: /images/7.webp
author: o. ocak
date: 02.11.2026
tags:
  - React Native
  - Testing
  - Jest
  - React Native Testing Library
  - MSW
  - Redux Toolkit
  - Zustand
  - API Testing
published: true
---

## Introduction

Testing is an important part of building reliable React Native applications.

During application development, developers need to verify that individual functions work correctly, components respond to user interactions, API requests behave as expected and complete user workflows function properly.

There are different approaches to achieving this.

In my React Native development workflow, I have used tools such as:

- **curl:** Manually testing API endpoints, request payloads, headers and responses.
- **Insomnia:** Testing REST APIs and verifying backend behavior.
- **Chrome DevTools:** Inspecting network requests, debugging JavaScript and investigating runtime issues.
- **React Native DevTools:** Debugging React Native components and application behavior.
- **Zustand DevTools:** Inspecting state transitions and investigating state-management issues.

These tools are useful for debugging and validating application behavior.

However, manual testing and runtime debugging do not replace automated regression testing.

Automated tests provide repeatable verification that existing functionality continues to work after code changes.

This article explores the testing tools and techniques I am practising for React Native applications, particularly authentication, API integration, state management, navigation and native module interactions.

---

# 1. Understanding Different Testing Approaches

Before choosing testing libraries, it is important to understand what each type of testing verifies.

| Testing type        | Purpose                                            | Example                                       |
| ------------------- | -------------------------------------------------- | --------------------------------------------- |
| Unit testing        | Tests individual functions or modules              | Email validation                              |
| Component testing   | Tests UI behavior                                  | Login button submission                       |
| Integration testing | Tests multiple application layers working together | Login service updating authentication state   |
| End-to-end testing  | Tests complete user workflows                      | Login, open profile and logout                |
| Manual API testing  | Verifies API behavior independently                | Testing a login endpoint using curl           |
| Runtime debugging   | Investigates application behavior                  | Inspecting network requests and state changes |

These approaches complement each other.

For example, an authentication feature can be tested at multiple levels:

1. Use curl or Insomnia to verify that the backend login endpoint works.
2. Use Jest to test authentication-related business logic.
3. Use React Native Testing Library to test login screen interactions.
4. Use MSW to simulate API responses.
5. Use end-to-end testing to verify the complete login workflow on a running application.

The objective is to test different boundaries of the system rather than relying on one testing technique.

---

# 2. The React Native Testing Stack

Several libraries are commonly used when implementing automated tests.

## Jest

Jest is a JavaScript testing framework.

It provides:

- Test execution.
- Assertions.
- Mock functions.
- Module mocking.
- Test setup and teardown.
- Code coverage reporting.

Example:

```typescript
describe("isValidEmail", () => {
  it("accepts a valid email", () => {
    expect(isValidEmail("test@example.com")).toBe(true);
  });
});
```

Jest is useful for testing business logic independently of React Native components.

## React Native Testing Library

React Native Testing Library (RNTL) provides utilities for rendering React Native components and testing their behavior.

It supports:

- Rendering components.
- Finding elements.
- Simulating user interactions.
- Testing asynchronous UI changes.
- Verifying accessibility-related behavior.

The important principle is to test components from the user's perspective rather than depending on their internal implementation.

## MSW (Mock Service Worker)

MSW intercepts network requests and provides controlled responses.

It is useful when testing API integration without depending on a real backend.

For example, a login request can receive:

- A successful authentication response.
- A `401 Unauthorized` response.
- A `500 Internal Server Error` response.
- A delayed response.
- A network failure.

This makes it possible to test different application states consistently.

For React Native, MSW needs an appropriate test-environment setup. Verify that the HTTP implementation used by the application is actually intercepted. Do not assume a mock is working simply because the test passes.

## React Navigation Testing

Navigation behavior can be tested by rendering components within an appropriate navigation environment or by mocking navigation dependencies when testing an isolated component.

Examples include:

- Verifying navigation after successful login.
- Preventing access to private screens when unauthenticated.
- Handling navigation parameters.
- Testing authentication-related navigation flows.

## State Management Testing

State management can be tested independently from the UI.

For example:

- Redux Toolkit reducers can be tested with different actions.
- Async thunks can be tested with fulfilled and rejected results.
- Zustand actions can be tested by inspecting state before and after an operation.

The testing strategy should reflect the state-management library actually used by the application.

---

# 3. Setting Up Jest in React Native

Jest configuration depends on the React Native version and project setup.

For a React Native CLI project, the Jest preset is commonly configured using the React Native testing preset.

For example:

```javascript
module.exports = {
  preset: "react-native",

  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  testPathIgnorePatterns: ["/node_modules/"],
};
```

Some newer React Native versions distribute their Jest preset separately. In those versions, the corresponding preset package and configuration should be used instead.

Always check the installed React Native version and its matching testing documentation rather than copying a configuration from another project.

## Understanding transformIgnorePatterns

One common Jest configuration problem involves `transformIgnorePatterns`.

By default, Jest generally avoids transforming dependencies inside `node_modules`.

However, some React Native libraries distribute JavaScript using modern syntax that may need transformation by the test environment.

This can produce errors such as:

```text
SyntaxError: Unexpected token 'export'
```

A configuration may need to allow selected React Native dependencies to be transformed.

For example:

```javascript
module.exports = {
  preset: "react-native",

  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native|@react-navigation)/)",
  ],
};
```

This is only a simplified example.

The actual allowlist depends on the project's dependencies and their module formats.

Avoid adding every dependency to the transformation allowlist without understanding why it is necessary. Excessive transformation can increase test execution time and introduce configuration complexity.

---

# 4. Writing Unit Tests with Jest

Unit tests verify individual functions independently.

Consider an email validation function:

```typescript
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

A corresponding test:

```typescript
import { isValidEmail } from "./validation";

describe("isValidEmail", () => {
  it("accepts a valid email", () => {
    expect(isValidEmail("test@example.com")).toBe(true);
  });

  it("rejects an invalid email", () => {
    expect(isValidEmail("invalid-email")).toBe(false);
  });

  it("rejects an empty email", () => {
    expect(isValidEmail("")).toBe(false);
  });
});
```

This test does not require:

- A React Native runtime.
- A real backend.
- A database.
- A physical device.

It verifies the function's behavior in isolation.

Other useful unit-testing targets include:

- Input validation.
- Token expiration calculations.
- Authentication utility functions.
- Data transformations.
- Query-key factories.
- Business rules.
- Reducers and selectors.

A good unit test should verify meaningful behavior rather than simply execute a function to increase code coverage.

---

# 5. Testing React Native Components

Component testing verifies how the UI behaves when users interact with it.

Consider a simplified login component:

```tsx
import React, { useState } from "react";
import { View, TextInput, Button } from "react-native";

export function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View>
      <TextInput
        accessibilityLabel="Email"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        accessibilityLabel="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Login" onPress={() => onLogin(email, password)} />
    </View>
  );
}
```

A component test can verify the interaction:

```tsx
import { render, fireEvent } from "@testing-library/react-native";

import { LoginScreen } from "./LoginScreen";

describe("LoginScreen", () => {
  it("submits the entered credentials", () => {
    const onLogin = jest.fn();

    const { getByLabelText, getByText } = render(
      <LoginScreen onLogin={onLogin} />,
    );

    fireEvent.changeText(getByLabelText("Email"), "test@example.com");

    fireEvent.changeText(getByLabelText("Password"), "password123");

    fireEvent.press(getByText("Login"));

    expect(onLogin).toHaveBeenCalledWith("test@example.com", "password123");
  });
});
```

The test verifies observable behavior:

1. The component renders.
2. The user enters credentials.
3. The user presses Login.
4. The expected callback receives the credentials.

It does not inspect whether `useState` was called or how the component stores its internal values.

## Testing Asynchronous UI Behavior

React components frequently update after asynchronous operations.

For example, a login button may display a loading indicator while an API request is pending.

RNTL provides asynchronous queries and utilities for these situations.

Use `findBy...` when waiting for an element to appear:

```tsx
expect(await findByText("Login successful")).toBeTruthy();
```

Use `waitFor` when an assertion needs to be retried until it succeeds or times out:

```tsx
await waitFor(() => {
  expect(onLogin).toHaveBeenCalled();
});
```

Do not wrap every assertion in `waitFor`. Use asynchronous utilities when the behavior being tested is genuinely asynchronous.

---

# 6. Testing API Requests with MSW

A common challenge in application testing is depending on a real backend.

Tests should generally not require a production API to be available.

MSW provides a way to intercept requests and return controlled responses.

Example:

```typescript
import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("https://api.example.com/auth/login", async () => {
    return HttpResponse.json({
      accessToken: "test-access-token",
      user: {
        id: 123,
        email: "test@example.com",
      },
    });
  }),
];
```

This handler simulates a successful login response.

Other handlers can simulate errors:

```typescript
http.post("https://api.example.com/auth/login", () => {
  return HttpResponse.json(
    {
      message: "Invalid credentials",
    },
    {
      status: 401,
    },
  );
});
```

## Why Use MSW?

One alternative is to mock Axios functions directly using Jest.

For example:

```typescript
jest.mock("axios");
```

This can be appropriate for isolated unit tests.

However, MSW operates at the network-request boundary and allows more realistic testing of the HTTP client and application integration.

It can verify behavior such as:

- Request methods.
- Request URLs.
- Headers.
- Request payloads.
- Response handling.
- Error handling.

The choice depends on the test boundary.

Use direct mocks when testing a small unit in isolation. Use MSW when testing the interaction between application code and its HTTP layer.

---

# 7. Testing Redux Toolkit and Zustand

State management is another important area for automated testing.

A useful principle is to avoid mocking the state-management library unnecessarily when you can test its real behavior using an isolated store.

## Redux Toolkit

Redux Toolkit provides `configureStore` for creating a store.

An isolated test store can use `preloadedState` to represent different application conditions.

Example:

```typescript
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";

const createTestStore = (accessToken = "") => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },

    preloadedState: {
      auth: {
        accessToken,
        refreshTokenId: "",
        otpToken: "",
        isFaceIdEnabled: false,
        deviceId: "",
      },
    },
  });
};
```

This allows tests to begin in specific states.

For example:

- Unauthenticated user.
- Authenticated user.
- User with Face ID enabled.
- User with expired authentication.

The exact state shape should match the application's actual reducer.

## Testing Reducers

Reducers are pure functions and are straightforward to test.

```typescript
it("clears authentication state after logout", () => {
  const initialState = {
    accessToken: "test-token",
    refreshTokenId: "test-refresh-id",
  };

  const nextState = authReducer(initialState, logout());

  expect(nextState.accessToken).toBe("");
  expect(nextState.refreshTokenId).toBe("");
});
```

This tests the actual reducer behavior without rendering a component.

## Testing Async Redux Operations

For asynchronous workflows, test the different outcomes:

- Successful completion.
- Rejected request.
- Unexpected server error.
- State transitions during loading.

For example, an async thunk can be tested using a real test store and controlled API responses.

The objective is to verify both the operation and its resulting state.

## Zustand

My current React Native implementation also uses Zustand.

Zustand stores can be tested directly by invoking their actions and inspecting their resulting state.

For example:

```typescript
const store = useAuthStore;

beforeEach(() => {
  store.setState({
    accessToken: "",
    isAuthenticated: false,
  });
});

it("updates authentication state after login", () => {
  store.getState().login("test-token");

  expect(store.getState().accessToken).toBe("test-token");

  expect(store.getState().isAuthenticated).toBe(true);
});
```

The example assumes the store exposes a `login` action with this behavior.

For a real application, tests should also isolate persisted state and any external dependencies such as AsyncStorage.

**Important:** Testing Zustand and Redux Toolkit should reflect the actual architecture. Do not claim Redux Toolkit testing experience based on tests written against a Zustand store.

---

# 8. Testing Native Modules

React Native applications frequently depend on native capabilities that cannot run directly in a standard Jest environment.

Examples include:

- Face ID and biometric authentication.
- Secure storage.
- Keychain integration.
- In-app browsers.
- Deep-link handling.
- Native cryptographic operations.

Jest executes JavaScript tests. It does not automatically launch the real iOS or Android native runtime.

Therefore, native dependencies generally need to be mocked when testing JavaScript-side application behavior.

## Example: Mocking Keychain

```typescript
jest.mock("react-native-keychain", () => ({
  resetGenericPassword: jest.fn(),
  setGenericPassword: jest.fn(),
  getGenericPassword: jest.fn(),
}));
```

A test can then verify that the application invokes the expected native API:

```typescript
expect(Keychain.resetGenericPassword).toHaveBeenCalledWith({
  service: "device-token",
});
```

This verifies the JavaScript integration contract.

It does not verify that the actual iOS Keychain operation works correctly on a physical device.

## Face ID and Secure Enclave

For an application using Face ID and device-bound cryptographic keys, testing should be separated into different layers.

**JavaScript tests:**

- Verify that the correct native module function is invoked.
- Verify loading and error states.
- Verify authentication state transitions.
- Verify behavior when the native module rejects.

**Native platform tests:**

- Verify actual biometric authentication behavior.
- Verify Secure Enclave key generation.
- Verify signing and verification.
- Verify device-level security behavior.

A Jest mock cannot prove that Secure Enclave operations work correctly.

Physical-device testing and appropriate native tests are necessary for those platform-specific guarantees.

---

# 9. Testing Authentication and Token Refresh

Authentication is particularly important because multiple application layers interact.

A typical flow may involve:

1. User submits credentials.
2. The application sends an API request.
3. The backend validates credentials.
4. The application receives an access token.
5. The authentication state is updated.
6. Private API requests use the access token.

Each part can be tested independently and through integration tests.

## Testing Login

Useful scenarios include:

| Scenario             | Expected behavior                               |
| -------------------- | ----------------------------------------------- |
| Valid credentials    | Authentication succeeds                         |
| Invalid credentials  | Appropriate error is displayed                  |
| Network failure      | Network error is handled                        |
| Server error         | Application handles the failure                 |
| Pending request      | Loading state is displayed                      |
| Duplicate submission | Duplicate requests are prevented where required |

## Testing Refresh Tokens

An Axios interceptor may detect an expired access token and attempt to refresh the session.

A particularly important scenario involves concurrent requests.

Imagine five API requests receive `401 Unauthorized` responses at approximately the same time.

If every request independently initiates a refresh operation, the application could create multiple refresh requests.

This becomes especially problematic when refresh credentials are rotated.

A single-flight refresh mechanism can ensure that concurrent requests share one refresh operation.

A test should verify:

1. Several requests receive `401`.
2. Only one refresh operation is initiated.
3. The refresh succeeds.
4. The original requests are retried.
5. The expected responses are returned.

Also test refresh failure:

- The refresh credential is expired or revoked.
- The refresh request fails.
- The session is invalidated.
- Protected application state is cleared.
- The user is redirected to an appropriate authentication screen.

This is an especially useful integration-testing scenario because it covers HTTP behavior, authentication state and error handling together.

---

# 10. Testing React Navigation and Deep Links

Navigation testing is important when applications have authentication flows, private screens and external callbacks.

For example, an OAuth flow may involve:

1. Opening an external authentication browser.
2. Completing authentication with the provider.
3. Receiving a deep-link callback.
4. Validating the callback.
5. Exchanging a one-time authorization code.
6. Updating authentication state.
7. Navigating to the authenticated application.

These operations can be tested at different levels.

## Component-Level Navigation Tests

For an isolated component, navigation functions can be mocked.

For example:

```typescript
const mockNavigate = jest.fn();

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),

  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));
```

A test can verify that navigation occurs after a successful operation.

## Navigation Integration Tests

For more realistic navigation testing, render the relevant screens inside a test navigation container.

This allows the test to verify that navigation state changes as expected.

## Deep-Link Testing

Useful scenarios include:

- Valid callback.
- Invalid callback.
- Expired authorization code.
- Duplicate callback.
- Missing state parameter.
- Authentication cancellation.
- Failed code exchange.

Jest can test JavaScript-side callback parsing and navigation logic.

However, it cannot fully verify the operating system's URL association behavior.

Actual Universal Links, Android App Links and custom URL scheme resolution should also be tested on the respective platforms.

---

# 11. React Query and Testing Asynchronous Server State

TanStack Query manages server state, including caching, request lifecycle and asynchronous updates.

When testing components that use TanStack Query, provide an isolated QueryClient for each test.

Example:

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}
```

A reusable provider:

```tsx
function renderWithProviders(ui) {
  const queryClient = createTestQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}
```

Disabling retries makes tests more predictable because failed requests do not wait through the normal retry behavior.

## Why Use a Separate QueryClient?

Tests should not accidentally share cached data or query state.

An isolated QueryClient helps prevent one test from influencing another.

After tests complete, clear the relevant query cache and clean up outstanding asynchronous work as appropriate.

For example:

```typescript
afterEach(() => {
  queryClient.clear();
});
```

The QueryClient used for cleanup must be the same instance used by the test.

Also, clearing a QueryClient does not automatically resolve every React `act` warning.

If a warning occurs, investigate whether the test is leaving asynchronous updates unfinished, whether queries or mutations are still running, and whether the testing environment is configured correctly.

---

# 12. Handling Common Jest and React Native Testing Problems

## Problem 1: Unexpected Token Errors

Possible cause:

Jest is attempting to execute dependency code that needs transformation.

Possible solution:

Review `transformIgnorePatterns` and allow the relevant dependencies to be transformed.

Do not blindly add every package.

## Problem 2: Native Module Errors

Possible cause:

A library expects native functionality that is unavailable in the Jest environment.

Possible solution:

Mock the native dependency or use its official testing mock when available.

## Problem 3: Async `act` Warnings

Possible cause:

A component updates after the test has completed.

Possible solution:

- Await asynchronous operations.
- Use `findBy...` or `waitFor` appropriately.
- Clean up subscriptions and pending work.
- Isolate QueryClient instances.
- Review the testing environment setup.

## Problem 4: Tests Affect Each Other

Possible cause:

Shared state, persisted storage or cached server data.

Possible solution:

- Reset Zustand state between tests.
- Create a fresh Redux store for each test.
- Create an isolated QueryClient.
- Reset mocks.
- Clean up subscriptions and event listeners.

## Problem 5: NativeWind and CSS Interop

Some React Native styling libraries use runtime integrations that are not automatically reproduced by Jest.

A project using NativeWind may require specific testing configuration or mocks.

However, a simplistic mock that removes every `className` prop does not verify actual styling behavior.

The mock should only provide the minimum behavior needed for the test boundary.

Visual styling and native rendering should be verified through appropriate device or visual testing rather than assuming a Jest mock validates them.

---

# 13. A Practical Testing Strategy for a React Native Application

A useful testing strategy combines different levels of testing.

For an authentication feature, the test plan could look like this:

| Feature                   | Testing approach                                  |
| ------------------------- | ------------------------------------------------- |
| Email validation          | Jest unit test                                    |
| Login service             | Jest and MSW                                      |
| Authentication state      | Zustand or Redux tests                            |
| Login screen              | React Native Testing Library                      |
| Loading and error states  | React Native Testing Library                      |
| Token refresh             | Integration test                                  |
| OAuth callback parsing    | Jest unit test                                    |
| Authentication navigation | Navigation integration test                       |
| Face ID integration       | Mocked JavaScript tests and native platform tests |
| Complete login workflow   | E2E testing                                       |

The objective is to avoid testing every implementation detail at every level.

For example, there is little value in testing the same email validation rule independently in ten different components.

Test the validation logic directly, then test that the relevant components respond correctly to its result.

---

# 14. Practical Interview Questions

### 1. What is the difference between unit, integration and end-to-end testing?

Unit tests verify individual pieces of logic.

Integration tests verify that multiple parts of the application work together.

End-to-end tests verify complete user workflows across the application.

### 2. What is the difference between Jest and React Native Testing Library?

Jest is the test runner and assertion/mocking framework.

React Native Testing Library provides utilities to render components and test their behavior through user interactions.

They are commonly used together.

### 3. Why use MSW instead of mocking Axios directly?

Direct Axios mocks are useful for isolated unit tests.

MSW intercepts HTTP requests at the network boundary, allowing more realistic testing of request and response behavior without depending on a real backend.

### 4. How do you test asynchronous API calls?

I use controlled responses, either through mocks or MSW, and verify the different application states.

For example, loading, success, failure and network errors.

I use asynchronous testing utilities such as `findBy...` and `waitFor` when the UI or state updates asynchronously.

### 5. How do you test Redux Toolkit?

I create an isolated store using `configureStore`, optionally providing `preloadedState`.

I test reducers, selectors and asynchronous workflows independently, then use a real provider when testing components that consume Redux state.

### 6. How do you test native modules?

I mock native dependencies when testing JavaScript-side behavior.

For example, I can mock Keychain or an in-app browser and verify that the application calls the correct methods with the expected arguments.

For actual platform behavior, such as Face ID or Secure Enclave operations, I use native platform testing and physical-device validation.

### 7. How do you test authentication token refresh?

I simulate expired access tokens and verify that the Axios interceptor initiates a refresh operation.

I also test concurrent requests to ensure that a single refresh operation is shared rather than issuing multiple refresh requests.

### 8. How do you prevent tests from affecting each other?

I use isolated stores and QueryClient instances, reset mocks and state between tests, and clean up subscriptions and asynchronous operations.

---

# Conclusion

React Native testing involves more than checking whether individual functions work.

A reliable application needs different testing approaches to verify business logic, component behavior, API integration, state management, navigation and native platform capabilities.

The key tools and concepts include:

1. Jest for unit testing and mocking.
2. React Native Testing Library for component behavior.
3. MSW for controlled HTTP responses.
4. Redux Toolkit and Zustand testing for state transitions.
5. React Navigation testing for navigation behavior.
6. Native module mocking for JavaScript-side integration.
7. TanStack Query testing for asynchronous server state.
8. Integration testing for authentication and token refresh.
9. E2E testing for complete application workflows.
10. Manual API testing and runtime debugging for investigating real application behavior.

The most important principle is to choose the appropriate testing level for the problem.

Manual API testing helps verify backend behavior. Unit tests verify individual functions. Component tests verify user interactions. Integration tests verify communication between application layers. E2E tests verify complete workflows.

These approaches work together.

The objective is not to maximize the number of tests or achieve an arbitrary code-coverage percentage. It is to build confidence that important application behavior remains correct as the codebase evolves.
