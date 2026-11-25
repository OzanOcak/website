---
title: "Understanding Rust: Syntax, Ownership, and Compilation (Part 0)"
slug: understanding-rust-syntax-ownership-compilation
description: >-
  This article introduces the fundamentals of the Rust programming language before building a web backend.
  It covers Rust syntax, variables, data types, structs, enums, ownership, borrowing, lifetimes, error handling, traits, modules, compilation, asynchronous programming, Tokio, and memory safety.
imageUrl: /images/1.webp
author: o. ocak
date: 15.11.2026
tags:
  - Rust
  - Programming Languages
  - Ownership
  - Memory Safety
  - Async Programming
  - Systems Programming
  - Backend Development
published: true
---

Before building a web backend with Rust, it is worth understanding how the language works.

Rust is quite different from JavaScript, TypeScript, PHP, or Python. Its syntax may initially look familiar, but its approach to memory management, types, error handling, and concurrency is fundamentally different.

When moving an existing Node.js or Express backend to Rust, the challenge is not simply translating JavaScript syntax into Rust syntax. You also need to understand concepts such as ownership, borrowing, references, lifetimes, traits, and compilation.

These concepts influence how Rust applications are structured and why the compiler sometimes rejects code that would execute without any issues in JavaScript.

This article introduces the Rust fundamentals needed to understand a practical web backend built with Axum, Tokio, and SQLx.

The objective is not to cover every feature of the Rust language. Instead, we will focus on the concepts that matter when developing real applications and understanding what happens behind the scenes.

## 1. What Is Rust?

Rust is a systems programming language designed around performance, memory safety, and concurrency.

Unlike JavaScript, which typically runs through an engine such as V8, Rust is compiled into native machine code before execution.

Rust provides several important characteristics:

- **Performance:** Rust compiles to native machine code and has no mandatory garbage collector.
- **Memory safety:** Its ownership and borrowing rules prevent many common memory-related bugs.
- **Concurrency safety:** The type system helps prevent data races when working with multiple threads.
- **Static typing:** Types are checked during compilation.
- **Zero-cost abstractions:** Many high-level language features are designed to compile into efficient machine code without requiring runtime overhead.

Rust is commonly used for:

- Backend services and APIs
- Command-line applications
- Operating systems and system utilities
- Embedded development
- Networking applications
- Database infrastructure
- Desktop applications
- Performance-sensitive software

### Rust compared with Node.js

Consider a simple Node.js application:

```javascript
const express = require("express");

const app = express();

app.get("/api/hello", (req, res) => {
  res.json({
    message: "Hello from Node.js",
  });
});

app.listen(3000);
```

Node.js executes JavaScript through its runtime environment. The V8 engine handles JavaScript execution, while Node.js provides APIs for networking, filesystem access, and other system operations.

A Rust application follows a different execution model.

Rust source code is compiled into a native executable. That executable runs directly on the operating system and uses the operating system's facilities through compiled code and libraries.

For example:

```rust
fn main() {
    println!("Hello from Rust");
}
```

This small program is compiled before it runs.

The distinction becomes particularly important when developing backend applications. Rust does not require a JavaScript runtime or a garbage collector to manage application memory.

However, this does not mean Rust applications automatically perform better in every situation. Database queries, network latency, application architecture, and external services can still dominate overall response time.

The language gives developers more control over performance, but the actual results depend on implementation.

## 2. Installing Rust and Understanding Cargo

Rust development normally uses two main tools:

- **rustc:** The Rust compiler.
- **Cargo:** Rust's package manager and build system.

Most developers interact with Cargo rather than invoking the compiler directly.

Cargo handles:

- Creating projects
- Managing dependencies
- Compiling source code
- Running applications
- Executing tests
- Building optimized release binaries

### Installing Rust

The recommended installation method is `rustup`, the Rust toolchain installer.

On macOS and Linux:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

After installation, verify the environment:

```bash
rustc --version
cargo --version
```

Rustup also allows you to update the installed toolchain:

```bash
rustup update
```

### Creating a project

Create a new Rust application:

```bash
cargo new rust-introduction
```

The generated project has a structure similar to this:

```text
rust-introduction/
├── Cargo.toml
└── src/
    └── main.rs
```

`Cargo.toml` contains project metadata and dependencies.

`src/main.rs` is the application's entry point for a binary project.

For example:

```toml
[package]
name = "rust-introduction"
version = "0.1.0"
edition = "2024"

[dependencies]
```

The `edition` determines which edition of the Rust language the project uses. Editions introduce language improvements while maintaining compatibility across the broader Rust ecosystem.

### Common Cargo commands

| Command                 | Purpose                                                 |
| ----------------------- | ------------------------------------------------------- |
| `cargo check`           | Checks the project without producing a final executable |
| `cargo build`           | Compiles the project in development mode                |
| `cargo build --release` | Compiles an optimized release executable                |
| `cargo run`             | Builds and runs the application                         |
| `cargo test`            | Runs automated tests                                    |
| `cargo fmt`             | Formats Rust source code                                |
| `cargo clippy`          | Runs additional code-quality checks                     |
| `cargo clean`           | Removes generated build artifacts                       |

A typical development workflow looks like this:

```bash
cargo check
cargo run
```

When preparing an application for deployment:

```bash
cargo build --release
```

Cargo places generated artifacts inside the `target` directory.

Development builds prioritize faster compilation and useful debugging information. Release builds apply optimizations and are generally the builds used for production.

## 3. Understanding Rust Syntax

Rust is a statically typed language. Variables, function parameters, return values, and structures have types that the compiler checks.

However, Rust can infer many types automatically.

### Variables: `let` and `mut`

In JavaScript, variables can be declared with `let` or `const`:

```javascript
let name = "Ozan";
let age = 35;

age = 36;
```

Rust uses `let` for variable declarations:

```rust
fn main() {
    let name = "Ozan";
    let age = 35;

    println!("Name: {}", name);
    println!("Age: {}", age);
}
```

An important difference is that Rust variables are immutable by default.

The following code does not compile:

```rust
fn main() {
    let age = 35;

    age = 36;
}
```

The compiler reports that an immutable variable cannot be assigned to again.

If a variable needs to change, declare it with `mut`:

```rust
fn main() {
    let mut age = 35;

    age = 36;

    println!("{}", age);
}
```

This is an intentional design decision. Rust makes mutability explicit.

It helps developers understand which values can change during execution and reduces accidental modifications.

### Basic data types

Rust provides several built-in data types.

| Type     | Description                  | Example                            |
| -------- | ---------------------------- | ---------------------------------- |
| `i32`    | Signed 32-bit integer        | `let age: i32 = 35;`               |
| `i64`    | Signed 64-bit integer        | `let id: i64 = 100;`               |
| `u32`    | Unsigned 32-bit integer      | `let count: u32 = 10;`             |
| `f32`    | 32-bit floating-point number | `let price: f32 = 12.5;`           |
| `f64`    | 64-bit floating-point number | `let amount: f64 = 99.99;`         |
| `bool`   | Boolean                      | `let active: bool = true;`         |
| `char`   | Unicode scalar value         | `let letter: char = 'A';`          |
| `String` | Owned, growable string       | `let name = String::from("Ozan");` |
| `&str`   | String slice                 | `let name: &str = "Ozan";`         |

Rust can infer types:

```rust
let age = 35;
let active = true;
let price = 19.99;
```

Explicit types are also possible:

```rust
let age: i32 = 35;
let active: bool = true;
let price: f64 = 19.99;
```

Type inference reduces unnecessary declarations while preserving compile-time type checking.

### Strings: `String` and `&str`

One distinction that is particularly important in Rust is the difference between `String` and `&str`.

A `String` is an owned, growable string allocated on the heap.

```rust
let mut name = String::from("Ozan");

name.push_str(" Ocak");

println!("{}", name);
```

A string slice, represented by `&str`, is a borrowed view into string data.

```rust
let name: &str = "Ozan";

println!("{}", name);
```

The distinction becomes important when passing strings to functions.

```rust
fn print_name(name: &str) {
    println!("{}", name);
}

fn main() {
    let name = String::from("Ozan");

    print_name(&name);
}
```

The function receives a reference to the string rather than taking ownership of it.

This means the original variable remains usable after the function call.

We will explore borrowing in more detail later.

### Functions

Rust functions are declared using `fn`.

```rust
fn greet() {
    println!("Hello");
}

fn main() {
    greet();
}
```

Functions can receive parameters:

```rust
fn greet(name: &str) {
    println!("Hello, {}", name);
}

fn main() {
    greet("Ozan");
}
```

Unlike JavaScript, Rust requires parameter types to be specified.

```rust
fn add(a: i32, b: i32) -> i32 {
    a + b
}

fn main() {
    let result = add(10, 20);

    println!("{}", result);
}
```

The arrow `->` specifies the return type.

Notice that the final expression does not have a semicolon:

```rust
a + b
```

Rust returns the value of the final expression in a function when it is not terminated with a semicolon.

The following is also valid:

```rust
fn add(a: i32, b: i32) -> i32 {
    return a + b;
}
```

Both versions return the same result.

### Expressions and statements

Rust distinguishes between expressions and statements.

An expression produces a value.

A statement performs an operation but does not produce a value in the same way.

For example:

```rust
let number = 10;
```

This is a statement.

The following is an expression:

```rust
10 + 20
```

This distinction explains why Rust functions can return their final expression without using `return`.

It also applies to conditional expressions:

```rust
fn get_status(active: bool) -> &'static str {
    if active {
        "Active"
    } else {
        "Inactive"
    }
}
```

Both branches return a string slice, so the expression can be used as the function's return value.

### Conditional statements

Rust uses `if`, `else if`, and `else`.

```rust
fn main() {
    let age = 25;

    if age >= 18 {
        println!("Adult");
    } else {
        println!("Minor");
    }
}
```

Unlike JavaScript, Rust does not automatically convert values into booleans.

This is invalid:

```rust
if 1 {
    println!("True");
}
```

The condition must be a boolean:

```rust
if 1 == 1 {
    println!("True");
}
```

### Loops

Rust provides several looping constructs.

A `for` loop:

```rust
fn main() {
    for number in 1..5 {
        println!("{}", number);
    }
}
```

The range `1..5` includes 1 but excludes 5.

To include the final value:

```rust
for number in 1..=5 {
    println!("{}", number);
}
```

A `while` loop:

```rust
let mut counter = 0;

while counter < 5 {
    println!("{}", counter);

    counter += 1;
}
```

An unconditional loop:

```rust
loop {
    println!("Running");

    break;
}
```

Rust also supports returning a value from a loop:

```rust
let result = loop {
    break 100;
};

println!("{}", result);
```

### Collections: Arrays and Vectors

Rust arrays have a fixed size:

```rust
let numbers = [10, 20, 30, 40];
```

Their type includes the element type and length:

```rust
let numbers: [i32; 4] = [10, 20, 30, 40];
```

For dynamically sized collections, Rust provides `Vec<T>`:

```rust
let mut numbers: Vec<i32> = Vec::new();

numbers.push(10);
numbers.push(20);
numbers.push(30);
```

A vector can also be initialized with values:

```rust
let numbers = vec![10, 20, 30];
```

Iterating over a vector:

```rust
for number in &numbers {
    println!("{}", number);
}
```

The `&` means the loop borrows the vector's elements instead of consuming the vector.

### Pattern matching

Rust has a powerful construct called `match`.

```rust
fn get_role(role: &str) -> &'static str {
    match role {
        "admin" => "Administrator",
        "user" => "Regular User",
        "guest" => "Guest",
        _ => "Unknown",
    }
}
```

The `_` pattern acts as a catch-all case.

Unlike a conventional switch statement, Rust's `match` requires all possible cases to be handled.

This is particularly useful when working with enums and error handling.

## 4. Structs: Defining Application Data

In backend development, applications frequently work with structured data.

For example, a user might have:

- An ID
- A username
- An email address
- An account status

