---
title: How JavaScript Runtimes, V8, Browsers, Node.js, and libuv works
slug: javascript-runtime-v8-nodejs-libuv
description: Learn how V8 executes JavaScript, how browsers provide web APIs, and how Node.js uses libuv and operating system facilities for asynchronous I/O and multithreaded workloads.
imageUrl: /images/5.webp
author: O. Ocak
date: 17.10.2026
tags:
  - JavaScript
  - V8
  - Node.js
  - libuv
published: true
---

# How JavaScript Runtimes Work: V8, Browsers, Node.js, and libuv

JavaScript is often described as a single-threaded language, but that description doesn't explain the entire system behind its execution.

How does JavaScript interact with the operating system? How can Node.js handle multiple I/O operations without blocking its main JavaScript thread? And what role does V8 play in both browsers and Node.js?

To understand these questions, we need to distinguish three layers: the JavaScript engine, the runtime environment, and the operating system.

In this article, I'll explore how V8 executes JavaScript, what browsers provide around it, and how Node.js uses libuv and native APIs to extend JavaScript beyond the browser.

## V8: The JavaScript Engine

V8 is Google's open-source JavaScript and WebAssembly engine, written primarily in C++. It is used by Chromium-based browsers and Node.js.

V8 parses and executes JavaScript, manages the JavaScript heap, and compiles code to improve execution performance. It can be understood as a specialized execution environment for JavaScript, although it is not a general-purpose virtual machine that emulates an entire computer.

Its main responsibilities include:

- Parsing JavaScript source code.
- Generating and executing bytecode.
- Compiling selected code into native machine instructions.
- Optimizing frequently executed functions.
- Managing JavaScript heap memory and garbage collection.

### How V8 executes JavaScript

V8 uses a tiered execution architecture to balance startup time with execution performance.

```text
JavaScript Source
       |
       v
     Parsing
       |
       v
  Ignition Bytecode
       |
       v
  Ignition Interpreter
       |
       v
  Runtime Feedback
       |
       +----------------------+
       |                      |
       v                      v
   Sparkplug                Maglev
  Baseline JIT           Mid-tier JIT
       |                      |
       +----------+-----------+
                  |
                  v
          TurboFan / Turboshaft
           Optimizing Compiler
                  |
                  v
         Native Machine Code
                  |
                  v
             CPU Executes
```

This is a conceptual overview, not a mandatory sequence for every function. V8 can execute bytecode through Ignition, compile code with Sparkplug, or promote suitable functions to more advanced optimization tiers. The actual path depends on runtime behavior and the engine's decisions.

Ignition interprets bytecode generated from JavaScript source. While code executes, V8 gathers feedback about how it behaves, including information about types and object structures.

Sparkplug provides fast baseline compilation. Maglev performs additional optimization with relatively low compilation overhead, while TurboFan is V8's traditional top-tier optimizing compiler. V8's newer Turboshaft infrastructure is used in the evolving optimizing compilation pipeline.

The goal is to start executing code quickly and invest more compilation effort where it can provide a meaningful performance benefit.

### JIT, AOT, and code caching

Just-in-Time (JIT) compilation generates machine code while a program is running. V8 uses JIT compilation to improve the performance of JavaScript code when appropriate.

Ahead-of-Time (AOT) compilation generates compiled output before execution. It is not a mandatory stage in V8's ordinary JavaScript execution pipeline.

V8 also supports code caching and startup snapshots. These mechanisms can reduce repeated compilation or initialization work, but they are not equivalent to compiling an entire JavaScript application into native machine code before execution.

The important distinction is that V8 can interpret bytecode, compile selected functions at runtime, and reuse certain prepared data without requiring every JavaScript function to be compiled into machine code ahead of time.

## The Browser: More Than V8

V8 executes JavaScript, but it does not independently provide all the functionality required by a web browser.

Consider this example:

```javascript
document.querySelector("button");

fetch("/api/users");

setTimeout(() => {
  console.log("Timer completed");
}, 1000);
```

