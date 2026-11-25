---
title: Building a Rust Web Backend with Axum, SQLx, and Tokio (Part 1)
slug: building-rust-web-backend-axum-sqlx-tokio
description: >-
  This article documents the first phase of migrating a Node.js/Express backend to Rust using Axum, SQLx, and Tokio.
  It covers modular project architecture, PostgreSQL integration, shared application state, error handling, routing, middleware, CORS configuration, and API testing using E2E tests and curl.
imageUrl: /images/2.webp
author: o. ocak
date: 15.11.2026
tags:
  - Rust
  - Axum
  - Tokio
  - SQLx
  - PostgreSQL
  - Backend Development
  - API Development
published: true
---

_A practical walkthrough of migrating a Node.js/Express backend to Rust using Axum, SQLx, and Tokio — documenting the architecture, implementation decisions, and lessons learned along the way._

## Introduction

After working with Node.js and Express for backend development, I started migrating an existing backend to Rust.

The goal wasn't simply to rewrite the same application in another language. I wanted to understand Rust's ecosystem, build a modular backend, and explore how its approach to memory safety, concurrency, and error handling translates into real-world web development.

This article documents the first phase of that migration.

The implementation is incremental. Rather than rewriting the entire backend at once, I separated the work into smaller stages, implementing and testing each part before moving forward.

This first installment covers:

- Rust project structure and modular architecture.
- Axum and Tokio.
- PostgreSQL integration using SQLx.
- Shared application state.
- Error handling.
- Controllers and route organization.
- CORS and security headers.
- Environment configuration.
- API testing using E2E tests and curl.

Authentication, authorization, RBAC, OAuth, and other advanced functionality will be covered in subsequent installments.

---

## Why Rust for a Web Backend?

Rust offers several advantages for backend development:

- **Memory safety:** Memory safety without relying on a garbage collector.
- **Concurrency:** Strong compile-time guarantees help prevent data races.
- **Performance:** Efficient native compilation and predictable resource management.
- **Deployment:** The application can be compiled into a standalone executable without requiring a Node.js runtime or `node_modules`.
- **Type safety:** Strong typing throughout the application, including database interactions when using SQLx's compile-time checked query macros.

There are trade-offs, of course.

Rust has a steeper learning curve than Node.js, and development can require more explicit type definitions and error handling.

However, coming from an existing Node.js background, I found that understanding the architectural concepts transferred relatively well. The main adjustment was learning how Rust expresses those concepts.

## The Stack

The backend uses the following technologies:

| Concern             | Rust technology    | Node.js equivalent |
| ------------------- | ------------------ | ------------------ |
| HTTP server         | Axum               | Express            |
| Async runtime       | Tokio              | Node.js event loop |
| Database            | SQLx / PostgreSQL  | pg / Drizzle       |
| JSON serialization  | Serde / serde_json | JSON.stringify     |
| Middleware          | Tower / tower-http | Express middleware |
| Environment loading | dotenvy            | dotenv             |
| Logging             | tracing            | Winston / console  |

### Dependencies

The main dependencies in `Cargo.toml`:

```toml
[dependencies]
axum = "0.8"
tokio = { version = "1", features = ["full"] }
tower = "0.5"
tower-http = { version = "0.6", features = ["cors", "set-header", "trace"] }
dotenvy = "0.15"
sqlx = { version = "0.8", features = ["runtime-tokio-rustls", "postgres", "chrono", "migrate"] }
tracing = "0.1"
tracing-subscriber = { version = "0.3", features = ["env-filter"] }
anyhow = "1"
serde = { version = "1", features = ["derive"] }
serde_json = "1"
chrono = { version = "0.4", features = ["serde"] }
```

## Project Structure

One of the first decisions was how to organize the application.

Coming from Express, I wanted to maintain a clear separation between application initialization, routing, controllers, middleware, configuration, and database access.

The resulting structure:

