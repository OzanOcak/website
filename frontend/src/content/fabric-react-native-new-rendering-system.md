---
title: "Fabric: React Native's New Rendering System"
slug: fabric-react-native-new-rendering-system
description: Explore how Fabric transforms React Native rendering through the Shadow Tree, Yoga layout, native view mounting, and improved coordination between JavaScript and native threads.
imageUrl: /images/7.webp
author: O. Ocak
date: 19.10.2026
tags:
  - React Native
  - Fabric
  - New Architecture
  - JavaScript
  - C++
  - UI Rendering
published: true
---

# Fabric: React Native's New Rendering System

## Introduction: Why React Native Needs a Rendering System

React Native allows developers to build mobile applications using React and JavaScript while rendering native platform UI components. However, a React component is not itself a native Android View or an iOS UIView.

Consider this component:

```tsx
import { View, Text } from "react-native";

export default function ProfileCard() {
  return (
    <View>
      <Text>Welcome back</Text>
    </View>
  );
}
```

React describes the UI through components and elements. React Native must translate that description into a hierarchy of native views that the operating system can display and interact with.

This involves several steps:

- React determines what the UI should look like.
- React Native represents the UI in its rendering system.
- Layout calculations determine the size and position of elements.
- The native platform receives the necessary changes to create or update views.

Fabric is React Native's New Architecture renderer. It provides a more integrated rendering system, implemented substantially in C++, that coordinates React's rendering model with native platform UI.

To understand why Fabric matters, we first need to understand how the legacy renderer worked.

## How the Legacy Renderer Worked

In the legacy architecture, JavaScript and native rendering functionality were connected through the React Native Bridge and the legacy UIManager system.

A simplified rendering process looked like this:

```text
          JavaScript Thread
                 |
                 v
          React Components
                 |
                 v
         React Reconciliation
                 |
                 v
       Legacy UIManager Updates
                 |
                 v
        Serialized Bridge Messages
                 |
                 v
           Native Side
                 |
                 v
         Native UI Views
```

The JavaScript side determined which UI changes were needed. Those changes were communicated to native functionality through the Bridge, where messages were processed to update native views.

Layout calculation was handled using Yoga, the layout engine used by React Native, while native platform code was responsible for creating and updating actual views.

The Bridge provided a workable communication mechanism, but it also introduced serialization and coordination overhead. JavaScript and native code operated in different environments, and their communication had to be managed across that boundary.

This became more challenging as applications grew more complex and required tighter coordination between rendering, layout, and native interactions.

## The Problem with the Legacy Rendering Architecture

The legacy renderer was not inherently incapable of producing smooth interfaces. Many applications worked well with it. Its architecture did, however, introduce limitations.

### Communication overhead

When JavaScript needed to communicate UI changes through the legacy Bridge, data often had to be serialized and passed between environments.

Frequent communication could add overhead, especially when many updates needed to be coordinated.

### Separate rendering responsibilities

React reconciliation, layout calculation, native view creation, and view updates involved different parts of the system.

Coordinating these responsibilities required communication between JavaScript and native code.

### Thread coordination

React Native uses multiple threads for different responsibilities. JavaScript execution, native UI operations, and background work cannot simply be treated as one sequential process.

The legacy architecture placed constraints on how rendering work could be coordinated across the JavaScript and native sides.

These limitations helped motivate a more integrated renderer that could share more rendering logic across JavaScript and native code.

## What Is Fabric?

Fabric is the renderer introduced as part of React Native's New Architecture.

Rather than relying on the legacy UIManager and Bridge-based rendering pipeline, Fabric uses a C++-based core to coordinate rendering and layout with the React Native JavaScript environment and native platform views.

Its responsibilities include:

- Representing the UI as a Shadow Tree.
- Coordinating layout calculations through Yoga.
- Managing changes to the rendered UI.
- Preparing and committing updates.
- Mounting the resulting changes onto native platform views.

A simplified architecture looks like this:

```text
               React Components
                      |
                      v
              React Reconciliation
                      |
                      v
              Fabric Renderer
                      |
             +--------+--------+
             |                 |
             v                 v
        Shadow Tree       Layout with Yoga
             |                 |
             +--------+--------+
                      |
                      v
              Tree Commit Phase
                      |
                      v
               Mounting Phase
                      |
                      v
              Native Platform UI
```

This diagram represents the major conceptual stages rather than a strict, single-threaded execution sequence. The actual pipeline includes scheduling, multiple tree versions, platform-specific operations, and coordination across threads.

The important distinction is that Fabric integrates rendering more closely with native code rather than depending on the legacy Bridge for every rendering update.

## The Shadow Tree: Representing the UI in C++

One of Fabric's central concepts is the Shadow Tree.

The Shadow Tree is a C++ representation of the UI hierarchy. It contains information about the nodes that make up the interface, including properties relevant to layout and rendering.

For example, consider:

```tsx
<View style={{ padding: 16 }}>
  <Text>Hello</Text>
  <Text>React Native</Text>
</View>
```

