---
title: Building a Secure and Scalable Architecture with Raspberry Pi, Cloudflare, and Vercel
slug: raspberry-pi-cloudflare-vercel-architecture
description: Learn how to build a secure and scalable architecture using Raspberry Pi, Cloudflare Tunnels, and Vercel. Understand why switching to DNS only in Cloudflare is crucial for performance and reliability.
imageUrl: /images/9.png
author: O. Ocak
date: 10.03.2025
tags:
  - DNS
  - Tunneling
  - Architecture
published: true
---

# Building a Secure and Scalable Architecture with Raspberry Pi, Cloudflare, and Vercel

In this blog post, I’ll walk you through my architecture for hosting a full-stack application using a **Raspberry Pi**, **Cloudflare Tunnels**, and **Vercel**. This setup ensures security, scalability, and accessibility while keeping costs low. I’ll also explain why I switched from **Proxied** to **DNS only** in Cloudflare and how this decision improved performance.

---

## Architecture Overview

Here’s a high-level overview of the architecture:

1. **Raspberry Pi**:

   - Runs a **PostgreSQL database** and an **Express.js server**.
   - Hosted on **Raspbian OS Lite** (headless, accessed via SSH).
   - Firewall configured to allow only TCP traffic on ports **22 (SSH)**, **80 (HTTP)**, and **443 (HTTPS)**.

2. **Cloudflare Tunnel**:

   - Used to expose the Raspberry Pi to the internet without port forwarding.
   - Provides secure access to the Express server and database.

3. **Hostinger**:

   - Provides the **domain name** (e.g., `oocak.com`) and **subdomains** (e.g., `api.oocak.com`).

4. **Vercel**:

   - Hosts the **front-end application**.
   - Communicates with the back-end API hosted on the Raspberry Pi.

5. **NGINX Proxy Server**:
   - Acts as a reverse proxy on the Raspberry Pi to route traffic to the Express server.

---

## Why This Architecture?

### **1. Raspberry Pi as a Back-End Server**

The Raspberry Pi is a cost-effective solution for hosting a back-end server. However, it has limitations:

- It’s on a **local network**, so it’s not directly accessible from the internet.
- It has limited processing power, so it’s important to optimize traffic and security.

### **2. Cloudflare Tunnel for Secure Access**

Instead of port forwarding (which exposes your local network to security risks), I used **Cloudflare Tunnel** to securely expose the Raspberry Pi to the internet. Here’s why:

- **No Port Forwarding**: Cloudflare Tunnel creates an outbound connection to Cloudflare’s servers, so you don’t need to open ports on your router.
- **Security**: Cloudflare acts as a shield, protecting your Raspberry Pi from direct exposure to the internet.
- **Ease of Use**: Setting up a tunnel is straightforward with the `cloudflared` daemon.

### **3. Hostinger for Domain Management**

Hostinger provides the domain name (`oocak.com`) and subdomains (`api.oocak.com`). This allows me to:

- Separate the front-end (hosted on Vercel) from the back-end (hosted on Raspberry Pi).
- Use human-readable URLs for API endpoints.

### **4. Vercel for Front-End Hosting**

Vercel is an excellent platform for hosting front-end applications because:

- It provides **automatic SSL certificates**.
- It has a **global CDN** for fast content delivery.
- It integrates seamlessly with modern front-end frameworks.

### **5. NGINX as a Reverse Proxy**

NGINX is used on the Raspberry Pi to:

- Route incoming traffic to the Express server.
- Handle SSL termination (if needed).
- Improve performance by load balancing and caching.

---

## Why Switch from Proxied to DNS Only in Cloudflare?

Initially, I configured my DNS records in Cloudflare with the **Proxied** (orange cloud) setting. However, I encountered issues like:

- **Redirect Loops**: The `ERR_TOO_MANY_REDIRECTS` error occurred because Cloudflare’s proxy interfered with Vercel’s routing.
- **Latency**: The additional hop through Cloudflare’s proxy introduced unnecessary latency.
- **Cache Conflicts**: Cloudflare’s caching behavior sometimes conflicted with Vercel’s edge caching.

By switching to **DNS only** (gray cloud), I resolved these issues:

- **Direct Routing**: Requests go directly to Vercel or the Raspberry Pi without passing through Cloudflare’s proxy.
- **Improved Performance**: Reduced latency and better cache management.
- **Simplified Setup**: No need to worry about proxy-related conflicts.

---

## Step-by-Step Setup

### **1. Raspberry Pi Setup**

- Install **Raspbian OS Lite** on the Raspberry Pi.
- Set up a firewall (`ufw`) to allow traffic only on ports **22**, **80**, and **443**.
- Install and configure **PostgreSQL** and **Express.js**.
- Set up **NGINX** as a reverse proxy.

### **2. Cloudflare Tunnel Setup**

- Install the `cloudflared` daemon on the Raspberry Pi.
- Create a tunnel in the Cloudflare dashboard.
- Configure the tunnel to route traffic to the Express server.

### **3. DNS Configuration in Cloudflare**

- Add an `A` record for `oocak.com` pointing to the Raspberry Pi’s public IP (via the tunnel).
- Add a `CNAME` record for `api.oocak.com` pointing to the tunnel’s hostname.
- Set both records to **DNS only** (gray cloud).

### **4. Vercel Setup**

- Deploy the front-end application to Vercel.
- Add the custom domain (`oocak.com`) in the Vercel dashboard.
- Configure the front-end to make API calls to `api.oocak.com`.

---

## Lessons Learned

1. **Security First**: Always prioritize security when exposing local devices to the internet. Cloudflare Tunnel is a great solution.
2. **Performance Matters**: Switching to **DNS only** in Cloudflare improved performance and reduced complexity.
3. **Scalability**: Using Vercel for the front-end ensures scalability and fast content delivery.

---

## Conclusion

This architecture combines the power of **Raspberry Pi**, **Cloudflare**, and **Vercel** to create a secure, scalable, and cost-effective solution for hosting full-stack applications. By leveraging Cloudflare Tunnels and optimizing DNS settings, I was able to overcome challenges like redirect loops and latency.

If you’re building a similar setup, I hope this blog post provides valuable insights and guidance. Feel free to reach out if you have any questions!

---