```text
backend/
└── src/
    ├── main.rs
    ├── app.rs
    ├── config.rs
    ├── db.rs
    ├── env.rs
    ├── error.rs
    ├── logging.rs
    ├── state.rs
    │
    ├── middleware/
    │   ├── mod.rs
    │   ├── cors.rs
    │   └── security.rs
    │
    ├── controllers/
    │   ├── mod.rs
    │   └── feature_controllers/
    │       ├── likes/
    │       ├── comments/
    │       ├── user/
    │       ├── admin/
    │       └── visitor_count/
    │
    └── routes/
        ├── mod.rs
        ├── likes.rs
        ├── comments.rs
        ├── user.rs
        ├── admin.rs
        └── visitor_count.rs
```

The main principle is separation of responsibilities.

- `main.rs`: Application entry point and initialization.
- `app.rs`: Builds and configures the Axum Router.
- `config.rs`: Application configuration.
- `db.rs`: PostgreSQL connection and pool initialization.
- `state.rs`: Shared application resources.
- `middleware/`: Middleware implementations.
- `controllers/`: Request handlers and endpoint logic.
- `routes/`: HTTP method and path definitions.
- `error.rs`: Centralized API error handling.

**The idea is simple: `main.rs` wires the application, routes define the endpoints, and controllers handle the request logic.**

This keeps the application organized as more endpoints and functionality are introduced.

## Application Initialization: main.rs

The entry point is intentionally kept small.

```rust
mod app;
mod config;
mod controllers;
mod db;
mod env;
mod error;
mod logging;
mod middleware;
mod routes;
mod state;

use anyhow::Result;
use state::AppState;
use std::sync::Arc;

#[tokio::main]
async fn main() -> Result<()> {
    env::load();
    logging::init();

    let config = Arc::new(config::Config::from_env()?);

    let pool = db::connect(
        &config.database_url()
    ).await?;

    let state = AppState {
        db: pool,
        config: config.clone(),
    };

    let router = app::build(state, &config);

    let addr = std::net::SocketAddr::from(
        ([0, 0, 0, 0], config.port)
    );

    let listener = tokio::net::TcpListener::bind(addr).await?;

    println!(
        "Server is running on http://localhost:{}",
        config.port
    );

    axum::serve(listener, router).await?;

    Ok(())
}
```

A few things happen here:

1. Environment variables are loaded.
2. Logging is initialized.
3. Configuration is constructed.
4. The PostgreSQL connection pool is initialized.
5. Shared application state is created.
6. The application Router is built.
7. The TCP listener starts accepting connections.

Unlike a typical Express entry point, the route definitions and middleware configuration are not mixed into this file.

The result is an initialization flow that is easy to follow.

## Configuration and Shared State

### config.rs

The configuration module reads environment variables and converts them into typed Rust values.

```rust
#[derive(Debug, Clone)]
pub struct Config {
    pub port: u16,
    pub db_host: String,
    pub db_port: u16,
    pub db_username: String,
    pub db_password: String,
    pub db_name: String,
    pub allowed_origins: Vec<String>,
}

impl Config {
    pub fn from_env() -> anyhow::Result<Self> {
        Ok(Self {
            port: std::env::var("PORT")
                .unwrap_or_else(|_| "3000".into())
                .parse()?,

            db_host: std::env::var("DB_HOST")
                .unwrap_or_else(|_| "localhost".into()),

            db_port: std::env::var("DB_PORT")
                .unwrap_or_else(|_| "5432".into())
                .parse()?,

            db_username: std::env::var("DB_USERNAME")
                .unwrap_or_else(|_| "postgres".into()),

            db_password: std::env::var("DB_PASSWORD")
                .unwrap_or_else(|_| "postgres".into()),

            db_name: std::env::var("DB_NAME")
                .unwrap_or_else(|_| "database".into()),

            allowed_origins: std::env::var("ALLOWED_ORIGINS")
                .unwrap_or_default()
                .split(',')
                .map(|s| s.trim().to_string())
                .filter(|s| !s.is_empty())
                .collect(),
        })
    }

    pub fn database_url(&self) -> String {
        format!(
            "postgres://{}:{}@{}:{}/{}",
            self.db_username,
            self.db_password,
            self.db_host,
            self.db_port,
            self.db_name
        )
    }
}
```