Rust uses `struct` to define custom data structures.

```rust
struct User {
    id: i32,
    username: String,
    email: String,
    active: bool,
}
```

Creating an instance:

```rust
fn main() {
    let user = User {
        id: 1,
        username: String::from("ozan"),
        email: String::from("ozan@example.com"),
        active: true,
    };

    println!("{}", user.username);
}
```

Struct fields are accessed using dot notation.

### Mutable structs

If a struct instance needs to be modified, declare the instance as mutable:

```rust
struct User {
    username: String,
    active: bool,
}

fn main() {
    let mut user = User {
        username: String::from("ozan"),
        active: true,
    };

    user.active = false;
}
```

### Methods and `impl`

Rust uses `impl` blocks to define methods associated with a struct.

```rust
struct User {
    username: String,
    active: bool,
}

impl User {
    fn new(username: String) -> Self {
        Self {
            username,
            active: true,
        }
    }

    fn deactivate(&mut self) {
        self.active = false;
    }

    fn is_active(&self) -> bool {
        self.active
    }
}
```

Using the implementation:

```rust
fn main() {
    let mut user = User::new(String::from("ozan"));

    user.deactivate();

    println!("Active: {}", user.is_active());
}
```

There are three important details here.

`Self` refers to the implementing type, in this case `User`.

`&self` means the method borrows the instance immutably.

`&mut self` means the method borrows the instance mutably.

These are examples of Rust's borrowing system, which is one of the most important concepts in the language.

## 5. Ownership: The Most Important Rust Concept

Ownership is the concept that makes Rust fundamentally different from many other programming languages.

In languages such as JavaScript, memory management is handled by the runtime's garbage collector.

For example:

```javascript
let user = {
  name: "Ozan",
};

let anotherUser = user;
```

JavaScript allows multiple references to the same object. The garbage collector determines when the object is no longer reachable and can be cleaned up.

Rust uses a different approach.

Every value has an owner.

A value can have only one owner at a time, and when that owner goes out of scope, the value is dropped.

Consider this example:

```rust
fn main() {
    let name = String::from("Ozan");

    println!("{}", name);
}
```

The variable `name` owns the string.

When the function finishes, the variable goes out of scope and Rust automatically releases the allocated memory.

No garbage collector is required for this operation.

### Understanding move semantics

Consider the following code:

```rust
fn main() {
    let name = String::from("Ozan");

    let another_name = name;

    println!("{}", name);
}
```

This does not compile.

Why?

Because assigning `name` to `another_name` moves ownership of the string.

After the move, `another_name` becomes the owner.

The original variable can no longer be used.

Conceptually:

```text
Before assignment:

name
  |
  v
String data


After assignment:

another_name
  |
  v
String data

name is no longer valid
```

This prevents two independent variables from believing they own the same heap allocation.

If both were allowed to release the same memory independently, the program could encounter memory corruption or double-free errors.

Rust prevents this at compile time.

### Copy versus Move

Not every assignment transfers ownership.

Simple types such as integers and booleans implement the `Copy` trait.

```rust
fn main() {
    let number = 10;

    let another_number = number;

    println!("{}", number);
    println!("{}", another_number);
}
```

Both variables remain valid.

The integer is copied because its value is small and has straightforward copy semantics.

A `String`, on the other hand, owns heap-allocated data and is moved by default.

This distinction is important:

| Type                | Typical assignment behavior       |
| ------------------- | --------------------------------- |
| `i32`               | Copy                              |
| `u64`               | Copy                              |
| `bool`              | Copy                              |
| `char`              | Copy                              |
| `String`            | Move                              |
| `Vec<T>`            | Move                              |
| Most custom structs | Move unless they implement `Copy` |

The exact behavior depends on the type's traits and implementation.

### Cloning a value

If you need an independent copy of a `String`, use `clone()`:

```rust
fn main() {
    let name = String::from("Ozan");

    let another_name = name.clone();

    println!("{}", name);
    println!("{}", another_name);
}
```

This creates a new allocation containing a copy of the string data.

Cloning is useful, but it can involve memory allocation and copying. It should not be used automatically whenever the compiler reports a move.

Often, borrowing is the better solution.

## 6. Borrowing and References

Borrowing allows a function or variable to access data without taking ownership of it.

A reference is created using `&`.

Consider:

```rust
fn print_name(name: &String) {
    println!("{}", name);
}

fn main() {
    let name = String::from("Ozan");

    print_name(&name);

    println!("{}", name);
}
```

The function receives a reference to the string.

It can read the value, but it does not own it.

After the function returns, the original variable remains valid.

This is borrowing.

### Immutable references

An immutable reference allows data to be read without modifying it.

```rust
fn calculate_length(value: &String) -> usize {
    value.len()
}

fn main() {
    let name = String::from("Ozan");

    let length = calculate_length(&name);

    println!("Length: {}", length);
}
```

The `&String` parameter is a reference to a string.

The function can inspect the string but cannot modify it through that reference.

In many cases, using `&str` is more flexible than `&String`:

```rust
fn calculate_length(value: &str) -> usize {
    value.len()
}
```

This function can accept both string literals and borrowed `String` values.

```rust
let name = String::from("Ozan");

calculate_length(&name);
calculate_length("Rust");
```

### Mutable references

If a function needs to modify borrowed data, it must receive a mutable reference.

```rust
fn update_name(name: &mut String) {
    name.push_str(" Ocak");
}

fn main() {
    let mut name = String::from("Ozan");

    update_name(&mut name);

    println!("{}", name);
}
```

There are two important requirements:

1. The original variable must be declared with `mut`.
2. The reference must be declared with `&mut`.

Rust enforces strict rules around mutable references.

At a given time, you can have either:

- Multiple immutable references, or
- One mutable reference.

You cannot have both an active mutable reference and other active references to the same data.

For example:

```rust
fn main() {
    let mut value = String::from("Hello");

    let first = &value;
    let second = &value;

    println!("{} {}", first, second);
}
```

This is valid because both references are immutable.

However:

```rust
fn main() {
    let mut value = String::from("Hello");

    let first = &value;

    let second = &mut value;

    println!("{} {}", first, second);
}
```

This is rejected because the immutable borrow is still being used when the mutable borrow is created.

The compiler prevents this kind of conflicting access.

### Why does Rust enforce these rules?

Imagine an application processing user information.

One part of the program reads a user's data while another part modifies it.

Without appropriate memory access rules, the program could read data while it is being changed, potentially producing inconsistent results.

Rust's borrowing rules prevent these conflicting accesses within safe Rust.

This becomes particularly important when working with concurrent applications.

### Borrowing in backend development

Consider a function that processes a user's username:

```rust
fn normalize_username(username: &str) -> String {
    username.trim().to_lowercase()
}
```

The function borrows the original username and returns a new owned string.

This is a common pattern in Rust:

- Borrow data when you only need to read it.
- Use mutable borrowing when you need to modify existing data.
- Return an owned value when the caller needs to keep the result independently.

Understanding these patterns makes Rust code much easier to read.

## 7. Lifetimes: How Long References Remain Valid

Lifetimes are another important Rust concept.

A lifetime describes how long a reference is valid.

Rust uses lifetime analysis to ensure that references never outlive the data they point to.

Consider this invalid example:

```rust
fn get_name() -> &String {
    let name = String::from("Ozan");

    &name
}
```

This does not compile.

The variable `name` is created inside the function. When the function finishes, the string is dropped.

Returning a reference to it would produce a dangling reference.

Rust prevents this.

### Understanding lifetime annotations

Consider a function that accepts two string references and returns one of them:

```rust
fn longest<'a>(first: &'a str, second: &'a str) -> &'a str {
    if first.len() > second.len() {
        first
    } else {
        second
    }
}
```

The `'a` syntax is a lifetime parameter.

It tells the compiler that the returned reference is associated with the lifetime of the input references.

The function does not create or own the returned string. It returns a reference to one of the inputs.

A caller could use it like this:

```rust
fn main() {
    let first = String::from("Rust");
    let second = String::from("Programming");

    let result = longest(&first, &second);

    println!("{}", result);
}
```

The compiler ensures that the returned reference cannot be used beyond the lifetime of the data it references.

### Do developers always need to write lifetimes?

No.

Rust can infer many lifetimes automatically through lifetime elision rules.

For example:

```rust
fn print_name(name: &str) {
    println!("{}", name);
}
```

There is no explicit lifetime annotation here because the compiler can determine the relationship.

Lifetimes become more visible when:

- A function returns references.
- A struct stores references.
- Multiple input references make the output lifetime ambiguous.
- Complex borrowing relationships exist.

For a typical backend application, you will frequently encounter references without needing to write explicit lifetime annotations.

It is important to understand what lifetimes mean, but they are not something you need to manually annotate everywhere.

## 8. Option and Result: Handling Missing Values and Errors

Rust does not use `null` in the same way as JavaScript.

Instead, it provides two important types:

- `Option<T>` for values that may or may not exist.
- `Result<T, E>` for operations that may succeed or fail.

These types are central to writing reliable Rust applications.

### Option

In JavaScript, a function might return `null` when a value does not exist:

```javascript
function findUser(id) {
  return users.find((user) => user.id === id) || null;
}
```

Rust represents this with `Option<T>`.

An `Option<T>` can contain:

- `Some(value)`
- `None`

For example:

```rust
fn find_user(id: i32) -> Option<String> {
    if id == 1 {
        Some(String::from("Ozan"))
    } else {
        None
    }
}
```

Using the result:

```rust
fn main() {
    let user = find_user(1);

    match user {
        Some(name) => println!("User: {}", name),
        None => println!("User not found"),
    }
}
```

The compiler forces you to account for the possibility that the value does not exist when you handle the `Option`.

You can also use methods such as `unwrap_or`:

```rust
let username = find_user(10)
    .unwrap_or(String::from("Unknown"));
```

This returns the contained value if it exists, otherwise it returns the fallback value.

### Result

`Result<T, E>` represents an operation that can succeed or fail.

It has two variants:

- `Ok(value)`
- `Err(error)`

For example:

```rust
fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        return Err(String::from("Cannot divide by zero"));
    }

    Ok(a / b)
}
```

Using the function:

```rust
fn main() {
    match divide(10.0, 2.0) {
        Ok(result) => println!("Result: {}", result),
        Err(error) => println!("Error: {}", error),
    }
}
```

The function explicitly describes both possible outcomes.

This is particularly important for backend development because database operations, file access, authentication, and network operations can fail.

### The `?` operator

Rust provides the `?` operator to simplify error propagation.

Consider a function that reads a file:

```rust
use std::fs;

fn read_config() -> Result<String, std::io::Error> {
    let content = fs::read_to_string("config.json")?;

    Ok(content)
}
```

The `?` operator checks the result.

If the operation succeeds, the contained value is returned to the local variable.

If it fails, the error is returned from the current function.

The function must return a compatible `Result` or another type supporting the appropriate residual conversion.

This makes error handling concise without hiding the possibility of failure.

Compare this with JavaScript:

```javascript
async function getUser() {
  try {
    return await database.findUser();
  } catch (error) {
    throw error;
  }
}
```

Rust generally makes error paths explicit through return types rather than relying on exceptions for ordinary recoverable errors.

### Avoiding `unwrap()` in production code

You will often see examples using:

```rust
let value = some_result.unwrap();
```

`unwrap()` returns the successful value, but it panics if the result is an error.

It is convenient for small examples and situations where failure is genuinely impossible or intentionally fatal.

However, it is usually not appropriate for handling routine failures in production API handlers.

For example, a database connection failure should normally be returned as an application error rather than unexpectedly panicking.

Prefer explicit handling or the `?` operator.

## 9. Enums and Pattern Matching

Rust enums are more powerful than simple enumerations in many languages.

They can represent different variants, including variants containing data.

For example:

```rust
enum AccountStatus {
    Active,
    Suspended,
    Pending,
}
```

Using the enum:

```rust
fn get_status(status: AccountStatus) -> &'static str {
    match status {
        AccountStatus::Active => "Active",
        AccountStatus::Suspended => "Suspended",
        AccountStatus::Pending => "Pending",
    }
}
```

An enum can also contain values:

```rust
enum ApiResponse {
    Success(String),
    Error(String),
    NotFound,
}
```

Handling these variants:

```rust
fn handle_response(response: ApiResponse) {
    match response {
        ApiResponse::Success(message) => {
            println!("Success: {}", message);
        }
        ApiResponse::Error(message) => {
            println!("Error: {}", message);
        }
        ApiResponse::NotFound => {
            println!("Resource not found");
        }
    }
}
```

This is useful because the compiler can verify that all variants are handled.

Enums are commonly used for:

- Application errors
- Authentication states
- Request states
- Domain models
- Configuration options

They are especially useful when an application has several possible outcomes that should be represented explicitly.

## 10. Traits: Defining Shared Behavior

Traits are one of Rust's most important abstraction mechanisms.

A trait describes behavior that a type can implement.

For example:

```rust
trait Loggable {
    fn log(&self);
}
```

This trait defines a method called `log`.

A struct can implement it:

```rust
struct User {
    username: String,
}

impl Loggable for User {
    fn log(&self) {
        println!("User: {}", self.username);
    }
}
```

Now the `User` type supports the `Loggable` behavior.

```rust
fn main() {
    let user = User {
        username: String::from("ozan"),
    };

    user.log();
}
```

### Traits compared with interfaces

If you have worked with TypeScript, a trait may initially resemble an interface.

For example, a TypeScript interface:

```typescript
interface Loggable {
  log(): void;
}
```

Rust traits serve a related purpose, but they are integrated more deeply into Rust's type system.

Traits can define:

- Required methods
- Default method implementations
- Associated types
- Generic constraints
- Behavior used by generic functions

### Generic functions and trait bounds

Consider:

```rust
fn print_value<T: std::fmt::Display>(value: T) {
    println!("{}", value);
}
```

The function accepts any type that implements the `Display` trait.

The `T` is a generic type parameter.

The constraint `T: Display` means that the type must support formatting through the `Display` interface.

You can call it with different types:

```rust
fn main() {
    print_value(100);
    print_value("Hello");
    print_value(19.99);
}
```

The compiler generates appropriate implementations for the concrete types used in generic code through monomorphization in the usual statically dispatched case.

This allows reusable code without necessarily introducing dynamic dispatch overhead.

### Why traits matter in backend development

Backend frameworks use traits extensively.

You will encounter traits when working with:

- Serialization
- Error handling
- Database models
- HTTP responses
- Middleware
- Async functions
- Shared application state

For example, the `Serialize` and `Deserialize` traits from Serde allow Rust structures to be converted to and from JSON.

```rust
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct User {
    id: i32,
    username: String,
}
```

The `derive` attribute asks the compiler to generate the appropriate trait implementations.

This allows the struct to be serialized and deserialized without manually implementing the behavior.

## 11. Modules and Project Organization

As applications grow, keeping all code inside `main.rs` becomes difficult.

Rust provides a module system to organize application code.

Consider this structure:

```text
src/
├── main.rs
├── config.rs
├── db.rs
├── models/
│   ├── mod.rs
│   └── user.rs
└── services/
    ├── mod.rs
    └── user_service.rs
```

Each module has its own responsibility.

### Declaring modules

A module can be declared in `main.rs`:

```rust
mod config;
mod db;
mod models;
mod services;

fn main() {
    println!("Application started");
}
```

Rust looks for the corresponding source files or module directories.

### Using `pub`

Items in Rust modules are private by default.

To make a function or struct accessible outside its module, use `pub`.

For example, in `config.rs`:

```rust
pub fn load_config() {
    println!("Loading configuration");
}
```

Then in `main.rs`:

```rust
mod config;

fn main() {
    config::load_config();
}
```

Without `pub`, the function would not be accessible from outside its module.

### Using `use`

The `use` keyword brings a path into scope.

```rust
mod config;

use config::load_config;

fn main() {
    load_config();
}
```

This avoids repeatedly writing the full module path.

### Nested modules

For example, `models/user.rs` could contain:

```rust
pub struct User {
    pub id: i32,
    pub username: String,
}
```

The parent module can expose the user module:

```rust
// models/mod.rs

pub mod user;
```

Then the application can access the type:

```rust
use models::user::User;
```

Rust's module system controls both code organization and visibility.

This becomes especially important when separating controllers, routes, middleware, models, and services in a web backend.

## 12. Cargo Dependencies and External Crates

Rust has an ecosystem of reusable libraries called crates.

A crate is a compilation unit and can be a library or an executable package.

Cargo manages these dependencies through `Cargo.toml`.

For example:

```toml
[dependencies]
serde = { version = "1", features = ["derive"] }
serde_json = "1"
tokio = { version = "1", features = ["full"] }
```

Cargo resolves and downloads the dependencies.

The `Cargo.lock` file records the resolved dependency versions so that subsequent builds use a consistent dependency resolution.

For applications, this file is normally committed to version control.

### Importing dependencies

Once a dependency is declared, its functionality can be imported:

```rust
use serde::{Deserialize, Serialize};
```

For example, JSON serialization:

```rust
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct User {
    id: i32,
    username: String,
}

fn main() {
    let user = User {
        id: 1,
        username: String::from("ozan"),
    };

    let json = serde_json::to_string(&user).unwrap();

    println!("{}", json);
}
```

Output:

```json
{ "id": 1, "username": "ozan" }
```

The example uses `unwrap()` to keep the demonstration short. A production application should handle serialization errors appropriately.

## 13. How Rust Compilation Works

Understanding compilation is important because Rust applications do not execute directly from source code in the same way that typical Node.js applications do.

The Rust compiler is called `rustc`.

Cargo manages the compilation process and invokes the compiler when necessary.

A simplified compilation process looks like this:

```text
Rust source files
       |
       v
  Cargo build system
       |
       v
   Rust compiler
       |
       v
 Parsing and type checking
       |
       v
 Ownership and borrow checking
       |
       v
   Code generation
       |
       v
 Native machine code
       |
       v
 Executable binary
```

This is a simplified view; the actual compiler pipeline contains additional stages.

### Step 1: Parsing

The compiler reads the source code and checks whether it follows Rust's syntax.

For example:

```rust
fn main() {
    println!("Hello");
}
```

The compiler recognizes:

- A function named `main`
- A function body
- A macro invocation
- A string literal

If the syntax is invalid, compilation fails.

### Step 2: Type checking

Rust verifies that operations use compatible types.

Consider:

```rust
fn main() {
    let age: i32 = "thirty-five";
}
```

This does not compile because a string literal cannot be assigned directly to an `i32`.

The compiler catches the problem before the application runs.

### Step 3: Ownership and borrow checking

The compiler checks ownership rules, borrowing, and reference lifetimes.

For example:

```rust
fn main() {
    let name = String::from("Ozan");

    let another_name = name;

    println!("{}", name);
}
```

The compiler rejects the final line because ownership has moved to `another_name`.

This is a major difference from many other languages: Rust detects certain memory-management problems before execution.

### Step 4: Code generation

After the source code passes the required checks, the compiler generates machine code for the target platform.

Rust commonly uses LLVM as its code-generation backend.

The resulting executable is platform-specific.

A binary compiled for an Apple Silicon Mac is not automatically executable on a Raspberry Pi or a Windows machine.

You need to compile for the appropriate target architecture and operating system.

### Development and release builds

During development:

```bash
cargo build
```

Cargo produces a debug build.

For production:

```bash
cargo build --release
```

The release build enables optimizations.

This is important when comparing application performance. Benchmarking a development build against an optimized Node.js deployment would not provide a fair comparison.

### Cross-compilation

Rust supports cross-compilation, which means building an application for a different target architecture from the machine performing the build.

For example, a developer might compile on an Apple Silicon Mac and target a Linux ARM64 environment.

The target must be installed:

```bash
rustup target add aarch64-unknown-linux-gnu
```

Then:

```bash
cargo build --release --target aarch64-unknown-linux-gnu
```

However, installing the target alone is not always sufficient. The build environment also needs a compatible linker and any required system libraries.

For deployment to a Raspberry Pi, the correct target depends on the Pi's processor, operating system, and userspace architecture.

You should verify the target with:

```bash
uname -m
```

Common architecture names include:

- `aarch64`: 64-bit ARM
- `armv7l`: 32-bit ARM
- `x86_64`: 64-bit x86

Cross-compilation configuration is a separate deployment concern from writing Rust code.

## 14. Async Rust: Understanding Asynchronous Execution

If you come from Node.js, you are probably familiar with asynchronous programming.

For example:

```javascript
async function getUser() {
  const user = await database.findUser(1);

  return user;
}
```

JavaScript uses promises and `async`/`await` to work with asynchronous operations.

Rust also supports asynchronous programming through `async` and `.await`.

However, Rust does not provide a built-in asynchronous runtime.

Instead, asynchronous execution is generally provided by an external runtime such as Tokio.

### An async function

Consider:

```rust
async fn get_user() -> String {
    String::from("Ozan")
}
```

An important detail: calling an async function does not immediately execute its body to completion.

It creates a future representing the computation.

Conceptually:

```rust
let future = get_user();
```

The future needs to be polled by an executor to make progress.

This is why Rust applications use an async runtime.

### What is Tokio?

Tokio is an asynchronous runtime for Rust.

It provides:

- An executor for asynchronous tasks
- Asynchronous networking
- Timers
- Task scheduling
- Synchronization primitives
- Runtime infrastructure

A simple Tokio application:

```rust
#[tokio::main]
async fn main() {
    println!("Hello from Tokio");
}
```

The `#[tokio::main]` attribute is a procedural macro that transforms the entry point into a form that starts a Tokio runtime and executes the asynchronous main function.

This allows the application to use `.await` at the top level of its entry point.

### Awaiting asynchronous operations

Consider:

```rust
async fn get_user() -> String {
    String::from("Ozan")
}

#[tokio::main]
async fn main() {
    let user = get_user().await;

    println!("{}", user);
}
```

The `.await` expression allows the future to make progress until it produces a result.

When a future cannot make progress immediately, it can yield control to the executor, allowing other tasks to run.

This is particularly useful for I/O operations such as:

- Database queries
- HTTP requests
- Network communication
- Reading from asynchronous sockets

### Async does not automatically mean multithreaded

An important distinction:

Asynchronous execution and multithreading are related but different concepts.

An asynchronous runtime can manage many tasks without requiring one operating-system thread per task.

Tokio supports both current-thread and multithreaded runtime configurations.

A task waiting for a database response does not need to block an executor thread while waiting. Other tasks can continue making progress.

This is one reason asynchronous runtimes are useful for backend applications.

### Node.js compared with Tokio

Both Node.js and Tokio support event-driven asynchronous programming, but their implementations differ.

Node.js uses an event loop and its runtime infrastructure to coordinate asynchronous operations.

Tokio provides a scheduler and executor for Rust futures.

In Rust, the developer also has to account for ownership and thread-safety requirements when sharing state between asynchronous tasks.

This brings us to another important concept: `Send` and `Sync`.

## 15. Send and Sync: Thread Safety in Rust

Rust has two important traits related to concurrency:

- `Send`
- `Sync`

They help determine whether values can safely be transferred or shared between threads.

### Send

A type implementing `Send` can be transferred safely between threads.

For example, many common owned types such as `String` and `Vec<T>` implement `Send` when their contained types also satisfy the required constraints.

### Sync

A type implementing `Sync` can be safely shared between threads through references.

More precisely, a type `T` is `Sync` if `&T` is `Send`.

These traits matter when using multithreaded asynchronous runtimes.

For example, Tokio's multithreaded scheduler can execute tasks across worker threads.

If a task needs to move between threads, its future generally needs to satisfy the appropriate `Send` requirement.

### Shared application state

Backend applications often share database connection pools and application configuration.