The JavaScript language defines functions, objects, and execution behavior. However, `document` and browser-specific networking capabilities come from the browser environment rather than the language itself or V8 alone.

A Chromium-based browser combines several components:

- **V8:** Executes JavaScript.
- **Blink:** Implements the DOM and much of the browser's web-platform functionality.
- **Browser infrastructure:** Handles networking, security, process coordination, and other browser services.
- **Operating system:** Provides lower-level facilities for memory, scheduling, networking, graphics, and other operations.

A simplified view is:

```text
             Web Application
                    |
                    v
             Browser Runtime
                    |
          +---------+---------+
          |         |         |
          v         v         v
         V8       Blink    Browser APIs
          |         |         |
          +---------+---------+
                    |
                    v
             Operating System
                    |
                    v
                Hardware
```

This diagram represents logical responsibilities, not a strict process or thread hierarchy. Modern browsers distribute work across multiple processes and threads.

The key point is that the browser supplies capabilities around the JavaScript engine. The engine executes JavaScript, while the browser implements the web environment in which that JavaScript operates.

## Node.js: JavaScript Outside the Browser

Node.js uses V8 to execute JavaScript but provides a different runtime environment from a browser.

Instead of relying on a DOM, Node.js exposes APIs designed for server-side and general-purpose applications, including filesystem access, networking, processes, and worker threads.

For example:

```javascript
const fs = require("node:fs");

fs.readFile("users.json", "utf8", (error, data) => {
  if (error) {
    console.error(error);
    return;
  }

  console.log(data);
});
```

The `fs` API is provided by Node.js, not by JavaScript itself or V8.

Node.js integrates V8 with native bindings, runtime APIs, and supporting libraries. These components let JavaScript applications interact with the operating system without requiring the application developer to write native C++ code for every operation.

Node.js also provides a command-line executable, commonly invoked as:

```bash
node app.js
```

The terminal and shell let us launch the Node.js process, but the command-line interface is separate from the runtime that executes the program.

## libuv and the Event Loop

libuv is a cross-platform C library used by Node.js to provide event-loop functionality and asynchronous I/O facilities.

It helps coordinate operations that should not block the main JavaScript thread. Its facilities include timers, event notification, platform-specific I/O integration, and a worker pool for selected operations.

A simplified Node.js architecture looks like this:

```text
             JavaScript Application
                       |
                       v
                 Node.js Runtime
                       |
             +---------+---------+
             |                   |
             v                   v
            V8              Node.js APIs
             |                   |
             |                   v
             |                 libuv
             |                   |
             +---------+---------+
                       |
                       v
                Operating System
```

This is a logical overview rather than a strict call path. Some Node.js APIs use libuv, while other operations follow different native implementation paths.

### The call stack and event loop

The call stack tracks the JavaScript functions currently executing on a particular thread.

The event loop coordinates when eligible asynchronous callbacks can be processed. These are related concepts, but they serve different purposes.

Consider:

```javascript
console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

console.log("C");
```

The output is:

```text
A
C
B
```

The synchronous statements execute first. The timer callback runs later, when the timer is eligible and the runtime reaches the appropriate event-loop stage.

A zero-millisecond timer does not mean immediate execution.

The event loop does not perform all asynchronous work itself. Depending on the API, the underlying operation may be handled by the operating system, a native implementation, or a worker-pool thread.

## How Node.js Uses Threads

Node.js can perform asynchronous work without blocking its main JavaScript thread, but asynchronous execution and multithreaded JavaScript execution are not the same thing.

There are three important mechanisms to understand.

### The main JavaScript thread

JavaScript callbacks executing on the same thread run sequentially. If a CPU-intensive operation occupies that thread, the event loop cannot process other JavaScript callbacks on it until the operation finishes.

For example:

```javascript
function calculate() {
  let total = 0;

  for (let i = 0; i < 1_000_000_000; i++) {
    total += i;
  }

  return total;
}

console.log(calculate());
```

This calculation blocks the JavaScript thread executing it. Other callbacks on that thread must wait.

### The libuv worker pool

