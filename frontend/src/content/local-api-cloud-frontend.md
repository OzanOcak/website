---
title: Local APIs with Cloud-Hosted Frontends
slug: local-api-cloud-frontend
description: Raspberry Pi hosted APIs with Cloud-Hosted Frontends
imageUrl: /images/4.png
author: o. ocak
date: 11.09.2024
tags:
  - Architecture
  - Networking
published: true
---

# Combining Local APIs with Cloud-Hosted Frontends (and Taming Cloudflare Headers)

In today's interconnected world, building robust web applications often involves leveraging both cloud services and local servers. In this post, I'll walk you through my architecture, which combines a Raspberry Pi-hosted API with a Vercel-deployed frontend, and the challenges I faced with Cloudflare's header manipulation.

## My Architecture: A Hybrid Approach

My setup consists of:

###### Backend (Raspberry Pi):

- A Node.js/Express API server running on a Raspberry Pi.
- PostgreSQL for data storage.
- Drizzle ORM for database interactions.

###### Frontend (Vercel):

- A Next.js application deployed on Vercel.

###### DNS Management:

- Cloudflare for DNS management, except for the API subdomain.

###### API Subdomain and Tunneling:

- Cloudflare Tunnel to securely expose the Raspberry Pi API via a subdomain (e.g., api.oocak.com).
- This architecture allows me to take advantage of Vercel's scalability and ease of deployment for the frontend, while maintaining control over my API server on the Raspberry Pi.

## The Challenge: Cloudflare Header Manipulation and OAuth Woes

One of the biggest hurdles I encountered was a redirect_url_mismatch error during my OAuth flow. This error occurred because Cloudflare was manipulating HTTP headers, specifically the Host header.

###### The Problem:

My OAuth provider was expecting the Host header to match the registered redirect URI.
Cloudflare, acting as a reverse proxy, was modifying the Host header, causing a mismatch.
Debugging and Investigation:

To get to the bottom of this, I used several tools:

dig and nslookup: These tools helped me verify DNS records and ensure that my subdomain was correctly pointing to Cloudflare.
tcpdump: I attempted to use tcpdump to capture network packets and inspect the headers. However, I discovered that tcpdump doesn't readily decrypt SSL traffic.
Wireshark: I turned to Wireshark, a powerful network protocol analyzer, to examine the packets in detail. This allowed me to see the header manipulations that Cloudflare was performing.
The Unresolved Issue:

Despite extensive debugging, I have not yet found a definitive solution to prevent Cloudflare from manipulating the Host header in a way that breaks my OAuth flow. I tried various Cloudflare settings, but the problem persists.

## Lessons Learned:

Cloudflare's Header Manipulation: Cloudflare can modify HTTP headers, which can have unexpected consequences for applications that rely on specific header values.
Network Debugging Tools: dig, nslookup, tcpdump, and Wireshark are invaluable tools for network troubleshooting.
Hybrid Architectures: Combining cloud and local servers can offer flexibility, but it's essential to understand the potential challenges.
Future Steps:

I plan to continue investigating Cloudflare's settings and explore alternative solutions, such as using Cloudflare Workers to manipulate headers or finding a workaround within my OAuth flow.
I will also look into if the cloudflare tunnel has settings that can prevent this.
Conclusion:

Building a hybrid architecture requires careful planning and troubleshooting. While I've encountered challenges with Cloudflare's header manipulation, the experience has provided valuable insights into network debugging and the complexities of cloud-based services.

I hope this blog post helps you on your own development journey. If you have any suggestions or solutions for the Cloudflare header manipulation issue, please feel free to share them in the comments below!
