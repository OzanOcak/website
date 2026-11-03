---
title: "React Native Performance: Optimizing Renders, Lists, and the JavaScript Thread"
slug: react-native-performance-optimization
description: A practical guide to React Native performance optimization, covering render behavior, React.memo, useCallback, FlatList virtualization, state management, JavaScript and UI threads, Hermes, and profiling techniques.
imageUrl: /images/6.webp
author: o. ocak
date: 02.11.2026
tags:
  - React Native
  - Performance
  - JavaScript
  - FlatList
  - React
  - Hermes
  - Mobile Development
published: true
---

## Introduction

React Native performance optimization involves understanding how JavaScript execution, React rendering, native UI operations and device resources interact.

When interviewers ask about React Native performance, they generally want to know whether you can identify performance bottlenecks, understand their causes and apply appropriate optimizations.

A common misconception is that performance optimization simply means using `React.memo`, `useCallback` and `FlatList`.

These tools are useful, but effective optimization starts with identifying the actual bottleneck.

For example:

- Excessive React rendering can increase JavaScript execution time.
- Large lists can consume unnecessary memory and rendering resources.
- Synchronous JavaScript operations can delay event processing.
- Expensive native layout and drawing operations can affect UI responsiveness.
- Large images can increase memory pressure.
- Poorly configured API requests can introduce unnecessary network and processing overhead.

This article explores practical React Native performance optimization techniques, including rendering behavior, Redux selectors, list virtualization, JavaScript and native threading, Hermes, the New Architecture, image optimization and profiling.

The examples are based on a React Native application using TypeScript, Redux Toolkit, TanStack Query and native platform capabilities.

---

## Understanding the JavaScript Thread and Native UI Thread

One of the most important concepts in React Native performance is understanding the responsibilities of the JavaScript and native execution environments.

React Native applications involve several different execution responsibilities.

### JavaScript Thread

The JavaScript thread executes application JavaScript.

Typical responsibilities include:

- React component execution.
- State updates and application logic.
- Event handlers.
- JavaScript-based animations.
- Processing API responses.
- Data transformations.
- JavaScript-side navigation logic.

Expensive synchronous operations on this thread can delay other JavaScript work.

For example, parsing a very large JSON response or performing a CPU-intensive calculation can prevent the JavaScript event loop from processing other work promptly.

This can make the application feel unresponsive.

### Native UI Thread

The native UI thread is responsible for native UI operations and platform interface updates.

Typical responsibilities include:

- Native view operations.
- UI event handling.
- Layout and drawing work performed by the platform.
- Applying updates to native views.

Native UI operations can experience performance problems independently of JavaScript execution.

For example, an expensive native layout or excessive view hierarchy can cause UI rendering problems even when JavaScript is relatively idle.

### Why the distinction matters

Consider two scenarios:

**Scenario A: JavaScript thread is blocked**

A developer performs an expensive synchronous calculation on the JavaScript thread.

The application may become unresponsive to JavaScript-driven interactions, and JavaScript-based animations can drop frames.

**Scenario B: Native UI thread is overloaded**

The application renders an unnecessarily complex native view hierarchy.

The UI thread may struggle to maintain smooth rendering even if JavaScript execution is relatively light.

These problems require different debugging strategies.

### React Native New Architecture

The React Native New Architecture introduces important changes to communication between JavaScript and native code.

Three major components are:

**JSI (JavaScript Interface)**

JSI provides a C++ interface that allows JavaScript to interact with native capabilities without relying on the old asynchronous bridge serialization model.

**Fabric**

Fabric is React Native's new rendering system. It improves the integration between React rendering and native UI operations.

**TurboModules**

TurboModules provide a modern native module system with improved integration and typed interfaces through code generation.

The New Architecture improves the communication and rendering model, but it does not eliminate performance bottlenecks.

Expensive JavaScript calculations, excessive rendering, memory pressure and inefficient native operations can still affect application performance.

---

## React Rendering and Unnecessary Re-renders

React rendering is another important area of performance optimization.

