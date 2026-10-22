---
title: "Hermes: JavaScript Execution and Memory Management in React Native"
slug: hermes-javascript-execution-memory-management
description: Understand how Hermes executes JavaScript in React Native, manages its own heap, and works alongside native C++ memory and the operating system.
imageUrl: /images/2.webp
author: O. Ocak
date: 18.10.2026
tags:
  - JavaScript
  - React Native
  - Hermes
  - JavaScriptCore
  - C++
  - Memory Management
published: true
---

# Hermes: JavaScript Execution and Memory Management in React Native

## Introduction: Why Hermes Exists

React Native allows developers to build mobile applications using JavaScript and React while accessing native platform functionality. However, JavaScript needs an execution environment. In a browser, that environment is provided by the browser and its JavaScript engine. In React Native, the application runs JavaScript through an embedded JavaScript engine.

Historically, React Native used JavaScriptCore (JSC) as its JavaScript engine. Hermes was developed by Meta specifically with the performance characteristics of mobile applications in mind.

Hermes is not a replacement for React Native itself. It is the engine responsible for executing JavaScript. React Native provides the broader application framework, including rendering, native modules, and communication between JavaScript and native platform code.

To understand Hermes, we need to look at three related but separate responsibilities:

- **JavaScript execution:** How JavaScript code is compiled and executed.
- **JavaScript memory management:** How JavaScript objects are allocated and reclaimed.
- **Native integration:** How JavaScript interacts with native C++ code and platform APIs.

These responsibilities work together, but they are not handled by one unified memory manager.

## From JavaScript Source Code to Bytecode

When we write JavaScript, we work with human-readable source code:

```javascript
function calculateTotal(price, quantity) {
  return price * quantity;
}

const total = calculateTotal(20, 3);
```

The processor cannot directly execute this JavaScript source code as ordinary machine instructions. A JavaScript engine must interpret or compile the code into a form it can execute.

Hermes supports bytecode compilation. In a typical React Native release build, JavaScript is compiled into Hermes bytecode during the build process.

The general process looks like this:

```text
JavaScript Source Code
          |
          v
   Hermes Compiler
       (hermesc)
          |
          v
    Hermes Bytecode
          |
          v
     Mobile App
          |
          v
   Hermes JavaScript Engine
          |
          v
   JavaScript Execution
```

This approach allows the application to avoid performing the same source-to-bytecode compilation work at startup. It can improve startup performance, although actual results depend on the application and its workload.

Bytecode is not the same as native machine code. It is an instruction format designed for the JavaScript engine to execute.

It is also important to distinguish build-time compilation from runtime execution. Hermes still has to execute the program when the application runs; precompiling bytecode does not mean the JavaScript application has already performed its work.

## How Hermes Executes JavaScript

Once the application starts, Hermes loads the bytecode and executes JavaScript instructions.

Consider this example:

```javascript
const user = {
  name: "Ozan",
  active: true,
};

function greet(person) {
  return `Hello, ${person.name}`;
}

const message = greet(user);
```

During execution, the engine must represent values, evaluate expressions, call functions, access properties, and produce results.

At a conceptual level, the engine manages several important things:

- **Execution state:** Information required to execute functions and continue program execution.
- **Call stack:** Tracks active function calls and their execution contexts.
- **Heap:** Holds dynamically allocated JavaScript objects and other managed data.
- **Garbage collector:** Identifies objects that are no longer reachable and reclaims their memory.

A simplified execution model looks like this:

```text
        Hermes JavaScript Engine
+----------------------------------+
|                                  |
|  Execution Stack                 |
|  +----------------------------+  |
|  | greet(user)                |  |
|  | calculateTotal(...)        |  |
|  | Other active calls         |  |
|  +----------------------------+  |
|                                  |
|  JavaScript Heap                 |
|  +----------------------------+  |
|  | user object                |  |
|  | strings and other objects  |  |
|  | arrays and closures        |  |
|  +----------------------------+  |
|                                  |
|  Garbage Collection              |
+----------------------------------+
```

This diagram is conceptual rather than a representation of Hermes's exact internal data structures.

The stack and heap serve different purposes. The stack supports function execution, while the heap provides storage for dynamically allocated objects. Their exact implementation is determined by the engine.

This distinction matters because executing JavaScript and managing its memory are related but separate responsibilities.

## Understanding the Hermes Heap and Garbage Collection

JavaScript developers do not normally allocate and free memory manually. When we create objects, arrays, and functions, the JavaScript engine manages the memory required to represent them.

For example:

```javascript
function createUser() {
  const user = {
    name: "Ozan",
    preferences: ["JavaScript", "React Native"],
  };

  return user;
}

const currentUser = createUser();
```

The returned object remains accessible through `currentUser`, even after `createUser()` has finished executing.

