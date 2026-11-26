---
title: "OWASP A04:2021 — Insecure Design: Practical Security Design Assessment"
slug: owasp-a04-insecure-design-assessment
description: "A practical investigation of OWASP A04:2021 Insecure Design, examining security requirements, threat modeling, abuse cases, and design-level security controls in a Node.js and PostgreSQL application."
imageUrl: /images/8.webp
author: o. ocak
date: 23.11.2026
tags:
  - OWASP
  - Insecure Design
  - Application Security
  - API Security
  - Threat Modeling
  - Security Requirements
  - Abuse Cases
  - Node.js
  - Express
  - PostgreSQL
published: true
---

Authentication is often treated as one of the most important parts of application security. A user logs in, receives a token, and sends that token with subsequent API requests. The server verifies the token and determines what the user is allowed to do.

But authentication alone does not make an application secure.

An application can correctly authenticate users and still allow them to perform actions they should never be able to perform. This is where secure application design becomes important.

In this article, I'll explore OWASP Top 10 A04:2021 — Insecure Design through a practical example from a comment system in a web application.

## What Is Insecure Design?

Insecure Design refers to security weaknesses introduced by the design and architecture of an application.

Unlike a simple implementation mistake, an insecure design problem can exist because the application was never designed with the necessary security requirements, threat scenarios, or protection mechanisms.

For example, consider a comment system with these requirements:

- Authenticated users can create comments.
- Users can edit their own comments.
- Users can delete their own comments.
- Users cannot modify or delete comments belonging to other users.

These requirements sound straightforward. However, if the application design only considers whether a user is authenticated and whether their role has permission to edit comments, it may overlook the most important question:

**Does this particular comment belong to the authenticated user?**

That missing security requirement can become an authorization vulnerability.

## A Real-World Example: Designing a Comment API

Imagine an application with a comment endpoint:

`PATCH /api/comments/:commentId`

The application uses JWT authentication. The authentication middleware verifies the access token and extracts the user's identity and role.

The route also checks whether the user's role has the `edit_comment` permission.

At first glance, this looks like a reasonable security design:

1. Verify the user's identity.
2. Check their permissions.
3. Execute the requested operation.

However, there is another authorization boundary: ownership of the requested resource.

A user may have permission to edit their own comments without having permission to edit everyone else's comments.

If the controller updates a comment using only its ID, the application has not enforced that distinction.

For example:

```ts
await db
  .update(comments)
  .set({ content })
  .where(eq(comments.id, Number(commentId)));
```

The query identifies the comment, but it does not establish whether the authenticated user owns it.

The database operation needs to enforce the ownership condition as well.

## Why This Is a Design Problem

The underlying issue is not simply that a database query is missing a condition.

The application needs an explicit authorization model that distinguishes between:

- Authentication: Who is making the request?
- Role-based authorization: What general actions can this user perform?
- Resource-level authorization: Is this user allowed to perform this action on this particular resource?

These are different security decisions.

A secure design should define the ownership rule before the endpoint is implemented. Every operation involving a user-owned resource should follow that rule consistently.

For a comment system, the ownership invariant could be:

> A user may modify or delete a comment only when the comment's owner ID matches the authenticated user's ID, unless an explicitly authorized administrative operation applies.

This rule should not depend on information supplied by the client.

## Security Requirements Must Be Designed, Not Assumed

A useful way to prevent this class of problem is to define security requirements alongside functional requirements.

| Functional requirement | Security requirement                                              |
| ---------------------- | ----------------------------------------------------------------- |
| Create a comment       | Derive the author identity from the authenticated session         |
| Edit a comment         | Verify resource ownership                                         |
| Delete a comment       | Verify resource ownership or an explicit administrative privilege |
| View comments          | Define which comment information is publicly accessible           |
| Reply to a comment     | Verify the parent comment and its associated post                 |

This makes authorization part of the application design rather than something added after the endpoints are implemented.

## A04 and A01: Understanding the Difference

This example also demonstrates an important distinction in the OWASP Top 10.

**A04: Insecure Design** concerns the missing or inadequate security requirements and architectural decisions that allow the weakness to exist.

**A01: Broken Access Control** concerns the resulting failure to enforce authorization when a user attempts to access or modify a resource.

The same application can have a design weakness that leads to an access-control vulnerability. Correctly identifying both the underlying design problem and the observable security failure makes the assessment more useful.

## Lessons Learned

Secure application design requires more than adding authentication middleware or defining user roles.

Before implementing an endpoint, developers should ask:

- Who is allowed to perform this operation?
- Which specific resources can they access?
- Is ownership verified on the server?
- Can the client influence the identity used for authorization?
- Are the same rules enforced across create, update, and delete operations?
- What happens when a user changes their role or loses access?

These questions help turn security expectations into explicit application requirements.

## Conclusion

A secure application should not assume that an authenticated user is automatically authorized to perform every action available to their role.

Security must account for the relationship between the user, the requested operation, and the resource being accessed.

The comment-system example demonstrates how a seemingly reasonable combination of JWT authentication and role-based permissions can still leave an important authorization boundary undefined.

The broader lesson from OWASP A04 is that security needs to be part of the design process from the beginning—not an afterthought discovered during vulnerability testing.