Conceptually, Fabric represents this hierarchy as a tree:

```text
             Shadow Tree
                  |
                  v
              View Node
             /         \
            v           v
       Text Node     Text Node
        "Hello"    "React Native"
```

These Shadow Nodes are not the same objects as the native Android Views or iOS UIViews. They represent the structure and properties of the interface within React Native's rendering system.

This distinction allows Fabric to reason about the UI hierarchy before applying the required changes to the actual native views.

The Shadow Tree also supports a more structured approach to calculating layout and coordinating rendering updates.

## Yoga: Calculating Layout

React Native uses Yoga to calculate the layout of UI elements. Yoga implements a Flexbox-based layout system that determines the size and position of elements based on their styles and the constraints imposed by their parents.

For example:

```tsx
<View style={{ flexDirection: "row", gap: 12 }}>
  <View style={{ flex: 1 }} />
  <View style={{ flex: 2 }} />
</View>
```

Yoga calculates how the available space is distributed between the two child views.

Conceptually:

```text
             Parent View
                  |
                  v
             Yoga Layout
                  |
          +-------+-------+
          |               |
          v               v
       Child A          Child B
       flex: 1           flex: 2
          |               |
          v               v
       1 part            2 parts
       of space          of space
```

The example illustrates proportional sizing, assuming the children share available space under the relevant layout constraints.

Yoga calculates layout information; it does not itself draw the final pixels on the screen. The native platform is responsible for displaying the resulting views.

Fabric integrates layout calculation into its rendering process so that layout information can be coordinated with the Shadow Tree and subsequent mounting operations.

## From React Updates to Native Views

When application state changes, React may determine that part of the interface needs to be updated.

For example:

```tsx
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <View>
      <Text>Count: {count}</Text>
      <Pressable onPress={() => setCount(count + 1)}>
        <Text>Increase</Text>
      </Pressable>
    </View>
  );
}
```

When the user presses the button, React processes the state update and determines what has changed.

Conceptually, Fabric's rendering process involves the following stages:

```text
       User Presses Button
                |
                v
        React State Update
                |
                v
       React Reconciliation
                |
                v
      New Shadow Tree Changes
                |
                v
         Layout Calculation
                |
                v
         Tree Commit Phase
                |
                v
          Mounting Phase
                |
                v
       Native View Is Updated
```

The exact internal sequence depends on scheduling, the type of update, and the rendering path.

A key concept is that the Shadow Tree is not the actual native view hierarchy. Fabric coordinates the preparation and commitment of rendering changes, then applies the necessary mutations to native views during mounting.

This separation helps the renderer manage rendering work without requiring every intermediate step to mutate the native view hierarchy immediately.

## Fabric and Threading

Understanding Fabric requires distinguishing the JavaScript thread from the native UI thread.

React Native commonly involves several types of execution:

- **JavaScript thread:** Executes application JavaScript and React logic.
- **UI thread:** Handles native UI operations that must be performed on the platform's UI thread.
- **Background or other native threads:** Can handle suitable tasks that do not need to run on the UI thread.

The precise thread responsibilities depend on the operation and platform.

Fabric is designed to coordinate rendering work across these environments. It does not simply move every rendering task to the UI thread.

A simplified illustration is:

```text
        JavaScript Thread
               |
               v
       React State Update
               |
               v
        React Rendering
               |
               v
       Fabric Coordination
               |
         +-----+-----+
         |           |
         v           v
    Layout Work   Native UI Work
         |           |
         +-----+-----+
               |
               v
       Updated Native Views
```

This is a conceptual diagram, not a guarantee that all operations follow these exact paths or execute on separate threads.

Fabric can support synchronous access to parts of the rendering system in appropriate situations. For example, some native-driven interactions need timely access to rendering information.

However, synchronous access does not mean all JavaScript and native work becomes synchronous. Blocking a critical thread can harm responsiveness, so the architecture still needs appropriate scheduling and thread coordination.

## Fabric and Concurrent Rendering

Fabric was designed to work with React's modern rendering capabilities, including support for concurrent rendering features.

Concurrent rendering allows React to manage rendering work more flexibly. Depending on the update and the features being used, React can prioritize updates, pause some rendering work, or abandon an unfinished render and try again.

For example, an urgent interaction such as responding to user input may need different scheduling priority from rendering a large amount of non-urgent content.

Conceptually:

```text
         React Rendering Work
                  |
                  v
          Update Priorities
                  |
          +-------+-------+
          |               |
          v               v
     Urgent Update    Non-Urgent Update
          |               |
          v               v
     Process First    Process When Suitable
```

This is an illustration of prioritization, not a literal diagram of Fabric's internal scheduler.

Concurrent rendering does not mean that all JavaScript work executes simultaneously. It means React has more flexibility in how rendering work is scheduled and completed.

Fabric provides the rendering infrastructure needed to support these modern React capabilities in React Native.

## How Fabric Improves UI Performance

Fabric's architectural changes can improve rendering coordination, but performance should be understood in context.

