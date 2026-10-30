---
title: "How Network Tunneling Works: TCP, UDP, QUIC, Reverse Connections, and Cloudflare Tunnel"
slug: how-network-tunneling-works
description: Explore how network tunneling works, from TCP and UDP communication to QUIC,sockets, and reverse connections. Learn how Cloudflare Tunnel securely exposes a local development server through a public hostname and how it supports a React Native OAuth authentication flow.
imageUrl: /images/2.webp
author: o. ocak
date: 29.10.2026
tags:
  - Networking
  - TCP
  - UDP
  - QUIC
  - Cloudflare
  - Cybersecurity
published: true
---

## The problem: making a local service reachable from the Internet

Imagine a Node.js backend running on your Mac:

```text

Node.js

  |

  +-- HTTP server

        |

        +-- localhost:3000

```

Your application is listening on port `3000`.

You can access it from your Mac:

```bash

curl http://localhost:3000

```

But an external service cannot simply use that address to reach your Mac.

For example, suppose Google OAuth redirects a browser on your iPhone to:

```text

http://localhost:3000/api/mobile/oauth/callback

```

The iPhone interprets `localhost` as its own loopback interface. It does not refer to your Mac.

There are several ways to solve this problem:

1. Expose a port on your router and configure port forwarding.

2. Deploy the backend to a publicly accessible server.

3. Use a reverse tunnel to provide public access to a local service.

For development, the third option is particularly convenient.

Cloudflare Tunnel uses a connector called `cloudflared` to establish outbound connections to Cloudflare. Cloudflare can then route incoming requests through those established connections to your local backend.

Before examining Cloudflare, let's understand the networking mechanisms that make this possible.

---

## IP addresses, ports, and sockets

An IP address identifies a network interface or endpoint within an IP network.

A port identifies a particular transport-layer endpoint on a machine.

For example:

```text

127.0.0.1:3000

```

This represents:

- `127.0.0.1`: IPv4 loopback address.

- `3000`: TCP or UDP port, depending on the transport protocol.

A socket is an operating-system abstraction that applications use to communicate over a network.

On Unix-like systems, including macOS and Linux, sockets are exposed through system calls.

The typical TCP server lifecycle is:

```text

socket()

   |
   v

setsockopt()

   |
   v

bind()

   |
   v

listen()

   |
   v

accept()

   |
   v

read() / write()

   |
   v

close()

```

These are real POSIX APIs, not networking pseudocode.

### Creating a TCP server in C

The following is a working minimal TCP server for macOS or Linux.

It listens on `127.0.0.1:3001`, accepts connections, reads incoming data, and sends an HTTP response.

```c

#include <stdio.h>

#include <stdlib.h>

#include <string.h>

#include <unistd.h>

#include <errno.h>

#include <sys/types.h>

#include <sys/socket.h>

#include <netinet/in.h>

#include <arpa/inet.h>

int main(void) {

    int server_fd;

    int client_fd;

    struct sockaddr_in server_addr;

// 1. Create an IPv4 TCP socket.

    server_fd = socket(AF_INET, SOCK_STREAM, 0);

if (server_fd == -1) {

perror("socket");

return 1;

    }

// 2. Allow the address to be reused.

    int reuse = 1;

setsockopt(

        server_fd,

        SOL_SOCKET,

        SO_REUSEADDR,

        &reuse,

        sizeof(reuse)

    );

// 3. Configure the listening address.

memset(&server_addr, 0, sizeof(server_addr));

    server_addr.sin_family = AF_INET;

    server_addr.sin_port = htons(3001);

inet_pton(

        AF_INET,

        "127.0.0.1",

        &server_addr.sin_addr

    );

// 4. Bind the socket to the address and port.

if (bind(

        server_fd,

        (struct sockaddr *)&server_addr,

        sizeof(server_addr)

    ) == -1) {

perror("bind");

close(server_fd);

return 1;

    }

// 5. Start listening.

if (listen(server_fd, 10) == -1) {

perror("listen");

close(server_fd);

return 1;

    }

printf("Listening on 127.0.0.1:3001\n");

while (1) {

// 6. Accept an incoming connection.

        client_fd = accept(server_fd, NULL, NULL);

if (client_fd == -1) {

perror("accept");

continue;

        }

        char buffer[4096] = {0};

        ssize_t bytes_read = read(

            client_fd,

            buffer,

            sizeof(buffer) - 1

        );

if (bytes_read > 0) {

printf("Received:\n%s\n", buffer);

const char *response =

                "HTTP/1.1 200 OK\r\n"

                "Content-Type: text/plain\r\n"

                "Content-Length: 12\r\n"

                "Connection: close\r\n"

                "\r\n"

                "Hello World!";

write(

                client_fd,

                response,

strlen(response)

            );

        }

close(client_fd);

    }

close(server_fd);

return 0;

}

```

