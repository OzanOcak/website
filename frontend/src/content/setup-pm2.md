---
title: Setting Up PM2 for a Node.js Application
slug: setup-pm2
description: Setting Up and Using sqlx with SQLite in Tauri Rust
imageUrl: /images/3.png
author: o. ocak
date: 15.03.2025
tags:
  - Node
published: true
---

# How to Set Up PM2 for a Node.js Application on a Raspberry Pi

If you’re running a Node.js application on a Raspberry Pi, you’ll want to ensure it stays running even after you close your SSH session or if the server crashes. PM2 is a powerful process manager for Node.js that can help you achieve this. In this guide, I’ll walk you through the steps to set up PM2 for your Node.js application, including how to automate restarts, manage logs, and start your application on boot.

## What is PM2?

- PM2 is a production-grade process manager for Node.js applications. It allows you to:

- Keep your application running forever (auto-restart if it crashes).

- Manage logs and monitor resource usage.

- Start your application automatically on system boot.

- Scale your application across multiple CPU cores.

## Install PM2

First, install PM2 globally on your Raspberry Pi using npm:

```bash
sudo npm install -g pm2
```

## Start Your Application with PM2

Instead of running your application manually (e.g., npm run start-prod), use PM2 to start and manage it. Here’s how:

#### Option 1: Start Directly with PM2

If your application’s entry point is dist/server.js, run:

```bash
pm2 start dist/server.js --name "backend"
```

#### Option 2: Use an Ecosystem File (Recommended)

For better management, create an ecosystem.config.js file in your project directory:

```javascript
module.exports = {
  apps: [
    {
      name: "backend", // Name of your application
      script: "dist/server.js", // Entry point of your app
      env: {
        NODE_ENV: "production", // Environment variables
      },
    },
  ],
};
```

Then start your application with:

```bash
pm2 start ecosystem.config.js
```

## Manage Your Application

Once your application is running, you can use the following PM2 commands to manage it:

#### List All Processes

View all processes managed by PM2:

```bash
pm2 list
```

#### Stop a Process

Stop your application:

```bash
pm2 stop backend
```

#### Restart a Process

Restart your application:

```bash
pm2 restart backend
```

#### Delete a Process

Remove your application from PM2:

```bash
pm2 delete backend
```

#### Monitor Logs

View logs for your application:

```bash
pm2 logs backend
```

#### Monitor Resource Usage

Monitor CPU and memory usage:

```bash
pm2 monit
```

## Save and Automate PM2 on Boot

To ensure your application starts automatically when your Raspberry Pi reboots, follow these steps:

#### Save the Current Process List

Save the list of processes managed by PM2:

```bash
pm2 save
```

#### Set Up PM2 to Start on Boot

Generate a startup script:

```bash
pm2 startup
```

Follow the instructions provided by PM2 to enable the startup script.

## Clean Up Old Processes

If you’ve previously started your application with PM2 using a different method (e.g., npm run start-prod), you should clean up those old processes to avoid conflicts:

#### Stop and Delete Old Processes

Stop and delete the old process:

```bash
pm2 stop backend
```

#### pm2 delete backend

#### Start Fresh with the Ecosystem File

Use the ecosystem.config.js file to start your application:

```bash
pm2 start ecosystem.config.js
```

## Common Issues and Troubleshooting

#### 1. Application Crashes Immediately

If your application stops immediately after starting, check the logs for errors:

```bash
pm2 logs backend
```

Common causes include:

Missing environment variables.

Port conflicts (e.g., another process is using the same port).

Missing dependencies (run npm install to ensure all dependencies are installed).

#### 2. node: bad option: --env Error

This error occurs when PM2 tries to pass the --env flag to Node.js. To fix it:

Use an ecosystem file to manage environment variables.

Avoid running PM2 commands through npm run.

## Conclusion

PM2 is an essential tool for running Node.js applications in production. By following this guide, you can ensure your application stays running, even after a crash or system reboot. Whether you’re running a small project on a Raspberry Pi or scaling a large application, PM2 makes process management simple and reliable.

| Command                                     | Description                                     |
| ------------------------------------------- | ----------------------------------------------- |
| `sudo npm install -g pm2`                   | Install PM2 globally.                           |
| `pm2 start dist/server.js --name "backend"` | Start your application directly.                |
| `pm2 start ecosystem.config.js`             | Start your application using an ecosystem file. |
| `pm2 list`                                  | List all processes managed by PM2.              |
| `pm2 stop backend`                          | Stop your application.                          |
| `pm2 restart backend`                       | Restart your application.                       |
| `pm2 delete backend`                        | Delete your application from PM2.               |
| `pm2 logs backend`                          | View logs for your application.                 |
| `pm2 monit`                                 | Monitor CPU and memory usage.                   |
| `pm2 save`                                  | Save the current process list.                  |
| `pm2 startup`                               | Set up PM2 to start on boot.                    |
