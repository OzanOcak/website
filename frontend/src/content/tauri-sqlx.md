---
title: Developing FullStack Rust Application with Tauri
slug: functional-component-ref-warning
description: Setting Up and Using sqlx with SQLite in Tauri Rust
imageUrl: /images/2.png
author: o. ocak
date: 18.03.2025
tags:
  - Rust
  - Tauri
published: true
---

# Setting Up and Using sqlx with SQLite in Tauri Rust

In this blog post, we will explore how to set up and use sqlx with SQLite in a Rust project. We will go through the entire process step-by-step, from adding dependencies to creating a database and running migrations. Let's get started!

### Prerequisites

Before we begin, make sure you have the following installed on your machine:

- Rust (with cargo)
- SQLite (if you want to manage your database directly)

## Set Up the Tauri Project

First, let's create a new Tauri project. Open your terminal and run:

```sql
npm create tauri-app@latest
cd projectname
```

## Add Dependencies in Cargo.toml

Next, we need to add the necessary dependencies to our Cargo.toml file. Open Cargo.toml in your favorite text editor and add the following lines:

```toml
[dependencies]

sqlx = { version = "0.7", features = ["runtime-tokio-native-tls", "sqlite"] }
```

These dependencies include axum for web handling, tokio for asynchronous programming, serde for serialization, and sqlx for database interactions with SQLite.

## Update Your Shell Configuration

To easily run Rust binaries, we need to add Cargo's bin directory to our PATH. Open your shell configuration file (like ~/.zshrc or ~/.bashrc) in an editor:

```sql
vim ~/.zshrc
```

### Add the following line to your file:

```sql
export PATH="$HOME/.cargo/bin:$PATH"
```

Save the file and exit the editor.

### Apply the Changes

Run the following command to apply the changes to your current shell session:

```sql
source ~/.zshrc
```

## Install sqlx-cli

Next, we will install the sqlx-cli tool, which helps with database management tasks like migrations. Run:

```bash
cargo install sqlx-cli
```

### Verify the Installation

Check the version of sqlx-cli to ensure it was installed correctly:

```bash
sqlx --version
```

## Create the SQLite Database

Now, let's create a new SQLite database. Run the following command:

```bash
sqlx db create --database-url "sqlite://database.db"
```

This command creates a new SQLite database file named database.db.

## Add a New Migration

To manage our database schema, we need to create a migration file. Run:

```bash
sqlx migrate add -r init
```

This command generates a new migration files in the migrations directory.

## Edit the Migration Files

Open the generated up.sql file and add the following SQL code to create a todos table:

```sql
CREATE TABLE todos (
id INTEGER PRIMARY KEY AUTOINCREMENT,
title TEXT NOT NULL,
completed INTEGER NOT NULL DEFAULT 0
);
```

Next, open the generated down.sql file and add the SQL code to drop the todos table:

```sql
DROP TABLE todos;
```

## Run the Migration

Now that our migration files are ready, we can apply the migration to create the todos table in our SQLite database. Run:

```bash
sqlx migrate run --database-url "sqlite://database.db"
```

## Verify the Migration

To check if the todos table was created successfully, open the SQLite shell:

```bash
sqlite3 database.db
```

## List the Tables

Inside the SQLite shell, you can list the tables:

```sql
.tables
```

## Check the Structure of the todos Table

To see the structure of the todos table, run:

```sql
.schema todos
```

## Insert Sample Data (Optional)

You can insert sample data into the todos table to test it. Run the following commands in the SQLite shell:

```sql
INSERT INTO todos (title, completed) VALUES ('Sample Todo 1', 0);
INSERT INTO todos (title, completed) VALUES ('Sample Todo 2', 1);
```

## Query the Table

To see the inserted data, run:

```sql
SELECT \* FROM todos;
```

## Exit SQLite

Finally, exit the SQLite shell by running:

```sql
.exit
```

## Summary

In this guide, we walked through the complete process of setting up a Rust project with sqlx for SQLite. We covered adding dependencies, configuring the environment, creating and applying migrations, and verifying the database schema.
