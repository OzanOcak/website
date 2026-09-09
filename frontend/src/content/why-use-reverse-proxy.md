---
title: Why Use NGINX as a Reverse Proxy?
slug: why-use-reverse-proxy
description: >-
  This blog post explores the benefits of using NGINX as a reverse proxy server.
  It explains what a reverse proxy is and details its advantages.
imageUrl: /images/12.webp
author: o. ocak
date: 06.03.2025
tags:
  - NGINX
  - Api
  - Cybersecurity
published: true
---

# Why Use NGINX as a Reverse Proxy?

## What is a Reverse Proxy?

A reverse proxy sits between clients (e.g., browsers) and your backend server (e.g., your Node.js/Express API). It forwards client requests to the backend and returns the backend’s response to the client.

## Why Use It?

### Security

- **Hides Your Backend Server’s IP Address:** This adds a layer of security by concealing your server's actual location.
- **Protects Against Direct Attacks:** A reverse proxy can mitigate direct attacks on your backend server.

### Load Balancing

- **Distributes Traffic:** If you have multiple backend servers, NGINX can distribute incoming requests evenly, improving response times and reliability.

### SSL/TLS Termination

- **Handles HTTPS Encryption:** NGINX can manage SSL certificates and encryption, offloading this resource-intensive task from your backend.

### Caching

- **Improves Performance:** By caching static assets or API responses, NGINX reduces load times and server strain.

### Compression

- **Reduces Bandwidth Usage:** NGINX can compress responses, which decreases bandwidth consumption and speeds up delivery.

## Steps to Set Up NGINX as a Reverse Proxy

### a) Install NGINX

1. **Update Your System:**

```bash
   sudo apt update
   sudo apt upgrade
```

2. **Install NGINX:**

```bash
   sudo apt install nginx
```

3. **Start and Enable NGINX:**

```bash
   sudo systemctl start nginx
   sudo systemctl enable nginx
```

### b) Configure NGINX as a Reverse Proxy

1.  **Create a New Configuration File for Your Domain:**

```bash
sudo nano /etc/nginx/sites-available/oocak.com
```

2.  **Add the Following Configuration:**

```bash
server {
listen 80;
server_name oocak.com;

    location / {
        proxy_pass http://localhost:3000;  # Replace with your backend server's IP and port
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

}
```

3.  **Enable the Configuration:**

```bash
sudo ln -s /etc/nginx/sites-available/oocak.com /etc/nginx/sites-enabled/
```

4. **Test the Configuration:**

```bash
sudo nginx -t
```

5. **Reload NGINX:**
6.

```bash
sudo systemctl reload nginx
```

## Conclusion

Using NGINX as a reverse proxy provides numerous benefits, including enhanced security, load balancing, SSL termination, caching, and compression. By following the steps outlined above, you can easily set up NGINX to serve as a robust reverse proxy for your applications.