When a component's state or props change, React may execute the component again to calculate the updated UI.

When a parent component renders, its child components may also be rendered unless React can bail out of that work.

### The Problem: HomeScreen.tsx

Imagine a HomeScreen containing:

- A search input.
- A hero section.
- Several buttons.
- Multiple FeatureCard components.

When a user types into the search input, the HomeScreen state changes.

The parent component renders again, and its child components may also render.

If FeatureCard components receive unchanged props and contain expensive rendering logic, repeatedly executing them can introduce unnecessary work.

### The Solution: React.memo

`React.memo` allows React to skip rendering a component when its props are shallowly equal to the previous props.

```tsx
// FeatureCard.tsx

import React from "react";

export const FeatureCard = React.memo(({ app, headline, primaryLabel }) => {
  console.log("FeatureCard rendered:", headline);

  return (
    <View>
      <Text>{headline}</Text>
      {/* Feature card content */}
    </View>
  );
});
```

If the parent renders again but the props remain unchanged, React can skip rendering the memoized component.

### Important Considerations

`React.memo` is not a universal performance solution.

It does not prevent renders caused by:

- The component's own state changes.
- Context values consumed by the component changing.
- Props receiving new references.
- Other updates that affect the component.

It also introduces a shallow prop comparison.

For simple components, the comparison itself may not provide meaningful benefits.

The objective is to avoid expensive unnecessary rendering, not to memoize every component.

---

## Function Reference Stability with useCallback

JavaScript creates a new function object whenever a function expression is evaluated.

This becomes relevant when passing callbacks to memoized child components.

### The Problem

```tsx
<Pressable onPress={() => navigation.navigate("SignIn")}>
  <Text>Sign In</Text>
</Pressable>
```

The inline callback is recreated whenever the parent component renders.

If the callback is passed to a memoized child component, its new reference can cause that child to render again.

### The Solution: useCallback

```tsx
import { useCallback } from "react";

const handleSignIn = useCallback(() => {
  navigation.navigate("SignIn");
}, [navigation]);

<Pressable onPress={handleSignIn}>
  <Text>Sign In</Text>
</Pressable>;
```

`useCallback` preserves the function reference between renders while its dependencies remain unchanged.

### When Should You Use It?

It is particularly useful when:

- Passing callbacks to memoized children.
- Using callbacks as dependencies in effects.
- Maintaining stable callback references for subscriptions.
- Avoiding unnecessary changes to dependency-sensitive values.

However, `useCallback` does not make the function itself execute faster.

It also has its own bookkeeping cost.

Using it everywhere without identifying a problem can introduce unnecessary complexity.

The goal is to stabilize references when reference identity actually matters.

---

## FlatList Virtualization and Large Lists

Rendering large collections is a common source of performance problems in mobile applications.

Consider a blog feed containing 100 or more posts.

Using `ScrollView` with `.map()` renders all items as part of the scrollable content.

```tsx
<ScrollView>
  {posts.map((post) => (
    <BlogCard key={post.id} post={post} />
  ))}
</ScrollView>
```

This approach can become expensive when each item contains multiple components, images and other UI elements.

### The Solution: FlatList

React Native's `FlatList` uses virtualization.

Instead of keeping every item rendered as a native view, it maintains a rendering window around the visible area.

As users scroll, cells outside the window can be removed and additional cells can be rendered.

Example:

```tsx
<FlatList
  data={posts}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => <BlogCard post={item} />}
  initialNumToRender={5}
  maxToRenderPerBatch={5}
  windowSize={5}
  getItemLayout={(_, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

### Important Performance Properties

| Property                    | Purpose                                                                               |
| --------------------------- | ------------------------------------------------------------------------------------- |
| `initialNumToRender`        | Controls the initial number of rendered items                                         |
| `maxToRenderPerBatch`       | Controls the maximum number of items rendered in a batch                              |
| `windowSize`                | Controls the size of the rendering window                                             |
| `getItemLayout`             | Provides predictable item dimensions and offsets                                      |
| `updateCellsBatchingPeriod` | Controls the interval between rendering batches                                       |
| `removeClippedSubviews`     | Can detach offscreen native views from their backing hierarchy on supported platforms |

### Understanding the Trade-offs

A smaller `windowSize` can reduce the number of mounted cells and memory usage.

However, it can increase the possibility of blank areas when users scroll quickly.

A larger `maxToRenderPerBatch` can fill the list more quickly but may consume more JavaScript execution time during each batch.

The correct configuration depends on:

- Item complexity.
- Device performance.
- Average item height.
- Scrolling behavior.
- Image usage.
- Data size.

### getItemLayout

`getItemLayout` is particularly useful when item dimensions are predictable.

It allows FlatList to calculate item positions without measuring every item dynamically.

However, it should only be used when the actual dimensions and separators are known.

An incorrect item height or offset can produce incorrect scrolling behavior.

### FlatList and TanStack Query

In a production application, list virtualization and server pagination solve different problems.

FlatList manages how UI elements are rendered.

TanStack Query manages how server data is fetched, cached and paginated.

Combining `FlatList` with `useInfiniteQuery` provides a practical approach for large mobile feeds.

---

#√ Redux Toolkit Selectors and Rendering Performance

Redux selectors are another important topic for React Native applications using Redux Toolkit.

A common misunderstanding is that every Redux store update causes every component using `useSelector` to render again.

That is not how `useSelector` works by default.

React Redux compares the previous and next selected values using strict reference equality (`===`).

If the selected value remains the same, the component does not need to render again because of that selector.

### Example: Simple Selector

```tsx
const accessToken = useSelector((state: RootState) => state.auth.accessToken);
```

If `deviceId` changes but `accessToken` remains the same string, this selector continues returning the same value.

The component does not need to rerender because of that update.

### The Actual Problem: Returning New References

Consider this selector:

```tsx
const authData = useSelector((state: RootState) => ({
  accessToken: state.auth.accessToken,
  deviceId: state.auth.deviceId,
}));
```

Every time the selector executes, it creates a new object.

Even if both properties contain the same values, the object reference is different.

Because the default comparison uses reference equality, the component can render again unnecessarily.

### The Solution: createSelector

Redux Toolkit provides `createSelector` through Reselect.

It memoizes derived selector results.

```tsx
import { createSelector } from "@reduxjs/toolkit";

const selectAccessToken = (state: RootState) => state.auth.accessToken;