Compile and execute:

```bash

cc server.c -o server

./server

```

In another terminal:

```bash

curl http://127.0.0.1:3001

```

Expected response:

```text

Hello World!

```

This demonstrates the basic mechanics behind a local HTTP service.

A production HTTP server needs considerably more: request parsing, partial reads and writes, concurrency, connection timeouts, HTTP framing, and proper error handling. The example intentionally handles only one request at a time.

### What does `bind()` actually do?

The `bind()` system call associates a socket with a local address and port.

```c

bind(

    server_fd,

    (struct sockaddr *)&server_addr,

    sizeof(server_addr)

);

```

Without binding, a server has not explicitly claimed its intended listening endpoint.

The operating system maintains information about sockets and their associated endpoints.

For a TCP connection, the connection is identified using information that includes:

```text

Source IP

Source port

Destination IP

Destination port

Transport protocol

```

This is important because thousands of connections can use the same destination port while remaining distinguishable.

---

## DNS: how a hostname becomes an IP address

When you access:

```text

https://example.com

```

Your computer needs to resolve `example.com` into an IP address before establishing the network connection.

DNS is a distributed hierarchical naming system.

A simplified lookup process:

```text

Application

    |
    v

Operating system resolver

    |
    v

Configured DNS resolver

    |
    v

DNS infrastructure

    |
    v

IP address returned

```

The resolver may use cached information, so a DNS query does not necessarily travel all the way through the DNS hierarchy every time.

### DNS lookup using actual C APIs

POSIX-compatible systems provide `getaddrinfo()`.

This function resolves a hostname and service into one or more socket addresses.

```c

#include <stdio.h>

#include <stdlib.h>

#include <netdb.h>

#include <sys/socket.h>

#include <arpa/inet.h>

int main(void) {

const char *hostname = "example.com";

    struct addrinfo hints;

    struct addrinfo *results;

memset(&hints, 0, sizeof(hints));

    hints.ai_family = AF_UNSPEC;

    hints.ai_socktype = SOCK_STREAM;

    int status = getaddrinfo(

        hostname,

        "443",

        &hints,

        &results

    );

if (status != 0) {

fprintf(

            stderr,

            "DNS lookup failed: %s\n",

gai_strerror(status)

        );

return 1;

    }

for (struct addrinfo *p = results; p != NULL; p = p->ai_next) {

        char ip[INET6_ADDRSTRLEN];

        void *address;

if (p->ai_family == AF_INET) {

            struct sockaddr_in *ipv4 =

                (struct sockaddr_in *)p->ai_addr;

            address = &ipv4->sin_addr;

        } else if (p->ai_family == AF_INET6) {

            struct sockaddr_in6 *ipv6 =

                (struct sockaddr_in6 *)p->ai_addr;

            address = &ipv6->sin6_addr;

        } else {

continue;

        }

inet_ntop(

            p->ai_family,

            address,

            ip,

            sizeof(ip)

        );

printf("Resolved address: %s\n", ip);

    }

freeaddrinfo(results);

return 0;

}

```

Compile:

```bash

cc dns.c -o dns

./dns

```

You may receive multiple IP addresses because a hostname can resolve to multiple IPv4 or IPv6 endpoints.

### DNS in Cloudflare Tunnel

When `cloudflared` starts, it needs to resolve Cloudflare's infrastructure hostnames.

Your terminal showed:

```text

DNS Resolution

region1.v2.argotunnel.com PASS

DNS Resolution

region2.v2.argotunnel.com PASS

```

This means the machine successfully resolved the required Cloudflare tunnel endpoint hostnames.

It does not mean your Node.js backend has been tested.

DNS resolution is only one step in establishing connectivity.