This demonstrates why the lifetime of an object is not necessarily the same as the lifetime of the function that created it.

Hermes uses garbage collection to reclaim memory occupied by JavaScript objects that are no longer reachable.

Conceptually:

```text
JavaScript References
          |
          v
    Reachable Objects
          |
          v
  Objects remain available
  while they are reachable

Unreachable Objects
          |
          v
   Garbage Collection
          |
          v
   Memory can be reclaimed
```

The garbage collector does not simply delete every object when a function returns. An object may continue to be referenced by another object, a closure, a global variable, or application state.

This automatic management makes JavaScript easier to work with, but it does not eliminate memory problems. An application can still retain objects longer than necessary, accumulate caches, or keep references to data that it no longer needs.

The JavaScript heap is managed by Hermes, but it is not an independent pool of physical memory. Its allocations ultimately consume memory belonging to the application's process on the device.

## Hermes Memory and Native C++ Memory

This is where the architecture becomes particularly interesting.

A React Native application does not contain only JavaScript objects. It can also contain native C++ objects, platform resources, image buffers, and other allocations that exist outside the JavaScript heap.

Hermes manages JavaScript memory. Native code can allocate and manage its own memory using C++ and platform mechanisms.

For example, native code might allocate a buffer to hold image data. That buffer does not automatically become a JavaScript object simply because JavaScript interacts with it.

A simplified model is:

```text
              Mobile Application
+---------------------------------------------+
|                                             |
|  JavaScript Environment                     |
|  +---------------------------------------+  |
|  | Hermes                                |  |
|  |                                       |  |
|  | JavaScript Heap                       |  |
|  | - Objects                             |  |
|  | - Arrays                              |  |
|  | - Functions and closures              |  |
|  |                                       |  |
|  | Managed by Hermes and its GC          |  |
|  +---------------------------------------+  |
|                    |                        |
|                    | JSI / Native Bindings  |
|                    |                        |
|  +---------------------------------------+  |
|  | Native C++ Environment                |  |
|  |                                       |  |
|  | Native Objects                        |  |
|  | Buffers and Other Resources            |  |
|  |                                       |  |
|  | Managed through native ownership      |  |
|  +---------------------------------------+  |
|                                             |
+---------------------------------------------+
                     |
                     v
             Operating System
       Process and Virtual Memory
```

Both the JavaScript heap and native allocations consume memory within the application process. However, they are not automatically part of the same heap, and they do not necessarily share the same memory-management strategy.

This distinction is important when investigating memory usage. An application can have substantial native memory usage even when the JavaScript heap appears relatively small.

### Native memory and C++ smart pointers

C++ provides several mechanisms for managing object lifetimes.

For example:

```cpp
#include <memory>

class NativeResource {
public:
    void process() {
        // Perform native processing.
    }
};

auto resource = std::make_shared<NativeResource>();
resource->process();
```

Here, `std::shared_ptr` manages shared ownership of a C++ object. When the relevant shared ownership ends, the object can be destroyed.

This is different from JavaScript garbage collection. A C++ smart pointer follows C++ ownership rules; it does not automatically place the native object inside Hermes's garbage-collected heap.

When JavaScript and native code interact, the integration layer must coordinate the lifetimes of objects and references. Otherwise, the application can encounter leaks, dangling references, or premature destruction.

**The key idea is that direct interoperability does not require a unified heap.** JavaScript and native code can work together while maintaining different memory-management mechanisms.

## JSI: Connecting JavaScript and Native Code

The relationship between Hermes and native C++ becomes easier to understand when we introduce JavaScript Interface (JSI).

JSI is an interface that allows a JavaScript engine to interact with C++ code. It is not itself a JavaScript engine, a garbage collector, or a memory allocator.

In the legacy React Native architecture, JavaScript and native functionality commonly communicated through the Bridge, which used asynchronous message passing and serialization.

The New Architecture uses JSI to enable more direct interactions between JavaScript and native code.

A simplified comparison looks like this:

```text
LEGACY ARCHITECTURE

JavaScript
    |
    v
Bridge
(Serialized Messages)
    |
    v
Native Modules


NEW ARCHITECTURE

JavaScript
    |
    v
JSI
    |
    v
Native C++ Objects and Functions
    |
    v
Platform APIs
```

The second diagram simplifies the real architecture. Native module systems and platform-specific layers still exist, and not every operation follows a single direct path.

The important difference is that JSI can expose native functionality and objects to JavaScript without requiring every interaction to be represented as a serialized Bridge message.

Depending on the integration, JavaScript can call native C++ functionality directly, and native objects can be represented to JavaScript through wrappers such as JSI host objects.

This does not mean JavaScript objects and C++ objects become identical. They remain objects from different environments, with their own rules and lifetimes.