Instead of accessing environment variables throughout the application, configuration is loaded once and shared where needed.

### state.rs

Axum provides a shared application state mechanism through `State`.

```rust
#[derive(Clone)]
pub struct AppState {
    pub db: sqlx::PgPool,
    pub config: std::sync::Arc<crate::config::Config>,
}
```

The `AppState` structure contains resources required by request handlers.

An important detail is that `PgPool` is designed to be cheaply cloned. It internally shares its connection pool rather than creating an entirely new pool for each request.

Similarly, `Arc<Config>` provides shared ownership of application configuration.

This allows handlers to access common resources without manually passing them through every function.

## PostgreSQL Connection

The database connection is managed in a dedicated module.

### db.rs

```rust
use anyhow::{Context, Result};
use sqlx::postgres::PgPoolOptions;
use sqlx::PgPool;

pub async fn connect(database_url: &str) -> Result<PgPool> {
    let pool = PgPoolOptions::new()
        .max_connections(10)
        .connect(database_url)
        .await
        .context("failed to create Postgres pool")?;

    sqlx::query("SELECT 1")
        .execute(&pool)
        .await
        .context("Postgres ping failed")?;

    println!("Connected to PostgreSQL database.");

    Ok(pool)
}
```

The connection pool is initialized before the HTTP server starts.

This follows the same general approach as initializing a PostgreSQL pool before calling `app.listen()` in Express.

A few details:

- `PgPoolOptions` configures the connection pool.
- `max_connections(10)` limits the number of simultaneous database connections.
- `.connect()` establishes the pool.
- `SELECT 1` verifies database connectivity.
- `Context` adds useful information to initialization errors.

Using a pool avoids establishing a new database connection for every request.

## Centralized Error Handling

Rust uses `Result<T, E>` to represent operations that can succeed or fail.

In Axum, handlers can return a `Result` where the error type implements `IntoResponse`.

This provides an opportunity to centralize API error responses.

### error.rs

```rust
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::Json;
use serde_json::json;

#[derive(Debug)]
pub enum ApiError {
    NotFound(String),
    BadRequest(String),
    Internal(String),
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let (status, message) = match self {
            ApiError::NotFound(message) => (
                StatusCode::NOT_FOUND,
                message,
            ),

            ApiError::BadRequest(message) => (
                StatusCode::BAD_REQUEST,
                message,
            ),

            ApiError::Internal(_) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Internal server error".to_string(),
            ),
        };

        (status, Json(json!({
            "message": message
        }))).into_response()
    }
}

impl From<sqlx::Error> for ApiError {
    fn from(error: sqlx::Error) -> Self {
        // In a production implementation, log the
        // underlying error using tracing.
        tracing::error!(
            error = %error,
            "Database operation failed"
        );

        ApiError::Internal(error.to_string())
    }
}
```

The important part is the implementation of `IntoResponse`.

Instead of manually constructing HTTP responses in every controller, the error type determines the appropriate response.

For example:

```rust
sqlx::query("SELECT ...")
    .execute(&state.db)
    .await?;
```

The `?` operator propagates the error.

If SQLx returns an error, the `From<sqlx::Error>` implementation converts it into `ApiError`.

The client receives a consistent response without exposing internal database details.

**Why avoid unwrap()?**

`unwrap()` panics when a `Result` contains an error.

For expected operational failures, such as database connection errors or missing records, returning a proper error is preferable.

Rust's error handling encourages explicitly handling failure paths rather than relying on exceptions or uncontrolled panics.

## Building the First Route

With the application structure in place, the next step is defining routes.