---

## TCP: reliable communication between two endpoints

TCP is a connection-oriented transport protocol.

Before application data can be exchanged, TCP establishes a connection.

### The TCP three-way handshake

The connection establishment process normally consists of three messages:

```text

Client                         Server

  |                               |

  | -------- SYN ----------------> |

  |                               |

  | <------ SYN + ACK ------------ |

  |                               |

  | -------- ACK ----------------> |

  |                               |

  |       Connection established  |

```

The SYN and ACK flags are part of the TCP header.

The handshake establishes initial sequence numbers and confirms that both endpoints can communicate.

After the connection is established, TCP provides a reliable, ordered byte stream.

Important characteristics:

- Sequence numbers track transmitted data.

- Acknowledgements confirm received data.

- Lost segments can be retransmitted.

- Flow control prevents a sender from overwhelming the receiver.

- Congestion control adjusts transmission according to network conditions.

TCP does not understand HTTP requests, JSON, OAuth, or application-level messages. It transports bytes.

### Establishing a TCP connection in C

The following example uses actual socket APIs to connect to an HTTP server.

```c

#include <stdio.h>

#include <string.h>

#include <unistd.h>

#include <netdb.h>

#include <sys/socket.h>

int main(void) {

    struct addrinfo hints;

    struct addrinfo *results;

memset(&hints, 0, sizeof(hints));

    hints.ai_family = AF_UNSPEC;

    hints.ai_socktype = SOCK_STREAM;

    int status = getaddrinfo(

        "example.com",

        "80",

        &hints,

        &results

    );

if (status != 0) {

fprintf(stderr, "%s\n", gai_strerror(status));

return 1;

    }

    int sock = -1;

for (struct addrinfo *p = results; p != NULL; p = p->ai_next) {

        sock = socket(

            p->ai_family,

            p->ai_socktype,

            p->ai_protocol

        );

if (sock == -1) {

continue;

        }

if (connect(sock, p->ai_addr, p->ai_addrlen) == 0) {

break;

        }

close(sock);

        sock = -1;

    }

freeaddrinfo(results);

if (sock == -1) {

perror("connect");

return 1;

    }

const char *request =

        "GET / HTTP/1.1\r\n"

        "Host: example.com\r\n"

        "Connection: close\r\n"

        "\r\n";

if (write(sock, request, strlen(request)) == -1) {

perror("write");

close(sock);

return 1;

    }

    char buffer[4096];

    ssize_t bytes;

while ((bytes = read(sock, buffer, sizeof(buffer))) > 0) {

fwrite(buffer, 1, bytes, stdout);

    }

close(sock);

return 0;

}

```

Compile and run:

```bash

cc tcp_client.c -o tcp_client

./tcp_client

```

This example uses HTTP over TCP, not HTTPS. HTTPS requires TLS encryption and certificate validation, which are not provided by this code.

Notice that `connect()` is the client-side operation, while `bind()`, `listen()`, and `accept()` are commonly used by servers.

This distinction becomes important when understanding reverse tunneling.

---

## UDP: datagram-based communication

UDP is another transport protocol.

Unlike TCP, UDP does not establish a connection using a three-way handshake.

An application sends individual datagrams.

Each datagram has its own boundaries, unlike TCP's continuous byte stream.

UDP itself does not guarantee:

- Delivery.

- Ordering.

- Retransmission.

- Duplicate suppression.

These properties can be implemented by a higher-level protocol.

### UDP server in C

```c

#include <stdio.h>

#include <string.h>

#include <unistd.h>

#include <sys/socket.h>

#include <netinet/in.h>

#include <arpa/inet.h>

int main(void) {

    int sock = socket(AF_INET, SOCK_DGRAM, 0);

if (sock == -1) {

perror("socket");

return 1;

    }

    struct sockaddr_in server_addr;

memset(&server_addr, 0, sizeof(server_addr));

    server_addr.sin_family = AF_INET;

    server_addr.sin_port = htons(4000);

    server_addr.sin_addr.s_addr = htonl(INADDR_ANY);

if (bind(

        sock,

        (struct sockaddr *)&server_addr,

        sizeof(server_addr)

    ) == -1) {

perror("bind");

close(sock);

return 1;

    }

printf("UDP server listening on port 4000\n");

while (1) {

        char buffer[1024];

        struct sockaddr_in client_addr;

        socklen_t client_len = sizeof(client_addr);

        ssize_t received = recvfrom(

            sock,

            buffer,

            sizeof(buffer) - 1,

            0,

            (struct sockaddr *)&client_addr,

            &client_len

        );

if (received == -1) {

perror("recvfrom");

continue;

        }

        buffer[received] = '\0';

printf("Received: %s\n", buffer);

sendto(

            sock,

            buffer,

            received,

            0,

            (struct sockaddr *)&client_addr,

            client_len

        );

    }

close(sock);

return 0;

}

```