### More integrated rendering

Fabric's C++ core and Shadow Tree provide a more integrated approach to rendering and layout than the legacy UIManager architecture.

### Less dependence on serialized Bridge messages

Rendering updates no longer need to rely on the legacy Bridge in the same way. This reduces dependence on serialization and asynchronous message passing for the rendering pipeline.

### Better coordination of rendering work

Fabric's rendering and commit model allows the system to prepare and coordinate UI changes before applying them to native views.

### Support for modern React features

Fabric works with React's modern rendering capabilities, giving the renderer more flexibility in handling updates.

However, Fabric does not automatically eliminate all performance problems.

An application can still suffer from expensive JavaScript calculations, unnecessary component renders, oversized lists, costly native operations, or excessive layout work.

For example, a poorly optimized `FlatList` can still render too much content or trigger expensive updates even when Fabric is enabled.

The renderer is one part of the performance picture. Application code, state management, data flow, and native integrations remain important.

## How to Use Fabric in a React Native Application

For most application developers, using Fabric does not require manually constructing Shadow Trees or calling Fabric's internal C++ APIs.

You generally work through React Native's public APIs:

```tsx
import { View, Text, Pressable } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "600" }}>Profile</Text>

      <Pressable onPress={() => console.log("Profile pressed")}>
        <Text>Open profile</Text>
      </Pressable>
    </View>
  );
}
```

React Native's renderer handles the underlying rendering process.

Developers should focus on the following practices:

- Use standard React Native components and APIs where possible.
- Use `FlatList` or other suitable virtualized lists for large collections.
- Avoid unnecessary state updates and expensive rendering work.
- Keep expensive calculations off critical interaction paths.
- Test animations and gestures on real devices.
- Profile performance before assuming the renderer is the bottleneck.

### What if you need a native UI component?

A native component may be required when an application needs platform functionality that is not adequately exposed by standard React Native components.

Under the New Architecture, Fabric supports native components through the relevant native component and code-generation infrastructure.

Conceptually:

```text
      JavaScript Component
               |
               v
       Component Specification
               |
               v
       Code Generation Setup
               |
               v
      Native Component Binding
               |
               v
       Platform-Specific View
```

The actual setup depends on the component, React Native version, and platform. Native component implementations may involve C++, Kotlin or Java on Android, and Swift or Objective-C++ on iOS.

This is one reason understanding the New Architecture matters for React Native CLI development: when a library needs native integration, you may need to inspect or modify the native projects rather than working only in JavaScript.

## Fabric vs. the Legacy Renderer

The following comparison summarizes the main architectural differences.

| Area                         | Legacy Renderer                                | Fabric                                                           |
| ---------------------------- | ---------------------------------------------- | ---------------------------------------------------------------- |
| Rendering infrastructure     | Legacy UIManager                               | New Architecture renderer                                        |
| Core rendering model         | Legacy rendering pipeline                      | C++-based core and Shadow Tree                                   |
| Layout                       | Yoga                                           | Yoga integrated into the Fabric rendering process                |
| Bridge dependency            | Legacy Bridge used for rendering communication | Rendering no longer depends on the legacy Bridge in the same way |
| Native view updates          | Legacy UIManager coordinates updates           | Fabric coordinates commit and mounting                           |
| Modern React rendering       | More constrained by the legacy architecture    | Designed to support modern React rendering capabilities          |
| Native component integration | Legacy native component mechanisms             | New Architecture component infrastructure                        |

Fabric is not merely a faster version of the same renderer. It changes how rendering state, layout, commits, and native view mutations are organized.

At the same time, both architectures serve the same fundamental purpose: translating React's UI description into a native interface.

## Conclusion

Fabric is a central part of React Native's New Architecture. It provides a more integrated rendering system built around a C++ core, a Shadow Tree, Yoga layout, and coordinated mounting of native views.

The legacy renderer relied on the Bridge and UIManager to coordinate rendering updates. Fabric changes that architecture, enabling closer integration between React's rendering process and native platform UI.

The distinction between rendering and displaying the UI is important. React determines what the interface should look like, Fabric coordinates the rendering and layout process, and the native platform ultimately displays and manages the actual views.

For application developers, the goal is not to control Fabric's internals directly. It is to understand how React updates become native UI changes, how work is coordinated across threads, and how application code can avoid unnecessary rendering and layout costs.

With that foundation, Fabric becomes easier to understand as part of the larger React Native architecture rather than as an isolated performance feature.

## References

- [React Native: The New Architecture](https://reactnative.dev/architecture/landing-page)
- [React Native: Render, Commit, and Mount](https://reactnative.dev/architecture/render-pipeline)
- [React Native: Threading Model](https://reactnative.dev/architecture/threading-model)
- [React Native: Fabric Renderer](https://reactnative.dev/architecture/fabric-renderer)
- [React Native: Using Codegen](https://reactnative.dev/docs/the-new-architecture/using-codegen)
- [Yoga Layout Engine](https://www.yogalayout.dev/)