### routes/mod.rs

```rust
use axum::{
    routing::get,
    Json,
    Router,
};

use serde_json::{json, Value};
use crate::state::AppState;

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/api/hello", get(hello))
}

async fn hello() -> Json<Value> {
    Json(json!({
        "message": "Hello, World!"
    }))
}
```

A few important concepts:

**Router<AppState>**

This indicates that the Router expects application state of type `AppState`.

**Method routing**

Axum uses functions such as `get`, `post`, `patch`, and `delete` to associate HTTP methods with handlers.

**JSON responses**

Returning `Json<Value>` automatically serializes the value and sets the appropriate content type.

### app.rs

The application module combines the routes, middleware, and shared state.

```rust
pub fn build(
    state: AppState,
    config: &Arc<Config>,
) -> Router {
    let cors = middleware::cors::build(
        &config.allowed_origins
    );

    routes::router()
        .layer(cors)
        .with_state(state)
}
```

Calling `with_state(state)` supplies the required application state and produces a Router ready for serving.

## Controllers: Separating Request Logic

As the application grows, I wanted to avoid putting every handler inside the route definitions.

For example, the likes functionality has its own controller directory:

```text
controllers/
└── feature_controllers/
    └── likes/
        ├── mod.rs
        ├── get_likes.rs
        ├── like.rs
        └── unlike.rs
```

Each file handles a specific operation.

### get_likes.rs

```rust
use axum::extract::{Path, State};
use axum::Json;

use serde_json::{json, Value};

use crate::error::ApiError;
use crate::state::AppState;

pub async fn get_like_blog(
    State(state): State<AppState>,
    Path(post_id): Path<String>,
) -> Result<Json<Value>, ApiError> {

    if post_id.is_empty() {
        return Err(ApiError::BadRequest(
            "Post ID is required".into()
        ));
    }

    let row: Option<(i32,)> =
        sqlx::query_as(
            "SELECT likes_count FROM likes WHERE slug = $1"
        )
        .bind(&post_id)
        .fetch_optional(&state.db)
        .await?;

    match row {
        Some((count,)) => {
            Ok(Json(json!({
                "likes": count
            })))
        }

        None => Err(ApiError::NotFound(
            "Post not found".into()
        )),
    }
}
```

There are a few important Rust concepts here.

**Extractors**

`State<AppState>` and `Path<String>` extract information from the incoming request.

Axum uses extractors to provide typed access to request data.

**SQL parameters**

PostgreSQL uses `$1`, `$2`, and so on for positional query parameters.

The `.bind()` method supplies the corresponding values.

This avoids manually constructing SQL strings using user input.

**fetch_optional()**

This returns an `Option<T>`:

- `Some(value)` when a matching row exists.
- `None` when no row is found.

This makes handling missing records explicit.

### like.rs

The like operation increments the count in PostgreSQL.

```rust
pub async fn like_blog(
    State(state): State<AppState>,
    Path(post_id): Path<String>,
) -> Result<(StatusCode, Json<Value>), ApiError> {

    sqlx::query(
        "UPDATE likes
         SET likes_count = likes_count + 1
         WHERE slug = $1"
    )
    .bind(&post_id)
    .execute(&state.db)
    .await?;

    Ok((
        StatusCode::CREATED,
        Json(json!({
            "message": "Post liked successfully"
        }))
    ))
}
```

The return type allows the handler to specify both the HTTP status code and JSON response.

`execute()` also returns a query result containing `rows_affected()`, which can be used to determine whether the update actually modified a record.

## Route Files: Keeping Routing Separate

Controllers contain request logic. Route files define how those controllers are exposed over HTTP.

### routes/likes.rs