Rust provides synchronization primitives such as:

- `Arc<T>`
- `Mutex<T>`
- `RwLock<T>`

`Arc` stands for atomic reference counting.

It allows multiple owners to share access to the same allocation.

For example:

```rust
use std::sync::Arc;

struct AppConfig {
    app_name: String,
}

fn main() {
    let config = Arc::new(AppConfig {
        app_name: String::from("Rust API"),
    });

    let another_reference = Arc::clone(&config);

    println!("{}", config.app_name);
    println!("{}", another_reference.app_name);
}
```

Both variables share ownership of the same underlying allocation.

`Arc` manages the reference count safely across threads.

However, `Arc` does not automatically make the contained data mutable or thread-safe. The contained type must satisfy the relevant requirements.

For mutable shared state, you may use a synchronization primitive:

```rust
use std::sync::{Arc, Mutex};

fn main() {
    let counter = Arc::new(Mutex::new(0));

    let another_counter = Arc::clone(&counter);

    {
        let mut value = another_counter.lock().unwrap();

        *value += 1;
    }

    println!("{}", *counter.lock().unwrap());
}
```

A `Mutex` allows only one thread at a time to hold the lock.

In asynchronous applications, Tokio also provides asynchronous synchronization primitives such as `tokio::sync::Mutex`.

An asynchronous mutex is useful when a lock must be held across an `.await` point, although avoiding long-held locks is often a better architectural choice.

### Why this matters in an API

In an Axum application, multiple requests may be handled concurrently.

The application may share:

- A PostgreSQL connection pool
- Configuration
- Application services
- Caches
- Other shared resources

Rust's type system helps ensure that shared state is used safely.

This is not simply a performance feature. It is a correctness mechanism.

## 16. Understanding Macros and Attributes

Rust uses macros to generate or transform code.

You will encounter macros frequently in Rust projects.

For example:

```rust
println!("Hello");
```

`println!` is a macro, not a normal function.

The exclamation mark indicates that it is a macro invocation.

Another common macro is `vec!`:

```rust
let numbers = vec![1, 2, 3];
```

It creates a vector.

### Attributes

Rust also uses attributes, which provide additional information to the compiler or tools.

For example:

```rust
#[derive(Debug, Clone)]
struct User {
    id: i32,
    username: String,
}
```

`derive` generates implementations of the requested traits when the type supports them.

The struct can then be printed for debugging:

```rust
fn main() {
    let user = User {
        id: 1,
        username: String::from("ozan"),
    };

    println!("{:?}", user);
}
```

Another example is:

```rust
#[tokio::main]
async fn main() {
    println!("Application started");
}
```

This attribute transforms the entry point to work with Tokio's runtime.

Macros and attributes are important because they explain why some Rust code appears to do more than its visible syntax suggests.

## 17. Serialization and Deserialization with Serde

Web APIs exchange data using formats such as JSON.

Rust commonly uses Serde for serialization and deserialization.

Serialization converts a Rust value into a representation such as JSON.

Deserialization converts incoming JSON into a Rust data structure.

Consider a user model:

```rust
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct User {
    id: i32,
    username: String,
    email: String,
}
```

The `Serialize` trait allows the struct to be converted into JSON.

The `Deserialize` trait allows JSON to be converted into the struct.

### Serializing a value

```rust
use serde_json;

fn main() {
    let user = User {
        id: 1,
        username: String::from("ozan"),
        email: String::from("ozan@example.com"),
    };

    let json = serde_json::to_string(&user).unwrap();

    println!("{}", json);
}
```

### Deserializing JSON

```rust
fn main() {
    let json = r#"{
        "id": 1,
        "username": "ozan",
        "email": "ozan@example.com"
    }"#;

    let user: User = serde_json::from_str(json).unwrap();

    println!("{}", user.username);
}
```

In real applications, these operations should handle errors instead of relying on `unwrap()`.

### Renaming JSON fields

Sometimes the API's JSON field names do not match the Rust struct's field names.

Serde provides attributes for this.

```rust
use serde::Deserialize;

#[derive(Deserialize)]
struct CreateUserRequest {
    #[serde(rename = "userName")]
    username: String,

    email: String,
}
```

Now this JSON:

```json
{
  "userName": "ozan",
  "email": "ozan@example.com"
}
```

can be deserialized into the Rust struct.

This is particularly useful when migrating an existing API because the external JSON contract can remain unchanged even when the internal Rust implementation uses different naming conventions.

## 18. How These Concepts Fit Together in a Web Backend

At this point, we have covered most of the language concepts needed to understand a basic Rust web backend.

Now let's connect them.

Suppose we want to create an endpoint that returns a user.

The application needs to:

1. Receive an HTTP request.
2. Extract a user ID.
3. Query the database.
4. Convert the result into a response.
5. Return JSON.
6. Handle possible errors.

In a Rust application, different libraries handle these responsibilities.

| Responsibility                | Technology                      |
| ----------------------------- | ------------------------------- |
| HTTP server and routing       | Axum                            |
| Asynchronous runtime          | Tokio                           |
| Database integration          | SQLx                            |
| JSON serialization            | Serde                           |
| Application errors            | Custom error types and `Result` |
| Logging and diagnostics       | tracing                         |
| Middleware and HTTP utilities | Tower and tower-http            |

Let's look at a simplified example of how Rust types support this architecture.

### Defining a user model

```rust
use serde::Serialize;

#[derive(Serialize)]
struct User {
    id: i32,
    username: String,
}
```

This struct represents the user data that will be returned by the API.

`Serialize` allows Axum to convert the value into JSON through its JSON response support.

### Defining an error result

A function that queries the database might fail.

Its return type could be:

```rust
Result<User, sqlx::Error>
```

This means the function returns either:

- A successful `User`
- A database error

For example:

```rust
async fn find_user(id: i32) -> Result<User, sqlx::Error> {
    // Database query would be executed here.
    todo!()
}
```

The `todo!()` macro is a placeholder that panics if executed. It is used here only to illustrate the function signature.

The important part is the return type.