export const selectIsSignedIn = createSelector(
  [selectAccessToken],
  (accessToken) => Boolean(accessToken),
);
```

The selector recalculates its derived result when its input changes.

### When to Use Memoized Selectors

They are particularly useful when:

- Computing derived values from multiple state properties.
- Filtering or transforming large collections.
- Returning objects or arrays.
- Sharing expensive derived calculations across components.

Simple selectors that return existing primitive values generally do not require `createSelector`.

The important interview distinction is that Redux Toolkit selectors help avoid unnecessary derived calculations and unstable references. They do not automatically make every selector faster.

---

## JavaScript Thread Blocking and Expensive Operations

Expensive synchronous operations can block JavaScript execution.

For example:

```tsx
const result = largeDataset.map((item) => {
  return performExpensiveCalculation(item);
});
```

If this operation takes a significant amount of time, the JavaScript thread cannot process other JavaScript work until the synchronous execution finishes.

Possible symptoms include:

- Delayed button responses.
- Slow navigation transitions.
- Dropped JavaScript-driven animation frames.
- Delayed event processing.
- Unresponsive interactions.

### Common Sources of JavaScript Bottlenecks

- Parsing very large JSON responses.
- Complex synchronous calculations.
- Large data transformations.
- Excessive component rendering.
- Inefficient loops.
- Expensive sorting and filtering.
- Large synchronous storage operations.

### Native Modules for Expensive Operations

Some operations are better suited to native implementations.

For example, native modules can provide access to:

- Secure Enclave operations.
- Platform biometric authentication.
- Native cryptographic APIs.
- Platform-specific device capabilities.

In my authentication architecture, Secure Enclave operations are intended to be handled by an iOS native module.

However, one important distinction is that calling native code does not automatically mean the operation executes on a background thread.

The native module's implementation and execution queue determine where the work runs.

A CPU-intensive operation should execute on an appropriate native queue rather than blocking the UI thread.

Similarly, a native module that performs synchronous work on a critical execution path can still introduce performance problems.

### Deferring Non-Urgent Work

Some work does not need to happen immediately when a screen appears.

For example, an application may need to process additional data after the initial screen transition.

React Native has historically provided `InteractionManager` for scheduling work after interactions.

However, `InteractionManager` is deprecated in recent React Native documentation.

For suitable non-urgent JavaScript work, `requestIdleCallback` is a modern alternative to consider.

The general principle is to avoid performing expensive non-essential work during critical interaction and rendering periods.

### Important Distinction: Asynchronous Requests

Waiting for a network request does not inherently block the JavaScript thread.

The network operation can proceed asynchronously.

However, processing a massive response synchronously after receiving it can still block JavaScript execution.

This distinction is important when diagnosing API-related performance problems.

---

## Hermes JavaScript Engine

Hermes is a JavaScript engine optimized for React Native applications.

It is designed to improve characteristics such as application startup time and memory usage on mobile devices.

### Why Hermes Matters

React Native applications execute JavaScript through a JavaScript engine.

Hermes provides an engine designed with React Native's mobile environment in mind.

Important characteristics include:

- JavaScript bytecode compilation.
- Runtime optimization for mobile applications.
- Memory-management considerations.
- Profiling support.

### Bytecode Compilation

Hermes can compile JavaScript into Hermes bytecode during the build process.

This allows the application to execute precompiled bytecode rather than performing all compilation work at runtime.

This can improve startup characteristics, although actual performance depends on the application, device and build configuration.

### Hermes Does Not Eliminate Performance Problems

Using Hermes does not automatically prevent:

- Excessive React rendering.
- Expensive synchronous JavaScript.
- Large memory allocations.
- Poor list configuration.
- Inefficient application logic.

The engine provides an execution environment; application-level performance still requires proper design and profiling.

---

## React Native New Architecture: JSI, Fabric and TurboModules

The New Architecture is important because it changes how JavaScript and native code communicate.

### JSI

JSI provides a C++ interface for communication between JavaScript and native code.

The legacy React Native architecture relied heavily on an asynchronous bridge that serialized messages between JavaScript and native modules.

JSI enables more direct integration and removes the requirement for that legacy serialization model.

### Fabric

Fabric is React Native's new rendering system.

It improves the integration between React's rendering process and native UI components.

This provides a more modern rendering architecture and supports tighter coordination between JavaScript and native UI operations.

### TurboModules

TurboModules provide a modern native module system.

They support typed interfaces through code generation and improve how native capabilities are exposed to JavaScript.

### Interview Summary

| Component    | Responsibility                         |
| ------------ | -------------------------------------- |
| JSI          | JavaScript and native interoperability |
| Fabric       | React Native rendering system          |
| TurboModules | Native module integration              |
| Hermes       | JavaScript execution engine            |

The New Architecture improves the underlying infrastructure, but developers still need to optimize rendering, JavaScript execution, native UI work and memory usage.

---

## Image Optimization and Memory Management

Images can consume significant memory in mobile applications.

Consider a FlatList containing ten high-resolution images.

Even if each image appears as a small thumbnail, loading unnecessarily large image resources can increase memory consumption and image-decoding costs.

This can contribute to:

- UI stuttering.
- Slow image loading.
- Increased memory pressure.
- Application termination due to excessive memory usage.

### Using expo-image

Libraries such as `expo-image` provide native image-loading and caching capabilities.

Example:

```tsx
import { Image } from "expo-image";

<Image
  source={{ uri: post.imageUrl }}
  style={{
    width: 100,
    height: 100,
  }}
  contentFit="cover"
  transition={200}
  cachePolicy="memory-disk"
