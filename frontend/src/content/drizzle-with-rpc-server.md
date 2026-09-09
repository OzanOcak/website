---
title: Setting Up Drizzle on an RPC Server
slug: drizzle-with-rpc-server
description: Learning RPC server with Postgres and drizzle.
imageUrl: /images/2.webp
author: ozan
date: 12.11.2024
tags:
  - Trpc
  - SQL
  - Drizzle
  - Docker
  - PostGres
published: true
---

In this blog post, we will walk through the process of setting up Drizzle ORM on a typed RPC server which we have built previous plog post, using PostgreSQL. We will cover the installation of necessary packages, configuration files, and how to seed the database. Let’s get started!

## Install Required Packages

First, we need to install the necessary dependencies for Drizzle ORM and PostgreSQL. Open your terminal and run the following command:

```bash
npm install drizzle-orm pg dotenv
npm install -D drizzle-kit @types/pg nodemon tsx
```

This command installs Drizzle ORM for database interactions, the PostgreSQL client, and development tools like nodemon for automatic server restarts.

## Set Up the Project Structure

Next, we’ll create a basic project structure. Run the following commands to create the required directories and files:

```bash
mkdir db
touch db/dbConn.ts db/migrate.ts db/schema.ts
```

This creates a db directory where we will store our database connection, migration scripts, and schema definitions.

## Create Configuration Files

We will create three configuration files in the root of the project directory, at the same level as package.json: .env, docker-compose.yaml, and drizzle.config.ts.

Docker Configuration
Here’s an example docker-compose.yaml file to set up a PostgreSQL database:

```yaml
services:
  db:
    container_name: authapp
    image: postgres:16
    environment:
      - POSTGRES_USER=${DB_USERNAME}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=${DB_NAME}
    ports:
      - ${DB_PORT}:5432
    volumes:
      - db-data:/var/lib/postgresql/data
#  adminer:
#    image: adminer
#    restart: always
#    ports:
#      - 8080:8080
volumes:
  db-data:
```

In this configuration, we define a PostgreSQL service with environment variables that will be populated from our .env file. Note that we commented out the Adminer service, as it is not needed for our setup with Drizzle ORM.

## Environment Variables

Next, create a .env file to store environment variables:

```text
DB_HOST=localhost
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=database
DB_PORT=5432
PORT=4000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/database
```

This file contains the configuration for connecting to your PostgreSQL database. Make sure to adjust the values as necessary for your setup.

## Drizzle Configuration

Now, let's set up the Drizzle configuration by creating drizzle.config.ts:

```ts
import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config(); // Load environment variables

export default defineConfig({
  dialect: "postgresql", // "mysql" | "sqlite" | "postgresql"
  schema: "./src/db/schema/index.ts",
  out: "src/drizzle", // drizzle folder should be under src directory
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

This configuration file tells Drizzle ORM how to connect to the database and where to find the schema.

## Update Package Scripts

Next, we’ll add some scripts to our package.json to streamline our development workflow. Here’s how to modify the scripts section:

```json
"scripts": {
  "dev:api": "tsx src/api/index.ts",
  "dev:client": "tsx src/client/index.ts",
  "dev": "nodemon --exec ts-node src/server.ts",
  "seed": "tsx src/db/seed.ts",
  "build": "tsc",
  "db:generate": "npx drizzle-kit generate --config='./drizzle.config.ts'",
  "db:push": "npx ts-node src/db/migrate.ts",
  "migrate": "npx drizzle-kit generate --config='./drizzle.config.ts' && npx ts-node src/db/migrate.ts"
}
```

These scripts allow you to run the API, client, database migrations, and seeding commands easily.

## Database Connection

We start by establishing a connection to our PostgreSQL database using the dbConn.ts file. Here’s how the code looks:

```ts
// db/dbConn.ts
import dotenv from "dotenv";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm";
import { schema } from "./schema";

dotenv.config(); // Load environment variables

// PostgreSQL connection configuration
const pool = new Pool({
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT!),
  user: process.env.DB_USERNAME!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
});

// Initialize the database connection
const db = drizzle(pool, { schema });

// Connection state
let isConnected = false;