libuv provides a worker pool used by many filesystem operations, as well as certain DNS operations and other work submitted through its worker APIs.

A simplified example:

```text
JavaScript Main Thread
         |
         v
     Node.js API
         |
         v
    libuv Worker Pool
      +----+----+
      | T1 | T2 | ...
      +----+----+
         |
         v
   Native Work Completes
         |
         v
  Completion Processed by Loop
         |
         v
  JavaScript Callback Executes
```

The worker pool allows supported native operations to progress without occupying the main JavaScript thread for their entire duration.

The workers do not automatically execute arbitrary JavaScript callbacks. Typically, they perform native work, and the result is then made available for processing on the relevant event-loop thread.

Not all asynchronous operations use this pool. For example, network I/O commonly relies on operating-system event notification mechanisms rather than assigning one worker thread to each connection.

### Node.js worker threads

Node.js also provides the `worker_threads` module, which allows JavaScript to execute on separate threads.

For example:

```javascript
const { Worker } = require("node:worker_threads");

const worker = new Worker("./calculation.js");

worker.on("message", (result) => {
  console.log("Result:", result);
});
```

A worker can perform CPU-intensive JavaScript work independently of the main JavaScript thread. Each worker normally has its own V8 isolate and JavaScript execution environment.

This differs from the libuv worker pool:

- **libuv worker pool:** Performs selected native operations.
- **Node.js worker threads:** Execute JavaScript in separate threads.
- **Event loop:** Coordinates eligible callbacks and other scheduled work on its associated thread.

These mechanisms complement one another, but they are not interchangeable.

## Following a Real Request Through the Runtime

Consider a Node.js HTTP server that receives a request and needs to read a file before responding.

A simplified execution flow is:

```text
1. HTTP Request Arrives
          |
          v
2. OS Reports Network Activity
          |
          v
3. Node.js Processes the Request
          |
          v
4. JavaScript Handler Starts File Read
          |
          v
5. File Operation Proceeds Asynchronously
          |
          v
6. File Read Completes
          |
          v
7. JavaScript Callback Processes Result
          |
          v
8. Node.js Sends HTTP Response
```

When the request handler starts an asynchronous file read, it can continue or return without waiting synchronously for the file operation to finish.

While that operation is in progress, the same JavaScript thread can process other eligible work. Once the file read completes, its callback can run when scheduled by the runtime.

This is a simplified trace: the exact mechanism depends on the API and platform, and JavaScript callbacks still execute on their associated thread.

The important insight is that Node.js can handle many I/O operations without requiring a separate JavaScript thread for each request.

## How the Operating System Fits In

Node.js does not replace the operating system or independently manage all hardware resources. It uses native code and operating-system facilities to provide JavaScript with system-level capabilities.

For example, a filesystem operation may follow a path similar to this:

```text
JavaScript
    |
    v
Node.js Filesystem API
    |
    v
Native Implementation / libuv
    |
    v
Operating System Filesystem API
    |
    v
Storage Device
```

The exact path depends on the operation and platform.

Memory management is similarly divided:

- **V8** manages JavaScript heap memory and garbage collection.
- **Native code** can allocate memory outside the JavaScript heap.
- **The operating system** manages process virtual memory, physical-memory allocation, and thread scheduling.

Each layer has its own responsibilities. Understanding these boundaries helps explain both the capabilities and the limitations of the runtime.

## Conclusion

V8, browsers, Node.js, libuv, and the operating system are distinct components that work together.

V8 executes JavaScript and manages its JavaScript heap. Browsers combine a JavaScript engine with web APIs and rendering infrastructure. Node.js provides a server-side runtime with native APIs, while libuv contributes event-loop and asynchronous I/O facilities. The operating system supplies the underlying process, memory, networking, filesystem, and threading capabilities.

The most important distinction is that **executing JavaScript, coordinating asynchronous work, and managing operating-system resources are separate responsibilities**.

Once these responsibilities are understood, it becomes easier to reason about browser execution, backend performance, asynchronous I/O, and multithreaded JavaScript applications.