This server receives UDP datagrams and sends the same datagram back to the sender.

Unlike the TCP server, it does not call `listen()` or `accept()`.

### Why Cloudflare uses QUIC

QUIC is a transport protocol built on top of UDP.

It provides capabilities that applications traditionally obtained through TCP and TLS, including:

- Reliable data delivery.

- Congestion control.

- Stream multiplexing.

- Encryption using TLS 1.3.

- Connection migration using connection IDs.

QUIC is used by HTTP/3.

Its protocol stack looks like this:

```text

HTTP/3

   |

   v

QUIC

   |

   v

UDP

   |

   v

IP

```

A useful distinction:

**UDP itself is not reliable, but QUIC implements reliability above UDP.**

QUIC also avoids some of the cross-stream blocking associated with TCP's ordered byte stream. A lost packet affecting one QUIC stream does not necessarily prevent unrelated streams from making progress.

Cloudflare Tunnel can use QUIC as its transport protocol.

---

## HTTP/2, HTTP/3, and TLS

Transport protocols are not the same as application protocols.

The following are different layers:

| Protocol | Responsibility |

| -------- | ---------------------------------------------------------------- |

| IP | Addressing and routing packets |

| TCP | Reliable byte-stream transport |

| UDP | Datagram transport |

| TLS | Encryption and peer authentication |

| QUIC | Reliable multiplexed transport over UDP, with integrated TLS 1.3 |

| HTTP/1.1 | Application-level request/response protocol |

| HTTP/2 | Multiplexed HTTP protocol over a connection |

| HTTP/3 | HTTP mapped onto QUIC streams |

Typical stacks:

**HTTP/2**

```text

HTTP/2

   |

TLS

   |

TCP

   |

IP

```

**HTTP/3**

```text

HTTP/3

   |

QUIC + TLS 1.3

   |

UDP

   |

IP

```

### TLS and certificate validation

When your browser accesses:

```text

https://example.com

```

It establishes an encrypted connection and validates the server's certificate against the requested hostname.

TLS provides confidentiality, integrity, and authentication of the server.

For Cloudflare Tunnel, your browser communicates with Cloudflare through HTTPS. The `cloudflared` connector separately maintains its connection to Cloudflare.

The connection from `cloudflared` to your local Node.js service can remain ordinary HTTP:

```text

Safari

   |

   | HTTPS

   v

Cloudflare

   |

   | Tunnel transport

   v

cloudflared

   |

   | HTTP

   v

localhost:3000

```

This is why you can use an HTTPS public endpoint while your local Node.js server continues listening on HTTP.

---

## Reverse tunneling: the important architectural concept

Now we can get to the central idea.

Traditional server connectivity often looks like this:

```text

External client

      |

      | Incoming connection

      v

Public server

      |

      v

Application

```

For a machine behind a NAT router or firewall, accepting arbitrary inbound connections may not be possible.

NAT translates private network addresses to public-facing addresses. Firewalls may also block unsolicited inbound connections.

A reverse tunnel changes the connection direction.

Instead of waiting for Cloudflare to initiate a new connection into your private network, your machine initiates an outbound connection to Cloudflare.

```text

Your Mac                         Cloudflare

   |                                  |

   | -------- Outbound connection --> |

   |                                  |

   | <----- Traffic through tunnel --- |

   |                                  |

```

The important property is that the connection was initiated from your machine.

NAT and stateful firewalls generally maintain connection-tracking information for established outbound connections. Return traffic associated with that connection can pass back through the network.

### Simplified reverse proxy architecture

Imagine a remote system has a request to forward to your backend.

A simplified tunnel connector needs to perform two jobs:

1. Receive traffic from the remote tunnel connection.

2. Open or reuse a connection to the local service.

Conceptually:

```text

Remote request

     |

     v

Tunnel connection

     |

     v

Tunnel connector

     |

     v

Local TCP connection

     |

     v

127.0.0.1:3000

```

A simplified C forwarding model might look like this:

```c

// Architectural pseudocode:

//

// remote_fd represents an established tunnel-side connection.

// local_fd represents a connection to the local origin.

//

// Actual Cloudflare Tunnel does not expose this simple

// one-socket-per-request interface.

int local_fd = socket(AF_INET, SOCK_STREAM, 0);

struct sockaddr_in origin;

memset(&origin, 0, sizeof(origin));

origin.sin_family = AF_INET;

origin.sin_port = htons(3000);

inet_pton(

    AF_INET,

    "127.0.0.1",

    &origin.sin_addr

);

connect(

    local_fd,

    (struct sockaddr *)&origin,

    sizeof(origin)

);

// Forward request bytes to local_fd.

// Read the origin response.

// Forward response bytes through remote_fd.

```

This illustrates the local-origin connection, but not Cloudflare's actual tunnel protocol.

### A real TCP relay using POSIX APIs

The following example demonstrates a TCP relay between an accepted connection and a local service.

It uses `poll()` to monitor both sockets and forwards bytes in either direction.

This is a simplified TCP proxy, not a Cloudflare connector. It assumes a single client and does not implement TLS, HTTP parsing, authentication, or connection multiplexing.

```c

#include <stdio.h>

#include <stdlib.h>

#include <unistd.h>

#include <errno.h>

#include <sys/types.h>

#include <sys/socket.h>

#include <sys/poll.h>

#include <netinet/in.h>

#include <arpa/inet.h>

#define BUFFER_SIZE 8192

static int connect_origin(void) {

    int fd = socket(AF_INET, SOCK_STREAM, 0);

if (fd == -1) {

perror("socket");

return -1;

    }

    struct sockaddr_in origin = {0};

    origin.sin_family = AF_INET;

    origin.sin_port = htons(3000);

inet_pton(

        AF_INET,

        "127.0.0.1",

        &origin.sin_addr

    );

if (connect(

        fd,

        (struct sockaddr *)&origin,

        sizeof(origin)

    ) == -1) {

perror("connect origin");

close(fd);

return -1;

    }

return fd;

}

int main(void) {

    int listener = socket(AF_INET, SOCK_STREAM, 0);

if (listener == -1) {

perror("socket");

return 1;

    }

    int reuse = 1;

setsockopt(

        listener,

        SOL_SOCKET,

        SO_REUSEADDR,

        &reuse,

        sizeof(reuse)

    );

    struct sockaddr_in address = {0};

    address.sin_family = AF_INET;

    address.sin_port = htons(9000);

    address.sin_addr.s_addr = htonl(INADDR_ANY);

if (bind(

        listener,

        (struct sockaddr *)&address,

        sizeof(address)

    ) == -1) {

perror("bind");

return 1;

    }

if (listen(listener, 10) == -1) {

perror("listen");

return 1;

    }

printf("Relay listening on port 9000\n");

while (1) {

        int remote = accept(listener, NULL, NULL);

if (remote == -1) {

perror("accept");

continue;

        }

        int local = connect_origin();

if (local == -1) {

close(remote);

continue;

        }

        struct pollfd fds[2] = {

            { .fd = remote, .events = POLLIN },

            { .fd = local, .events = POLLIN }

        };

        int running = 1;

while (running) {

            int result = poll(fds, 2, -1);

if (result == -1) {

if (errno == EINTR) {

continue;

                }

perror("poll");

break;

            }

for (int i = 0; i < 2; i++) {

if (fds[i].revents & (POLLERR | POLLNVAL)) {

                    running = 0;

break;

                }

if (fds[i].revents & POLLIN) {

                    char buffer[BUFFER_SIZE];

                    ssize_t received = recv(

                        fds[i].fd,

                        buffer,

                        sizeof(buffer),

                        0

                    );

if (received <= 0) {

                        running = 0;

break;

                    }

                    int destination =

                        (i == 0) ? local : remote;

                    ssize_t sent = 0;

while (sent < received) {

                        ssize_t n = send(

                            destination,

                            buffer + sent,

                            received - sent,

                            0

                        );

if (n <= 0) {

                            running = 0;

break;

                        }

                        sent += n;

                    }

                }

if (fds[i].revents & POLLHUP) {

                    running = 0;

break;

                }

            }

        }

close(remote);

close(local);

    }

close(listener);

return 0;

}

```