```rust
use axum::routing::{get, post};
use axum::Router;

use crate::controllers::feature_controllers::likes::{
    get_likes,
    like,
    unlike,
};

use crate::state::AppState;

pub fn router() -> Router<AppState> {
    Router::new()
        .route(
            "/api/blogpost/{post_id}/bloglikes",
            get(get_likes::get_like_blog)
        )
        .route(
            "/api/blogpost/{post_id}/likeblog",
            post(like::like_blog)
        )
        .route(
            "/api/blogpost/{post_id}/unlikeblog",
            post(unlike::unlike_blog)
        )
}
```

One difference from Express is the path parameter syntax.

Express:

```javascript
/blogpost/:postId
```

Axum 0.8:

```rust
/blogpost/{post_id}
```

### routes/mod.rs

The individual route modules are combined into one Router.

```rust
pub mod admin;
pub mod comments;
pub mod likes;
pub mod user;
pub mod visitor_count;

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/api/hello", get(hello))
        .merge(likes::router())
        .merge(comments::router())
        .merge(user::router())
        .merge(admin::router())
        .merge(visitor_count::router())
}
```

The `.merge()` method combines routers that share the same state type.

This keeps the main route configuration relatively small.

When adding a new feature, the typical changes are:

1. Add the controller.
2. Add the route module.
3. Register the module in `routes/mod.rs`.

## Handling JSON Request Bodies

For POST and PATCH requests, Axum provides the `Json<T>` extractor.

Serde's `Deserialize` derive macro converts incoming JSON into Rust structures.

For example:

```rust
use serde::Deserialize;

#[derive(Deserialize)]
pub struct CreateCommentBody {
    pub content: String,
    pub user_id: i32,
}
```

The handler:

```rust
pub async fn create_comment(
    State(state): State<AppState>,
    Path(post_id): Path<String>,
    Json(body): Json<CreateCommentBody>,
) -> Result<(StatusCode, Json<Value>), ApiError> {

    let row = sqlx::query(
        "INSERT INTO comments
         (content, user_id, blog_id, like_count)
         VALUES ($1, $2, $3, 0)
         RETURNING id, content, user_id,
                   blog_id, like_count, created_at"
    )
    .bind(&body.content)
    .bind(body.user_id)
    .bind(&post_id)
    .fetch_one(&state.db)
    .await?;

    // Serialize the returned row and build the response.
}
```

### Serde field renaming

Rust conventionally uses snake_case for field names, while frontend JSON often uses camelCase.

Serde allows mapping between the two.

```rust
#[derive(Deserialize)]
pub struct UpdateNameBody {
    #[serde(rename = "newName")]
    pub new_name: String,
}
```

The incoming JSON can remain:

```json
{
  "newName": "Updated Name"
}
```

while the Rust field uses `new_name`.

This is useful when maintaining compatibility with an existing frontend.

_Note: In the authenticated version, the user identity should be obtained from the authenticated request context rather than trusted from a client-supplied user ID._

## Working with Dynamic JSON and SQLx Rows

Sometimes a query returns a relatively small number of fields and a dedicated response structure isn't necessary.

SQLx provides the `Row` trait for accessing returned columns.

```rust
use sqlx::Row;

let row = sqlx::query(
    "SELECT id, content, user_id
     FROM comments
     WHERE id = $1"
)
.bind(id)
.fetch_one(&state.db)
.await?;

let json_val = json!({
    "id": row.get::<i32, _>("id"),
    "content": row.get::<String, _>("content"),
    "userId": row.get::<i32, _>("user_id"),
});
```

The generic type supplied to `get()` must match the expected Rust type of the database column.

For example:

| PostgreSQL type | Common Rust type      |
| --------------- | --------------------- |
| INTEGER         | i32                   |
| BIGINT          | i64                   |
| VARCHAR         | String                |
| TIMESTAMP       | chrono::NaiveDateTime |
| Nullable column | Option<T>             |

For more structured responses, defining a Rust struct and using `query_as` is generally preferable.

For compile-time checked queries, SQLx also provides macros such as `query!` and `query_as!`.

## CORS Configuration

The `tower-http` crate provides CORS middleware.