It also does not mean every operation must be synchronous. Synchronous calls are possible in appropriate integrations, but asynchronous communication remains important for work that should not block JavaScript execution.

## Why Hermes Matters for Mobile Performance

Mobile applications operate under constraints that differ from many desktop environments. Startup time, memory consumption, battery usage, and responsiveness can all affect the user experience.

Hermes was designed with these mobile constraints in mind.

### Startup performance

Precompiled Hermes bytecode can reduce the work required to prepare JavaScript for execution at application startup.

This can be particularly valuable when an application has a substantial JavaScript codebase. However, startup time also depends on module initialization, application logic, native initialization, rendering, and other factors.

### Memory footprint

Hermes is designed to keep the JavaScript execution environment suitable for mobile devices. Its memory behavior and garbage collector affect how much memory the JavaScript portion of an application consumes and how it behaves over time.

However, Hermes does not control every allocation in the application. Native modules, image processing, platform APIs, and other components can consume significant memory independently.

### JavaScript execution and responsiveness

Even with Hermes, JavaScript can become a bottleneck if the application performs expensive calculations or too much work on the JavaScript thread.

Likewise, native code can become a bottleneck if it performs expensive operations on a critical thread or allocates excessive memory.

Performance therefore depends on the complete system, not only on the engine.

It is useful to separate two categories of improvements:

- **Engine-level improvements:** Bytecode precompilation, JavaScript execution behavior, garbage collection, and memory footprint.
- **Architecture-level improvements:** More direct JavaScript/native integration, reduced serialization overhead, and changes to rendering and module systems.

Hermes contributes to the first category. JSI and the broader React Native New Architecture contribute to the second. Their benefits can complement each other, but they should not be confused.

## Hermes vs. JavaScriptCore vs. V8

Hermes, JavaScriptCore, and V8 are all JavaScript engines. They execute JavaScript, but they differ in design choices and optimization strategies.

| Feature                | Hermes                                          | JavaScriptCore                                                               | V8                                                                |
| ---------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Primary context        | Optimized for React Native and mobile use cases | Used by Safari and other environments, including React Native configurations | Used by Chrome and Node.js                                        |
| JavaScript execution   | Supports Hermes bytecode                        | Uses its own compilation and execution pipeline                              | Uses its own compilation and execution pipeline                   |
| Memory management      | Own JS heap and garbage collection              | Own JS heap and garbage collection                                           | Own JS heap and garbage collection                                |
| Node.js default engine | No                                              | No                                                                           | Yes                                                               |
| React Native support   | Yes                                             | Yes, depending on configuration                                              | Possible through suitable integrations, but not the usual default |

These engines share the same broad responsibility: executing JavaScript. They do not have identical implementations, compilation strategies, or performance characteristics.

The right engine depends on the environment and workload. In React Native, Hermes is commonly used because it is designed around mobile application needs.

## Putting It All Together

A React Native application combines several layers that have different responsibilities.

```text
                 React Native Application
                           |
             +-------------+-------------+
             |                           |
             v                           v
      JavaScript Code              Native Code
             |                           |
             v                           v
          Hermes                    C++ / Platform APIs
             |                           |
             v                           v
      JavaScript Heap              Native Allocations
             |                           |
             +-------------+-------------+
                           |
                           v
                 Application Process
                           |
                           v
                    Operating System
```

This is a conceptual overview rather than a literal execution pipeline. JSI and other integration layers connect JavaScript and native functionality, while rendering and platform work can follow their own paths.

The main point is that React Native does not confine an application to the JavaScript engine. JavaScript execution, native processing, memory allocation, rendering, and operating-system resource management work together.

Hermes manages JavaScript execution and its JavaScript heap. Native C++ code can allocate resources outside that heap and manage them through native ownership mechanisms. JSI can connect these environments without requiring every interaction to pass through the legacy serialized Bridge.

These systems cooperate, but they do not become one unified runtime or one shared garbage-collected heap.

Understanding that distinction provides a more accurate picture of React Native performance. The engine matters, but so do the native code, the communication architecture, the rendering system, and the way the application manages its resources.

## References

- [Hermes JavaScript Engine](https://hermesengine.dev/)
- [Hermes on React Native](https://reactnative.dev/docs/hermes)
- [React Native: JavaScript Environment](https://reactnative.dev/docs/javascript-environment)
- [React Native: JavaScript Interface (JSI)](https://reactnative.dev/architecture/landing-page#javascript-interface-jsi)
- [React Native: The New Architecture](https://reactnative.dev/architecture/landing-page)
- [Hermes Design Documentation](https://github.com/facebook/hermes/blob/main/doc/Design.md)
- [Toward Hermes Being the Default](https://reactnative.dev/blog/2021/10/26/toward-hermes-being-the-default)