To test the relay, run your local HTTP server on port `3000`, then start the relay:

```bash

cc relay.c -o relay

./relay

```

In another terminal:

```bash

curl http://localhost:9000

```

The request reaches port `9000`, is forwarded to `localhost:3000`, and the response travels back through the relay.

**Production caveats:** This example does not correctly implement all TCP half-close semantics, buffering, backpressure, nonblocking writes, or concurrent clients. It is a learning model for bidirectional byte forwarding, not production proxy code.

### How Cloudflare differs from this relay

Cloudflare Tunnel is not simply a TCP relay that opens one local connection for every remote TCP connection.

It has a more sophisticated architecture:

- `cloudflared` establishes and maintains connections to Cloudflare.

- Cloudflare routes incoming traffic to the appropriate tunnel.

- The connector handles tunnel transport and request forwarding.

- Multiple requests can be carried through established tunnel connections.

- Connection failures and reconnections are managed by the connector.

- The connector can communicate with the configured origin service.

The exact internal framing and multiplexing implementation should not be inferred from the simple C example above.

The important architectural principle is the outbound-established connection and the ability to route remote requests through it.

---

## Understanding the Cloudflare connectivity pre-checks

When you ran:

```bash

cloudflared tunnel --url http://localhost:3000

```

Your terminal displayed:

```text

COMPONENT          TARGET                     STATUS

DNS Resolution     region1.v2.argotunnel.com  PASS

DNS Resolution     region2.v2.argotunnel.com  PASS

UDP Connectivity   region1.v2.argotunnel.com  PASS

UDP Connectivity   region2.v2.argotunnel.com  PASS

TCP Connectivity   region1.v2.argotunnel.com  PASS

TCP Connectivity   region2.v2.argotunnel.com  PASS

Cloudflare API     api.cloudflare.com:443     PASS

```

Let's interpret this using the networking concepts above.

### DNS Resolution

```text

region1.v2.argotunnel.com

region2.v2.argotunnel.com

```

`cloudflared` needs to resolve Cloudflare tunnel endpoints into network addresses.

The DNS checks succeeded.

### UDP Connectivity

```text

QUIC connection successful

```

This confirms that the tested QUIC connectivity was successful.

The machine can communicate with Cloudflare using the UDP-based QUIC transport.

### TCP Connectivity

```text

HTTP/2 connection successful

```

This confirms that the tested TCP-based HTTP/2 connectivity was successful.

TCP provides another available transport option.

### Cloudflare API

```text

api.cloudflare.com:443

```

This checks HTTPS connectivity to Cloudflare's API endpoint.

It is separate from the tunnel's data transport.

### Why QUIC was selected

Your terminal printed:

```text

Environment is healthy.

cloudflared will use 'quic' as primary protocol.

```

Both UDP and TCP checks succeeded.

Cloudflare selected QUIC as its primary transport for this session.

This does not mean TCP is broken or that QUIC is universally faster in every network environment. It means the connector selected the QUIC transport based on its available configuration and connectivity checks.

---

## Installing and configuring Cloudflare Tunnel on macOS

Now that the networking concepts are clearer, let's apply them.

### Install cloudflared

Install using Homebrew:

```bash

brew install cloudflared

```

Verify:

```bash

cloudflared --version

```

Homebrew installs the Cloudflare Tunnel client, which establishes and maintains the tunnel connection.

### Start your Node.js backend

Start your backend:

```bash

npm run dev

```

Assume the backend listens on:

```text

http://localhost:3000

```

Verify the local service:

```bash

curl -i http://localhost:3000

```

If the connection fails, fix the backend before testing the tunnel.

### Generate a public URL

Open another terminal and run:

```bash

cloudflared tunnel --url http://localhost:3000

```

Cloudflare generates a temporary public hostname.

Example:

```text

https://scholars-absolutely-sie-pension.trycloudflare.com

```

The resulting route is:

```text

Public Internet

      |

      v

Cloudflare edge

      |

      v

Established tunnel

      |

      v

cloudflared process

      |

      v

localhost:3000

```

Keep the terminal running.

A Quick Tunnel is temporary. If you stop and restart the process, the generated hostname may change.

### Test the public endpoint

```bash

curl -i https://scholars-absolutely-sie-pension.trycloudflare.com

```

Compare the response with the local request:

```bash

curl -i http://localhost:3000

```

If the local request works and the public request reaches your application, the tunnel is forwarding traffic successfully.

A `404` response can still confirm that traffic reached your backend. It may simply mean that the requested route does not exist.

A `502 Bad Gateway` generally indicates that Cloudflare cannot successfully reach the configured origin.

### Create a named tunnel with a stable hostname

A Quick Tunnel is useful for a short experiment, but its generated hostname is temporary. For repeated development work, a named tunnel can use a hostname under a domain you control.

In this setup, the named tunnel is managed through the Cloudflare dashboard. A public hostname is configured to forward requests to the local Node.js service.

The published application configuration is:
Setting Value
Public hostname oauth-dev.oocak.com
Service type HTTP
Origin service http://localhost:3000

Cloudflare manages the DNS route for the published hostname. The cloudflared connector on the Mac maintains an outbound connection to Cloudflare; requests for the hostname are routed through that connection to the local origin.

The request path is:
Browser / Google
|
| HTTPS
v
oauth-dev.oocak.com
|
v
Cloudflare edge
|
| Established tunnel connection
v
cloudflared on the Mac
|
| HTTP
v
http://localhost:3000
Unlike a Quick Tunnel, the named tunnel gives the development environment a predictable hostname. It does not make the local Node.js process highly available: the Mac, backend process, and tunnel connector still need to be running.

A named tunnel is also not automatically a production deployment. It is a stable route to the configured origin, which in this case is still a development server on the Mac.

---

## Using Cloudflare Tunnel for Google OAuth

The practical reason for creating the tunnel is to let an external browser reach the OAuth callback handled by the Node.js backend running locally on the Mac.

A callback URL containing localhost is not suitable for this purpose when Google redirects the browser on an iPhone. On the iPhone, localhost refers to the iPhone itself, not the Mac running the backend.

The named tunnel provides a public HTTPS callback URL:
https://oauth-dev.oocak.com/api/mobile/oauth/callback
The local origin remains:
http://localhost:3000
Cloudflare terminates the public HTTPS connection and forwards the request through the established tunnel to the local HTTP service.

### 10.1 Configure the backend callback URL

Set the mobile callback environment variable to the public hostname and exact callback path:
GOOGLE_MOBILE_REDIRECT_URI=https://oauth-dev.oocak.com/api/mobile/oauth/callback
Restart the Node.js backend after changing .env. Environment-variable changes are not necessarily picked up by the running process or by every development watcher.

When the backend generates the Google authorization URL, inspect its redirect_uri parameter. It should contain the exact public callback URL above, rather than localhost or 127.0.0.1.

### 10.2 Register the redirect URI with the matching Google OAuth client

In Google Cloud Console, open the OAuth 2.0 client configuration used by this authorization-code flow and register the exact redirect URI where that client type supports authorized redirect URIs:
https://oauth-dev.oocak.com/api/mobile/oauth/callback
The redirect_uri sent in the authorization request must match the URI used during the token exchange and the URI registered with the relevant Google OAuth client. Do not switch between iOS and Web client IDs simply to make the hostname work. The client configuration, authorization request, and code exchange must be consistent with the OAuth flow being implemented.

For a backend-handled callback, verify the requirements for the specific Google OAuth client type being used. The tunnel itself does not determine which client ID or client secret should be used.

### 10.3 Verify the tunnel before testing OAuth

First, verify that the local backend is running:
curl -i http://localhost:3000
Then request the public hostname:
curl -i https://oauth-dev.oocak.com
In this development setup, the public root request returned an HTTP 404 response with the Express response headers and Cannot GET /. That is still useful evidence: the request reached the Node.js application, but the application does not define a handler for /.

Next, test the callback route directly:
curl -i https://oauth-dev.oocak.com/api/mobile/oauth/callback
A request made this way does not contain the OAuth state or authorization code that Google would normally send. In this setup, the route responded with a redirect indicating no_state. That confirms the callback route was reached; it does not mean that Google OAuth succeeded.