This replaces the typical `cors` npm package used in Express applications.

### middleware/cors.rs

```rust
use axum::http::{
    header,
    HeaderValue,
    Method,
};

use tower_http::cors::CorsLayer;

pub fn build(allowed_origins: &[String]) -> CorsLayer {

    let origins: Vec<HeaderValue> =
        allowed_origins
            .iter()
            .filter_map(|o| o.parse().ok())
            .collect();

    CorsLayer::new()
        .allow_origin(origins)
        .allow_credentials(true)
        .allow_methods([
            Method::GET,
            Method::POST,
            Method::PUT,
            Method::DELETE,
            Method::PATCH,
            Method::HEAD,
        ])
        .allow_headers([
            header::CONTENT_TYPE,
            header::AUTHORIZATION,
            header::ACCEPT,
            header::ORIGIN,
            header::HeaderName::from_static(
                "refresh-token-id"
            ),
        ])
        .expose_headers([
            header::AUTHORIZATION,
            header::HeaderName::from_static(
                "refresh-token-id"
            ),
        ])
}
```

One important CORS consideration is the interaction between credentials and wildcard origins or headers.

When credentials are enabled, the server must use an appropriate explicit origin policy rather than relying on wildcard behavior.

This is particularly important when integrating browser-based authentication.

## Security Headers

Express developers often use Helmet to configure common HTTP security headers.

In this implementation, I used `tower-http` response header layers.

For example:

```rust
use axum::http::{
    header,
    HeaderValue,
};

use tower_http::set_header::SetResponseHeaderLayer;

pub fn x_content_type_options()
    -> SetResponseHeaderLayer<HeaderValue>
{
    SetResponseHeaderLayer::if_not_present(
        header::X_CONTENT_TYPE_OPTIONS,
        HeaderValue::from_static("nosniff"),
    )
}
```

Similar functions can be created for:

- `X-Frame-Options`
- `Referrer-Policy`
- `Strict-Transport-Security`

These can then be composed in `app.rs`.

```rust
use tower::ServiceBuilder;

let security = ServiceBuilder::new()
    .layer(middleware::security::x_content_type_options())
    .layer(middleware::security::x_frame_options())
    .layer(middleware::security::referrer_policy())
    .layer(middleware::security::hsts());

routes::router()
    .layer(security)
    .layer(cors)
    .with_state(state)
```

Using `if_not_present` allows an individual handler to provide its own value without having it overwritten by the default layer.

## Environment Loading

Environment loading is isolated in `env.rs`.

```rust
use dotenvy::from_filename;

pub fn load() {
    let env_file = format!(
        ".env.{}",
        std::env::var("NODE_ENV")
            .unwrap_or_else(|_| "development".into())
    );

    if from_filename(&env_file).is_err() {
        let _ = from_filename(format!("../{env_file}"));
    }
}
```

This supports environment files such as:

```text
.env.development
.env.production
```

The fallback to the parent directory is useful when running Cargo commands from the backend directory while keeping environment files at the project root.

Environment variables already supplied by the process remain the primary configuration source.

## Testing the API

One of the advantages of separating the backend from the frontend is that endpoints can be tested independently.

During this migration, I used E2E testing as well as direct requests through curl.

This provides two complementary approaches:

**E2E testing**

Tests exercise the API through actual HTTP requests, allowing verification of request handling, response status codes, JSON structures, and database interactions.

**curl**

curl is useful for quickly testing individual endpoints and inspecting HTTP responses without involving the frontend.

Examples:

### Health check

```bash
curl -i http://localhost:3000/api/hello
```

### GET request with a path parameter

```bash
curl -i \
  http://localhost:3000/api/blogpost/my-post/bloglikes
```

### POST request

```bash
curl -i -X POST \
  http://localhost:3000/api/blogpost/my-post/likeblog
```

### POST request with JSON