### Understanding the handler

An Axum handler might look like this:

```rust
async fn get_user() -> Json<User> {
    // Return a JSON response.
}
```

The handler is asynchronous because it may perform I/O operations.

It returns JSON using Axum's response types.

A more complete handler would receive application state, extract request parameters, query the database, and convert errors into HTTP responses.

The concepts introduced earlier explain the syntax:

- `async` allows asynchronous execution.
- `Json<T>` represents JSON request or response data.
- `Result<T, E>` represents success or failure.
- `&State` or other references allow data to be borrowed.
- Structs define the application's data.
- Traits provide shared behavior.
- Tokio executes asynchronous tasks.
- SQLx handles database operations.

This is why understanding Rust fundamentals first makes the framework code easier to follow.

## 19. Rust Compiler Errors Are Part of the Development Process

When starting with Rust, one of the biggest adjustments is learning to work with compiler errors.

In JavaScript, some mistakes are only discovered when the relevant code executes.

Rust catches many problems before the program runs.

For example, consider:

```rust
fn main() {
    let number = 10;

    number = 20;
}
```

The compiler explains that `number` is immutable.

The fix is:

```rust
fn main() {
    let mut number = 10;

    number = 20;
}
```

Another example:

```rust
fn main() {
    let name = String::from("Ozan");

    let another_name = name;

    println!("{}", name);
}
```

The compiler explains that the value was moved.

The solution might be to borrow it instead:

```rust
fn print_name(name: &str) {
    println!("{}", name);
}

fn main() {
    let name = String::from("Ozan");

    print_name(&name);

    println!("{}", name);
}
```

Or clone it if independent ownership is genuinely required:

```rust
let another_name = name.clone();
```

The important point is not to treat compiler errors as obstacles to work around.

They are feedback about how the language's type and memory-safety rules apply to your code.

### Useful development commands

Run the following regularly:

```bash
cargo check
```

This is useful for quickly checking whether the project compiles.

```bash
cargo fmt
```

This formats the source code.

```bash
cargo clippy
```

This identifies additional issues and suggests improvements.

```bash
cargo test
```

This executes the project's tests.

A good development workflow uses these tools continuously rather than waiting until the application is complete.

## 20. A Practical Learning Example

Let's combine several concepts into a small program.

We will create a user structure, define a function that accepts a reference, and return an optional user.

```rust
#[derive(Debug)]
struct User {
    id: i32,
    username: String,
    active: bool,
}

fn find_user(id: i32) -> Option<User> {
    if id == 1 {
        Some(User {
            id: 1,
            username: String::from("ozan"),
            active: true,
        })
    } else {
        None
    }
}

fn print_user(user: &User) {
    println!("ID: {}", user.id);
    println!("Username: {}", user.username);
    println!("Active: {}", user.active);
}

fn main() {
    let user = find_user(1);

    match user {
        Some(user) => {
            print_user(&user);
        }
        None => {
            println!("User not found");
        }
    }
}
```

Let's identify the Rust concepts used here.

| Code                 | Concept                        |
| -------------------- | ------------------------------ |
| `struct User`        | Custom data structure          |
| `#[derive(Debug)]`   | Generated trait implementation |
| `fn find_user`       | Function declaration           |
| `Option<User>`       | Optional return value          |
| `Some(User { ... })` | Existing value                 |
| `None`               | Missing value                  |
| `match`              | Pattern matching               |
| `&User`              | Immutable reference            |
| `String::from()`     | Owned string allocation        |
| `main()`             | Application entry point        |

This small example already demonstrates several important differences from JavaScript.

The return type explicitly describes the possibility of a missing user.

The function that prints the user borrows it rather than taking ownership.

The compiler verifies the types and borrowing rules before generating the executable.

These concepts appear repeatedly in real Rust applications.

## 21. What You Should Understand Before Moving to Axum

You do not need to master the entire Rust language before building a backend.

However, some concepts are particularly important.

| Concept                    | Why it matters in backend development       |
| -------------------------- | ------------------------------------------- |
| `let` and `mut`            | Understanding variable mutability           |
| Functions and return types | Understanding handlers and services         |
| Structs                    | Representing application and database data  |
| Enums                      | Representing states and errors              |
| Ownership                  | Understanding how values are transferred    |
| Borrowing                  | Passing data without transferring ownership |
| Lifetimes                  | Understanding references and their validity |
| `Option`                   | Handling missing values                     |
| `Result`                   | Handling recoverable errors                 |
| Traits                     | Understanding framework abstractions        |
| Modules                    | Organizing backend architecture             |
| Cargo                      | Managing dependencies and builds            |
| Async and `.await`         | Understanding asynchronous operations       |
| Tokio                      | Understanding runtime execution             |
| `Send` and `Sync`          | Understanding thread-safe application state |
| Serde                      | Handling JSON request and response data     |

The most important concepts to become comfortable with are ownership, borrowing, `Result`, structs, and asynchronous execution.

You will encounter these constantly when developing with Axum and SQLx.

## Conclusion

Rust is not simply another language with different syntax.

Its design changes how developers think about memory, data ownership, error handling, and concurrent execution.

The most significant difference is that Rust moves many correctness checks into compilation.

Instead of relying entirely on runtime behavior, developers work with a type system that verifies ownership, borrowing, and other constraints before producing the executable.

This requires an adjustment when coming from languages such as JavaScript, but it also provides strong guarantees when developing complex applications.

For backend development, the most important takeaway is understanding how the language's fundamentals connect to the framework and runtime:

- Structs represent application data.
- Traits define shared behavior.
- Ownership and borrowing control how data is accessed.
- `Option` and `Result` represent missing values and failures.
- Tokio executes asynchronous tasks.
- Axum handles HTTP requests and responses.
- SQLx connects the application to the database.
- Cargo manages dependencies and compilation.

With these fundamentals in place, the next step is applying them to a real application.

In **Part 1**, we will build a Rust web backend using Axum, Tokio, and SQLx, gradually introducing the project structure, shared application state, PostgreSQL integration, error handling, routing, middleware, and API testing.