These checks separate tunnel connectivity from application behavior:

- A response generated by Express, including a route-level 404, shows that the request reached the origin application.
- A callback response such as no_state shows that the callback handler ran but did not receive the expected OAuth state.
- A 502 Bad Gateway points to a problem reaching the configured origin through the tunnel and should be investigated separately.

### 10.4 Follow the complete OAuth flow

The resulting flow is:
React Native
|
| Request authorization URL (including PKCE challenge)
v
Node.js backend
|
| Generate Google authorization URL
v
In-app browser / Safari
|
v
Google authorization
|
| Redirect with Google's authorization code and state
v
https://oauth-dev.oocak.com/api/mobile/oauth/callback
|
v
Cloudflare edge
|
v
cloudflared on the Mac
|
v
Node.js callback at localhost:3000
|
| Validate state
| Exchange Google's authorization code with Google
| Generate application-specific code
v
oocakrn://oauth-callback
|
v
React Native
|
| Exchange application code with PKCE verifier
v
Node.js token endpoint
|
v
Application tokens
There are two separate authorization-code exchanges in this architecture:

1. The backend exchanges Google's authorization code with Google after validating the OAuth state.
2. React Native exchanges the application-specific code with the backend using the PKCE verifier.
   The tunnel only provides network reachability to the callback endpoint. It does not validate OAuth state, exchange authorization codes, validate PKCE, or issue application tokens. Those remain responsibilities of the application and its backend.

---

## Troubleshooting by network layer

Understanding the layers helps identify where a failure occurs.

| Symptom | Likely area to investigate |

| ------------------------------------ | ----------------------------------------------------- |

| Hostname cannot resolve | DNS |

| Connection refused on localhost | Local server or port |

| Tunnel cannot establish a connection | Firewall, UDP/TCP connectivity, Cloudflare connection |

| Public URL returns 502 | Tunnel-to-origin connectivity |

| Public URL returns 404 | Backend routing or requested path |

| Google rejects the callback URI | OAuth client configuration |

| Safari cannot open localhost | Incorrect callback hostname |

| Application does not reopen | iOS URL scheme registration |

| Application-code exchange fails | Backend validation or PKCE |

A useful debugging sequence:

```bash

# 1. Check the local backend

curl -i http://localhost:3000

# 2. Check the public tunnel

curl -i https://YOUR-TUNNEL.trycloudflare.com

# 3. Check the exact callback

curl -i https://YOUR-TUNNEL.trycloudflare.com/api/mobile/oauth/callback

```

The third request may return an application error because it lacks OAuth parameters. That does not necessarily indicate a tunnel failure.

---

## Development versus production

Cloudflare Quick Tunnels are designed for testing and development.

They are useful because:

- No domain purchase is required.

- No router port forwarding is required.

- No public deployment is required.

- A temporary HTTPS endpoint is generated automatically.

However, they are not intended to be a permanent production deployment.

For a more stable development setup, use a named Cloudflare Tunnel and a hostname under a domain you control.

That provides a predictable callback URL instead of a randomly generated temporary hostname. The hostname can remain stable while the origin is still a local development server; it does not provide production availability by itself.

You should also consider:

- Persistent tunnel configuration.

- Connector availability and reconnection.

- Production secrets management.

- Authentication and access restrictions.

- Monitoring and logging.

- Multiple connector instances where availability requires them.

## Conclusion

Network tunneling is not magic. It combines familiar networking concepts:

1. DNS resolves a hostname into network addresses.

2. TCP or UDP provides transport.

3. TLS and QUIC provide encrypted communication.

4. A tunnel connector maintains outbound connectivity.

5. Incoming requests are routed through that connectivity to a local origin.

6. The origin processes the request and returns a response through the same general path.

Cloudflare Tunnel packages these mechanisms into a managed service.

For this React Native OAuth development setup, the key benefit is straightforward: Google can reach https://oauth-dev.oocak.com/api/mobile/oauth/callback, while the Node.js backend continues running locally on the Mac at http://localhost:3000.

The most important distinction to remember is that **a successful tunnel proves network connectivity, not application correctness or OAuth correctness.**