/>;
```

### Important Considerations

React Native's built-in `Image` also supports image caching behavior.

However, `expo-image` provides additional caching policies and image-loading capabilities.

Useful optimization techniques include:

- Requesting appropriately sized images from the backend.
- Avoiding unnecessary full-resolution image downloads.
- Defining image dimensions.
- Using suitable caching policies.
- Avoiding unnecessary image transformations.
- Monitoring memory consumption in image-heavy lists.

The objective is not simply to cache every image, but to balance image quality, loading speed and memory usage.

---

## API Performance and Server-State Optimization

Performance optimization is not limited to rendering.

Network requests and server-state management also affect how responsive an application feels.

In my React Native application, TanStack Query handles server state while Axios handles HTTP communication.

Some useful optimization techniques include:

### Query Caching

TanStack Query can reuse previously fetched data rather than requesting it repeatedly.

Appropriate `staleTime` values can reduce unnecessary refetching.

### Request Deduplication

When multiple components request the same query, TanStack Query can share the same in-flight request.

This reduces unnecessary network activity.

### Pagination

Instead of retrieving a complete dataset, the application can request smaller pages.

This reduces initial data transfer and processing.

### Query Invalidation

Invalidating only the queries affected by a mutation avoids unnecessary refetching of unrelated data.

### Cancellation

When a query is no longer needed, TanStack Query can cancel it.

The query function should consume the supplied `AbortSignal` so that cancellation can reach the underlying HTTP request.

These techniques improve data-fetching efficiency, although they do not replace UI profiling or JavaScript performance optimization.

---

## Profiling and Diagnosing Performance Bottlenecks

One of the most important interview questions is:

**How would you identify and fix a performance problem in a React Native application?**

The correct answer should describe a debugging process rather than simply listing optimization libraries.

### Step 1: Reproduce the Problem

First, identify the conditions under which the performance problem occurs.

For example:

- Does the screen become slow when typing?
- Does scrolling become choppy?
- Does the problem occur only on Android?
- Does the application become slow after several minutes?
- Does the problem occur during navigation?
- Does it happen when images load?

Without reproducing the issue, it is difficult to identify its cause.

### Step 2: Identify the Affected Layer

Determine whether the problem is related to:

- JavaScript execution.
- React component rendering.
- Native UI rendering.
- Network requests.
- Memory consumption.
- Image decoding.
- Native module execution.

A drop in JavaScript FPS does not automatically mean the native UI thread is blocked.

Similarly, UI rendering problems can occur independently of JavaScript execution.

### Step 3: Profile the Application

Useful tools include:

**React Native DevTools**

Provides debugging and profiling capabilities for React Native applications, including component inspection and performance investigation.

**React Profiler**

Helps identify which components render, how frequently they render and how much time rendering takes.

**Xcode Instruments**

Useful for investigating iOS performance issues, including CPU usage, memory allocation and leaks.

**Android Studio Profiler**

Useful for investigating Android CPU usage, memory consumption and other runtime behavior.

**Hermes Profiling Tools**

Help investigate JavaScript execution and identify expensive JavaScript operations.

### Step 4: Apply a Targeted Optimization

Examples:

| Problem                        | Possible solution                                        |
| ------------------------------ | -------------------------------------------------------- |
| Unnecessary component renders  | React.memo and stable props                              |
| Expensive derived calculations | useMemo or memoized selectors                            |
| Unstable callback references   | useCallback where beneficial                             |
| Large lists                    | FlatList virtualization                                  |
| Excessive image memory usage   | Image sizing and caching                                 |
| Large synchronous calculations | Break up or move work off the JS thread                  |
| Excessive API requests         | Query caching and request deduplication                  |
| Native UI bottlenecks          | Investigate native view hierarchy and platform rendering |

### Step 5: Measure Again

After implementing an optimization, profile the application again.

Compare the results with the original behavior.

An optimization should be based on measurable improvement rather than assumptions.

### Understanding FPS

A typical target for smooth mobile rendering is 60 frames per second, corresponding to approximately 16.67 milliseconds per frame.

React Native performance tools can help distinguish JavaScript and UI frame rates.

| Symptom                       | Possible bottleneck                                        |
| ----------------------------- | ---------------------------------------------------------- |
| JS FPS drops                  | Expensive JavaScript execution or excessive rendering work |
| UI FPS drops                  | Native layout, drawing or UI-thread work                   |
| Both drop                     | Broader CPU or resource contention                         |
| Memory continuously increases | Potential memory leak or excessive object retention        |

These are diagnostic clues, not definitive proof of the underlying cause.

Profiling is necessary to identify the actual bottleneck.

### Profile Release Builds

Development mode introduces additional overhead.

For meaningful performance measurements, test release builds on representative devices whenever possible.

A screen that performs well on a development machine may behave differently on a lower-end Android device.

---

## Practical Interview Scenarios

Understanding individual APIs is useful, but interviewers may ask how you would solve a real problem.

Here are several scenarios worth practising.

### Scenario 1: A Search Screen Becomes Slow While Typing

Possible causes:

- Parent components rerender unnecessarily.
- Large lists are filtered synchronously.
- Child components receive unstable props.
- Expensive calculations execute on every keystroke.

Potential solutions:

- Profile the React component tree.
- Memoize expensive derived calculations.
- Use React.memo where beneficial.
- Stabilize callback references when needed.
- Debounce remote search requests.
- Virtualize large result lists.

### Scenario 2: A Blog Feed Stutters While Scrolling

Possible causes:

- Too many mounted components.
- Expensive item rendering.
- Large images.
- Incorrect list configuration.
- Excessive state updates.

Potential solutions:

- Use FlatList.
- Optimize item components.
- Use stable keys.
- Configure virtualization carefully.
- Optimize image dimensions and caching.
- Profile JS and UI performance separately.

### Scenario 3: Navigation Animations Become Unresponsive

Possible causes:

- Expensive synchronous JavaScript.
- Heavy work during screen transitions.
- Excessive rendering.
- Expensive native view operations.

Potential solutions:

- Identify whether JavaScript or native UI work is responsible.
- Defer non-essential work.
- Reduce unnecessary rendering.
- Move suitable CPU-intensive work to an appropriate native implementation.
- Profile the transition.

### Scenario 4: The Application Becomes Slower After Several Minutes

Possible causes:

- Memory leaks.
- Retained event listeners.
- Unreleased subscriptions.
- Excessive cached data.
- Large image memory consumption.
- Repeatedly accumulating application state.

Potential solutions:

- Inspect memory allocations.
- Verify effect cleanup.
- Remove event listeners when no longer needed.
- Review cache retention policies.
- Investigate image memory usage.
- Reproduce the issue and inspect memory over time.

---

# Conclusion

React Native performance optimization requires understanding how JavaScript execution, React rendering, native UI operations, networking and device resources interact.

The most important concepts covered in this article include:

1. Understanding the JavaScript thread and native UI thread.
2. Reducing unnecessary React component renders.
3. Using React.memo appropriately.
4. Maintaining stable callback references with useCallback.
5. Optimizing large lists with FlatList virtualization.
6. Understanding Redux selector equality and memoization.
7. Avoiding expensive synchronous JavaScript operations.
8. Understanding native modules and execution queues.
9. Understanding Hermes and JavaScript bytecode.
10. Understanding JSI, Fabric and TurboModules.
11. Optimizing images and memory consumption.
12. Improving network efficiency with TanStack Query.
13. Profiling with React Native DevTools, Xcode Instruments and Android Studio Profiler.
14. Following a systematic process to diagnose and verify performance improvements.

The most important principle is that performance optimization should be measurement-driven.

Tools such as `React.memo`, `useCallback`, `FlatList` and memoized selectors are useful, but applying them without understanding the actual bottleneck can introduce unnecessary complexity.

A good React Native developer should be able to reproduce a performance issue, identify the responsible execution layer, profile the application, apply a targeted optimization and verify that the change produces measurable improvement.

That is the difference between knowing performance optimization techniques and actually being able to diagnose performance problems in a production mobile application.