```bash
curl -i -X POST \
  http://localhost:3000/api/posts/my-post/comments \
  -H "Content-Type: application/json" \
  -d '{"content":"Nice post","user_id":7}'
```

### PATCH request

```bash
curl -i -X PATCH \
  http://localhost:3000/api/comments/3 \
  -H "Content-Type: application/json" \
  -d '{"content":"Edited"}'
```

### DELETE request

```bash
curl -i -X DELETE \
  http://localhost:3000/api/comments/3
```

I generally use `-i` to include HTTP response headers in the output.

When debugging request and response behavior, `-v` provides additional connection and HTTP details.

Combining E2E tests with curl makes it easier to identify whether a problem originates in routing, request extraction, database operations, or response handling.

## Debugging Checklist

During implementation, several issues can arise from configuration or database connectivity rather than application logic.

Some examples:

| Symptom                          | Possible cause                                         |
| -------------------------------- | ------------------------------------------------------ |
| `relation "X" does not exist`    | Connected to the wrong database or missing schema      |
| `password authentication failed` | Incorrect database credentials                         |
| `pool timed out while waiting`   | Database unavailable or connection pool exhausted      |
| `404` from a handler             | Record not found                                       |
| Route returns 404 unexpectedly   | Route not registered or incorrect path                 |
| Invalid CORS configuration       | Incorrect origin, credentials, or header configuration |
| `Connection refused`             | Server not running or incorrect port                   |

When debugging, I generally check the terminal running `cargo run` first.

Application logs often provide more useful information than the HTTP response alone.

## Database Migration Decisions

During a backend migration, there are two main options for database organization.

### Option 1: Share the existing database

The Rust application connects to the same PostgreSQL database used by the existing Node.js backend.

Advantages:

- Existing data remains available.
- The frontend can be integrated incrementally.
- Both backends can be compared using the same records.

However, running two backends that write to the same database requires care. Both applications must agree on the database schema and data expectations.

### Option 2: Use a separate database

The Rust application gets its own PostgreSQL database.

Advantages:

- Better isolation.
- Independent schema development.
- Easier testing without affecting existing application data.

The downside is that the schema and any required data must be recreated or migrated.

For an incremental migration, sharing the existing database is a practical approach, provided that both applications remain compatible with the schema.

## What's Next?

This first installment focuses on establishing the Rust backend foundation and migrating the initial API functionality.

There is more to implement.

The next stages will cover:

- Authentication: Signup, login, refresh tokens, logout, and email verification.
- Authentication middleware.
- Role-based access control (RBAC).
- Rate limiting.
- OAuth and PKCE.
- OTP password reset.
- Additional testing and deployment considerations.

These features will be introduced incrementally rather than adding everything to the initial implementation.

## Key Takeaways

A few things stood out during this first phase of the migration.

**1. Modular architecture matters.**

Separating routing, controllers, middleware, configuration, and application state makes the backend easier to maintain.

**2. Rust's error handling is explicit.**

`Result<T, E>`, `?`, and `IntoResponse` provide a structured way to handle errors and maintain consistent API responses.

**3. Axum extractors simplify request handling.**

`State`, `Path`, `Query`, and `Json` provide typed access to request information.

**4. SQLx provides a strong database integration layer.**

It supports asynchronous PostgreSQL operations, connection pooling, parameter binding, and compile-time checked query macros.

**5. Testing should happen throughout the migration.**

Using E2E tests and curl makes it possible to verify functionality without depending on the frontend.

**6. Incremental migration reduces complexity.**

Building the backend in smaller, independently testable stages makes it easier to identify problems and understand each part of the system.

**7. Matching the existing API contract matters.**

When replacing an existing backend, HTTP methods, status codes, response structures, and field names must remain compatible with the frontend unless changes are intentional.

---

_This article documents the first stage of migrating an existing Node.js/Express backend to Rust. Subsequent articles will cover authentication, middleware, authorization, and additional backend functionality as the implementation evolves._
