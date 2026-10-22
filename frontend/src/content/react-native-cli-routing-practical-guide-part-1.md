---
title: "Routing in React Native CLI: A Practical Guide (Part 1)"
slug: react-native-cli-routing-practical-guide-part-1
description: Learn how to structure navigation in a bare React Native CLI application using React Navigation, nested stack and tab navigators, authentication flows, TypeScript route parameters, and deep linking.
imageUrl: /images/8.webp
author: O. Ocak
date: 21.10.2026
tags:
  - React Native
  - React Navigation
  - TypeScript
  - Mobile Development
  - Navigation
published: true
---

# Routing in React Native CLI, A Practical Guide (PART 1)

Routing in a bare React Native CLI project works differently from routing on the web. There is no built-in router, file-based routing system, or browser URL bar. Instead, you compose **navigators** in code using [React Navigation](https://reactnavigation.org/), a widely used navigation library for React Native.

This guide explains a practical navigation architecture for a React Native application: a root stack containing the main tabs, public authentication screens presented as modals, and a nested stack for sensitive authentication flows.

The goal is to build a navigation structure that is easy to maintain while keeping navigation, authentication, and authorization responsibilities separate.

## Why React Native Needs a Navigation Library

React Native provides UI components, touch handling, and APIs for building mobile applications, but navigation is not part of its core API.

Unlike Next.js, where file-system conventions can define routes, React Native applications typically declare their navigation structure explicitly.

React Navigation provides several navigator types:

- **Stack navigators** for hierarchical navigation and screen transitions.
- **Tab navigators** for switching between primary sections of an application.
- **Drawer navigators** for side-menu navigation.

For native-backed stack navigation, `createNativeStackNavigator` integrates with native screen infrastructure through `react-native-screens`. This allows navigation transitions and screen behavior to follow platform conventions.

The key architectural decision is not simply which navigator to use, but how to compose navigators to reflect the application's user flows.

## Installation in a Bare React Native CLI Project

Install the core navigation library, native stack navigator, and required native dependencies:

```bash
npm install @react-navigation/native @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context
```

For iOS, install the CocoaPods dependencies:

```bash
cd ios
pod install
cd ..
```

After adding native dependencies, rebuild the application. A JavaScript reload alone does not compile newly added native modules.

> **Note:** Installation requirements can vary with your React Native version, platform, and navigation-library version. Follow the official [React Navigation installation guide](https://reactnavigation.org/docs/getting-started/) for the current setup.

## The Core Pattern: NavigationContainer and Stack.Navigator

Every React Navigation application typically has a `NavigationContainer` at its root. It manages navigation state and connects the navigation tree to the application.

A minimal stack looks like this:

```tsx
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";

type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

From a screen, navigation methods let you move between registered routes:

```tsx
navigation.navigate("Profile", { userId: "123" });
navigation.goBack();
navigation.replace("Home");
```

Their behavior depends on the navigator and current navigation state:

- `navigate()` navigates to a route and may reuse an existing route depending on the navigator.
- `push()` adds a new entry to a stack navigator.
- `goBack()` returns to the previous navigation state when possible.
- `replace()` replaces the current stack entry with another route.

For example, `replace()` is useful when the current screen should no longer remain in the back stack, but authentication transitions should still be designed around the application's overall auth state.

## Nesting: Tabs Inside a Root Stack

Real applications often need multiple navigation patterns at once. A common architecture places the main application tabs inside a root stack.

The root stack can then present screens that should appear above the tabs, such as sign-in and sign-up screens.

Conceptually, the structure looks like this:

```text
NavigationContainer
└── RootStack
    ├── RootTabs
    │   ├── HomeTab
    │   ├── AppsTab
    │   └── BlogTab
    ├── SignIn
    └── SignUp
```

The root stack might be defined as follows:

```tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import RootTabs from "./RootTabs";
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";

const RootStack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="Root"
        component={RootTabs}
        options={{ headerShown: false }}
      />

      <RootStack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{ presentation: "modal" }}
      />

      <RootStack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ presentation: "modal" }}
      />
    </RootStack.Navigator>
  );
}
```

The `presentation: 'modal'` option configures how a screen is presented. The exact transition depends on platform conventions and navigator configuration.

The tabs themselves can contain nested stacks. For example, a blog tab might have a blog list and individual blog-post screens, while an apps tab might have an application directory and individual app-detail screens.

This separation keeps navigation concerns local to each section instead of putting every screen into one large stack.

## Nested Stacks for Authentication Flows

Authentication often involves multiple screens, such as:

- Sign-in
- Sign-up
- Email or one-time-password verification
- Password reset
- Password update

These screens do not necessarily share the same access requirements.

A sign-in or sign-up screen is generally public. A verification screen may require a temporary authentication context, while a password-update screen might require a valid reset flow.

A nested navigator can group related screens:

```tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import VerifyOtpScreen from "./screens/VerifyOtpScreen";
import UpdatePasswordScreen from "./screens/UpdatePasswordScreen";

type PrivateAuthParamList = {
  VerifyOtp: { challengeId: string };
  UpdatePassword: undefined;
};

const PrivateAuthStack = createNativeStackNavigator<PrivateAuthParamList>();

