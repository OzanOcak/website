---
title: Building a JSON-RPC API with TypeScript and Express
slug: building-json-rpc
description: Understanding JSON-RPC
imageUrl: /images/6.png
author: ozan
date: 13.11.2024
tags:
  - typescript
  - express
  - api
  - trpc
published: true
---

In this tutorial, we'll create a simple JSON-RPC API using TypeScript and Express, leveraging the typed-rpc library for easy RPC handling. We will also create a client to interact with our API. By the end, you'll have a fully functional API that can respond to requests.

# Prerequisites

Node.js installed on your machine (version 16 or higher).
Basic knowledge of TypeScript and JavaScript.
Step 1: Set Up Your Project
Create a new directory for your project and navigate into it:

```bash
mkdir typed-rpc-api
cd typed-rpc-api
```

Initialize a new Node.js project:

```bash
npm init -y
```

Install the required packages:

```bash
npm install express typed-rpc
npm install --save-dev typescript @types/node @types/express ts-node
```

Create a TypeScript configuration file named tsconfig.json:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "Node16",
    "moduleResolution": "Node16",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "noEmit": true,
    "allowImportingTsExtensions": true
  },
  "include": ["src/**/*"]
}
```

## Implement the API

Create the API entry point at src/api/index.ts:

```typescript
import express from "express";
import { handleRpc } from "typed-rpc/server";
import { myService } from "./service";

const app = express();

app.use(express.json());
app.post("/api", (req, res, next) => {
  handleRpc(req.body, myService)
    .then((result) => res.json(result))
    .catch(next);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

Define your service in src/api/service.ts:

```typescript
export const myService = {
  greet: async (name: string): Promise<string> => {
    return `Hello, ${name}!`;
  },
};

export type MyService = typeof myService;
```

## Create the Client

Set up the client in src/client/index.ts:

```typescript
import { rpcClient } from "typed-rpc";
import type { MyService } from "../api/service";

const client = rpcClient<MyService>("http://localhost:3000/api");

async function callApi() {
  const result = await client.greet("Ozan");
  console.log(result); // Output: Hello, Ozan!
}

callApi();
```

## Add Scripts to package.json

Update your package.json to include a start script:

```json
"scripts": {
  "start": "ts-node src/api/index.ts"
}
```

## Run Your API

Start your server:

```bash
npm run start
```

Test the API using cURL: Open another terminal window and run the following command:

```bash
curl -X POST http://localhost:3000/api -H "Content-Type: application/json" -d '{
  "jsonrpc": "2.0",
  "method": "greet",
  "params": ["Ozan"],
  "id": 1
}'
```

You should receive a response like this:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "Hello, Ozan!"
}
```

# Advanced Usage

## Sending Custom Headers

Clients can send custom headers using a getHeaders function:

```typescript
const client = rpcClient<MyService>({
  url: "/api",
  getHeaders() {
    return { Authorization: auth };
  },
});
```

Tip: The getHeaders function can also be async.

## Aborting Requests

Abort requests by passing the Promise to client.$abort():

```typescript
const client = rpcClient<HelloService>(url);

const res = client.hello("world");
client.$abort(res);
```

## Error Handling

In case of an error, the client throws an RpcError with message, code, and optionally data. Customize errors with RpcHandlerOptions or provide an onError handler for logging.

For internal errors (invalid request, method not found), the error code follows the specs.

## CORS Credentials

Include credentials in cross-origin requests with credentials: 'include'.

## Conclusion

In this tutorial, we successfully set up a JSON-RPC API using TypeScript and Express. We created a simple service that responds to a greeting request and built a client to interact with the API. This setup can serve as a foundation for building more complex applications using RPC communication.
