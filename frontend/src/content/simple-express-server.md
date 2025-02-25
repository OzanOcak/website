---
title: "Setting Up a Simple Node.js Express Api and PostgreSql database with Docker"
slug: simple-express-server
description: Comprehensive guide on learning SQL and drizzle.
imageUrl: /images/3.png
author: ozan
date: 23.09.2024
tags:
  - SQL
  - Node
  - Express
  - Docker
published: false
---

In this article, we will walk through the steps to create a simple RESTful API using Node.js with Express, backed by a PostgreSQL database, all running in Docker containers. This setup allows for easy development and deployment, ensuring consistency across environments.

### Step 1: Set Up Your Project

Create a project directory:

```bash
mkdir express-postgres-api
cd express-postgres-api
```

Initialize a Node.js project:

```bash
npm init -y
npm install express pg dotenv
npm i -D nodemon
cat package.json
```

### Step 2: Create the Express Application

1. Create a new file named app.js:

```js
// app.js
const express = require("express");
const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Basic route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Get all items
app.get("/items", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM items");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
```

2. Create a .env file:

In the project root, create a .env file to store your database configuration:

```plaintext
DB_USER=pguser
DB_HOST=db
DB_NAME=pgdb
DB_PASSWORD=pgpassword
DB_PORT=5432
PORT=3000
```

### Step 3: Create Docker Setup

Next, we’ll configure Docker to run our application and database.

1. dockerfile

```dockerfile
FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]
```

2. docker-compose.yml

This file will define the services for both the API and the PostgreSQL database:

```yaml
#version: "3.8"

services:
  db:
    image: postgres:alpine
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DB_USER=${DB_USER}
      - DB_HOST=${DB_HOST}
      - DB_NAME=${DB_NAME}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_PORT=${DB_PORT}
    depends_on:
      - db

volumes:
  pgdata:
```

### Step 4: Create the Database Table

1. Launch the Docker containers:

```bash
docker compose up -d
docker compose down # stopping the containers
docker compose --build # re-building containers after any change is done
```

2. Connect to the PostgreSQL container:

Use the following command to access the PostgreSQL shell:

- docker exec -it {db_container_name} psql -U {user_name} -d {db_name}

```bash
docker exec -it express-postgres-api-db-1 psql -U pguser -d pgdb
```

3. Create the items table and basic queries:

Execute the following SQL commands:

```sql
CREATE TABLE items (
id SERIAL PRIMARY KEY,
name VARCHAR(100) NOT NULL
);

insert into items (1, 'tom');

select * from items;
```

### Step 5: Testing the API

Now, let’s test our API to ensure everything is working as expected. We will use curl.

```bash
docker compose -d up
curl http://localhost:3000
curl http://localhost:3000/items
```

### Conclusion

In this tutorial, we successfully set up a simple RESTful API using Node.js, Express, and PostgreSQL, all running within Docker containers. This setup simplifies the development process and ensures that the application behaves consistently across different environments.