// Function to connect the database
export async function connectDatabase() {
  if (!isConnected) {
    try {
      await pool.connect(); // Connect to the database
      isConnected = true; // Update the connection state
      console.log("Connected to PostgreSQL database");
    } catch (err) {
      console.error("Connection error", err);
    }
  } else {
    console.log("Already connected to PostgreSQL database");
  }
}

// Call the connect function
connectDatabase();

// Export the client and db for use in other parts of your application
export { pool, db };
```

In this file:

We load environment variables using dotenv.
We configure a connection pool to PostgreSQL.
We create a Drizzle ORM instance with the database connection and schema.

## Database Migrations

Next, we need to perform database migrations to create the necessary tables. The migrate.ts file will handle this:

```ts
// db/migrate.ts
import { pool } from './dbConn';
import { migrate } from 'drizzle-orm';

const migrateDatabase = async () => {
  const client = await pool.connect(); // Get a client from the pool

  try {
    console.log("Connected to PostgreSQL database for migrations.");

    // Perform the migrations
    await migrate(db, { migrationsFolder: resolve(__dirname, "../drizzle") });
    console.log("Migrations completed successfully.");
  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    client.release(); // Ensure the client is closed
    console.log("PostgreSQL client disconnected.");
    process.exit(0);
};

migrateDatabase();
```

Here, we:

Connect to the database and execute migrations defined in the specified folder.
Ensure the client is released after the operation, preventing resource leaks.

## Defining the Schema

We define our database schema in the schema directory. For example, the category.ts file defines a category table:

```ts
// db/schema/category.ts
import { pgTable, serial, varchar } from "drizzle-orm";

export const category = pgTable("category", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
});
```

This schema represents a simple category table with an auto-incrementing id and a unique name.

## Seeding the Database

Now, let's seed our database with initial data. We have our seed data defined in JSON format:

```json
// db/seeds/data/categories.ts
[
  { "name": "Italy" },
  { "name": "France" },
  { "name": "Poland" },
  { "name": "Germany" },
  { "name": "Holland" },
  { "name": "Spain" },
  { "name": "Norway" }
]
```

Next, we implement the seeding logic in category.ts:

```ts
// db/seeds/category.ts
import { category } from "../schema/category";
import { DB } from "drizzle-orm";

const categories = require("./data/categories.json");

export async function seed(db: DB) {
  await db.insert(category).values(categories);
}
```

Finally, we create a seed.ts file to reset the tables and run the seeding function:

```ts
// db/seed.ts
import { db } from "./dbConn";
import { category } from "./schema/category";
import { seed as categorySeed } from "./seeds/category";

async function resetTable(db: DB, table: Table) {
  return db.execute(sql`truncate table ${table} restart identity cascade`);
}

async function main() {
  for (const table of [category]) {
    await resetTable(db, table);
  }
  await categorySeed(db);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("Seeding done!");
    process.exit(0);
  });
```

This script truncates the existing data and inserts the new seed data.

## Running the Setup

Now that everything is set up, here’s how to run your application:

Start Docker: Spin up your PostgreSQL container:

```bash
docker compose up -d
```

Run the API: Start your API server:

```bash
npm run dev:api
```

Migrate the Database: Apply the migrations:

```bash
npm run migrate
```

Seed the Database: Populate the database with initial data:

```bash
npm run seed
```

Run the Client: Start your client application:

```bash
npm run dev:client
```

Querying the Database
Once your server is running, you can query the database through your RPC API. The API will return a JSON response with the seeded data:

```json
[
  { "id": 1, "name": "Italy" },
  { "id": 2, "name": "France" },
  { "id": 3, "name": "Poland" },
  { "id": 4, "name": "Germany" },
  { "id": 5, "name": "Holland" },
  { "id": 6, "name": "Spain" },
  { "id": 7, "name": "Norway" }
]
```

## Using Drizzle Studio

To visualize your database schema and data, you can use Drizzle Studio by running:

```bash
npx drizzle-kit studio
```

This will provide a user-friendly interface to interact with your database.

## Conclusion

You have successfully set up a typed RPC API connected to a PostgreSQL database using Drizzle ORM. You learned how to configure the database connection, create migrations, seed initial data, and interact with the database via an API. This setup provides a robust foundation for building scalable applications.