export default function PrivateAuthNavigator() {
  return (
    <PrivateAuthStack.Navigator>
      <PrivateAuthStack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
      <PrivateAuthStack.Screen
        name="UpdatePassword"
        component={UpdatePasswordScreen}
      />
    </PrivateAuthStack.Navigator>
  );
}
```

The root stack can register this nested navigator as a single route:

```tsx
<RootStack.Screen
  name="PrivateAuth"
  component={PrivateAuthNavigator}
  options={{
    presentation: "modal",
    headerShown: false,
  }}
/>
```

This groups related screens and gives them a shared navigation context. However, **nesting screens does not automatically protect them**. Access control must be implemented separately.

### Authentication State Versus Route Guards

A common mistake is treating navigation as the security boundary. Hiding a screen or redirecting a user does not prevent someone from calling an API endpoint directly.

For many applications, React Navigation's recommended authentication pattern is to conditionally render authenticated and unauthenticated screens based on the current authentication state.

For example:

```tsx
function AppNavigator({ isSignedIn }: { isSignedIn: boolean }) {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        {isSignedIn ? (
          <RootStack.Screen
            name="Root"
            component={RootTabs}
            options={{ headerShown: false }}
          />
        ) : (
          <RootStack.Screen name="SignIn" component={SignInScreen} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
```

This is a simplified example. A production application should initialize authentication state before deciding which screens to render, handle loading and session restoration, and define how users move through sign-in, verification, and sign-out flows.

The backend must independently validate credentials, sessions, and permissions for every protected operation.

The important distinction is:

- **Navigation** determines which screens the user can reach through the UI.
- **Authentication** establishes whether the user has a valid identity or session.
- **Authorization** determines which resources and operations that identity is allowed to access.

These concepts work together, but they are not interchangeable.

## Screen Parameters and TypeScript

Navigation parameters allow one screen to pass information to another.

For example, a blog screen might navigate to a specific post:

```tsx
navigation.navigate("BlogPost", {
  slug: "setup-pm2",
});
```

The receiving screen can access the parameters through its route object:

```tsx
const route = useRoute<RouteProp<RootStackParamList, "BlogPost">>();

const { slug } = route.params;
```

The route types would include the parameter definition:

```tsx
type RootStackParamList = {
  Home: undefined;
  BlogPost: { slug: string };
};
```

In a real project, import `RouteProp` from `@react-navigation/native` and use the appropriate parameter list for the navigator that owns the screen.

Typed route definitions help catch mistakes at compile time, such as misspelled route names or missing required parameters. They also make navigation contracts easier to understand when multiple developers work on the same application.

## Deep Linking: Connecting URLs to Screens

Mobile applications sometimes need to open a specific screen from an external URL, such as a blog link shared in a message or an authentication callback.

React Navigation supports deep linking through its linking configuration. A simplified example is:

```tsx
const linking = {
  prefixes: ["oocak://", "https://oocak.com"],
  config: {
    screens: {
      BlogPost: "blog/:slug",
    },
  },
};
```

You can pass this configuration to `NavigationContainer`:

```tsx
<NavigationContainer linking={linking}>{/* Navigators */}</NavigationContainer>
```

This illustrates the mapping between URL patterns and screen names, but it is not a complete production deep-linking setup. The application must also configure the relevant iOS URL schemes or universal links, Android intent filters or app links, and any required domain association files.

Deep links should be treated as external input. A URL can identify a destination, but it should not grant access to protected content without normal authentication and authorization checks.

## Why Not Use Expo Router?

Expo Router provides file-based routing and is closely integrated with the Expo ecosystem. React Navigation provides explicit, component-based navigator composition and is also used underneath Expo Router.

For a bare React Native CLI project, React Navigation is a natural choice when the goal is to define the navigation tree directly in code. Expo Router is not inherently limited to Expo Go, nor is React Navigation restricted to bare projects; the better choice depends on the project architecture and development workflow.

If an application already uses React Navigation, introducing another routing abstraction is usually unnecessary unless it solves a concrete problem.

## What to Build First—and What to Defer

A practical implementation order is:

1. Define the root stack and main tabs.
2. Add public authentication screens.
3. Create nested stacks for complex screen flows.
4. Define typed route parameters.
5. Implement authentication-state restoration and navigation transitions.
6. Configure deep linking when the corresponding screens and backend flows are ready.

This order keeps the navigation layer understandable while the API and authentication logic are still being developed.

Token persistence should be designed separately. `AsyncStorage` is suitable for ordinary persisted application data, but sensitive credentials often require platform-backed secure storage. Choose storage based on the threat model and token lifecycle rather than treating every token as ordinary local state.

## The Takeaway

React Native navigation is primarily **explicit navigator composition rather than automatic file-system routing**. You define a tree of stacks, tabs, and nested navigators that reflects how users move through the application.

A root stack containing tabs, with public authentication screens and dedicated nested flows, can provide a clean foundation for a growing application. TypeScript makes the navigation contracts clearer, while authentication-state handling determines which screens should be available.

Most importantly, navigation is a UI architecture—not a security boundary. A maintainable application separates navigation structure, authentication state, secure credential storage, and backend authorization.

Once these responsibilities are clear, adding new screens becomes a controlled architectural change rather than an increasingly complicated collection of navigation calls.
