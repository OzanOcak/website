---
title: "OWASP A03:2021 — Injection: SQL Injection Testing"
slug: owasp-a03-sql-injection-testing
description: "A practical investigation of OWASP A03:2021 Injection, testing SQL injection attempts against a Node.js and PostgreSQL application and examining Drizzle ORM parameterized queries, Zod input validation, and database query safety."
imageUrl: /images/8.webp
author: o. ocak
date: 22.11.2026
tags:
  - OWASP
  - Injection
  - SQL Injection
  - API Security
  - Database Security
  - Input Validation
  - Drizzle ORM
  - Zod
  - Node.js
  - Express
published: true
---

## Introduction

SQL injection occurs when an application allows user-controlled input to change the structure or meaning of an SQL query.

An attacker may attempt to manipulate database queries through login forms, search fields, URL parameters, or other inputs. If an application constructs SQL statements by concatenating untrusted input, an attacker may be able to execute unintended database operations.

For this review, I examined my own Node.js, Express, PostgreSQL, and Drizzle ORM backend. I also tested the production login endpoint and reviewed the query construction used in several application features.

The objective was to determine whether user-controlled input could alter SQL queries and whether the application consistently used parameterized database operations.

## Testing the Login Endpoint

The login endpoint was one of the first places I examined because authentication queries commonly use user-provided email addresses.

### Normal login request with a nonexistent email

I first sent a request with a valid email format but a nonexistent account:

```bash
curl -i https://api.oocak.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nonexistent@example.com","password":"invalid"}'
```

The API returned:

```json
{
  "message": "User not found"
}
```

This established the normal behavior for a nonexistent account.

### Testing a quote-based input

Next, I tested an email containing a single quote:

```bash
curl -i https://api.oocak.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test'\''","password":"invalid"}'
```

The API returned an HTTP 400 validation error because the email was invalid.

### Testing a Boolean-style SQL injection string

I also tested a classic SQL injection pattern:

```text
' OR '1'='1
```

The request was rejected by email validation.

I additionally tried an email-shaped variation:

```text
test' OR '1'='1@example.com
```

This was also rejected by validation.

**Important finding:** These production requests did not establish that the database was protected by themselves. The malformed inputs were rejected before reaching the database query. To assess SQL injection protection, I also inspected the actual database query implementation.

## Drizzle ORM and Parameterized Queries

The login controller uses Drizzle ORM:

```ts
const user = await db.select().from(users).where(eq(users.email, email));
```

The important part is:

```ts
eq(users.email, email);
```

Drizzle treats the email as a parameter value rather than concatenating it into the SQL statement.

For example, the application does not construct a query like this:

```ts
// Unsafe example — do not use
const query = `SELECT * FROM users WHERE email = '${email}'`;
```

With string concatenation, malicious input could potentially change the meaning of the SQL statement.

Using Drizzle's query builder keeps the user-provided value separate from the SQL structure.

This is the primary SQL injection protection in the reviewed login query.

## Zod Input Validation

I also use Zod with React Hook Form to validate signup data before submitting it to the API.

My signup schema includes:

```ts
const signupSchema = z.object({
  username: z.string().min(3, "Username is required").max(50),

  email: z.string().email("Invalid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character",
    ),
});
```

The schema is connected to React Hook Form through:

```ts
const form = useForm<SignupFormInputs>({
  resolver: zodResolver(signupSchema),
  mode: "onBlur",
  defaultValues: {
    username: "",
    email: "",
    password: "",
  },
});
```

This validates the form before the signup request is submitted.

The validation checks include:

- Username length.
- Email format.
- Minimum password length.
- Uppercase character requirement.
- Numeric character requirement.
- Special character requirement.

### How this contributes to security

Zod helps reject malformed or unexpected input before it is submitted through the normal application interface.

However, this particular schema is used on the frontend. It is not a security boundary because an attacker can bypass the React application and send requests directly to the API.

Backend validation must independently enforce the application's input requirements.

It is also important to distinguish input validation from SQL injection prevention:

- **Zod** validates whether input meets expected application rules.
- **Backend validation** enforces those rules when requests reach the API.
- **Drizzle parameterization** prevents user-provided values from changing SQL query structure.

Even valid-looking input must be treated as untrusted when it reaches the database.

## Testing Search Queries

I also reviewed the user search and count services.

The application supports searching by username, email, and role.

The implementation uses Drizzle's `ilike()` and `eq()` operators:

```ts
if (searchQuery) {
  switch (searchCriteria) {
    case "name":
      query = query.where(
        ilike(users.username, `%${searchQuery}%`),
      ) as typeof query;
      break;

    case "email":
      query = query.where(
        ilike(users.email, `%${searchQuery}%`),
      ) as typeof query;
      break;

    case "role":
      query = query.where(eq(users.role, searchQuery)) as typeof query;
      break;
  }
}
```

There are two relevant protections here.

First, the search value is passed through Drizzle's query operators as a parameter rather than concatenated into executable SQL.

Second, `searchCriteria` is handled through a fixed switch statement. The application does not directly insert an arbitrary user-provided field name into SQL.

The `%` and `_` characters can influence SQL `LIKE` matching behavior, but that is different from SQL injection. If literal substring matching is required, those wildcard characters should be escaped separately.

## Reviewing SQL Template Literals

I searched the backend for potentially sensitive SQL construction patterns, including:

- `sql` tagged templates
- `execute()`
- `.query()`
- `.unsafe()`
- `.raw()`
- Dynamic `orderBy()` expressions

I found several SQL template literals used for fixed arithmetic operations and comparisons.

For example, the blog likes controller uses:

```ts
await db
  .update(likes)
  .set({
    likes_count: sql`${likes.likes_count} + 1`,
  })
  .where(sql`${likes.slug} = ${postId}`)
  .execute();
```

The `postId` value is interpolated into a Drizzle SQL template. Drizzle parameterizes this value rather than treating it as executable SQL.

The arithmetic operation is also fixed:

```sql
likes_count + 1
```

The user does not control that SQL expression.

The unlike operation follows the same pattern:

```ts
.set({
  likes_count: sql`${likes.likes_count} - 1`
})
```

I found similar fixed arithmetic operations in the comment likes and visitor-count functionality.

The important distinction is that SQL template literals are not automatically unsafe. Their safety depends on how they are constructed. Drizzle's parameterized interpolation is different from concatenating untrusted strings into raw SQL.

## Reviewing Comment and User Operations

I also examined comment likes and unlikes:

```ts
await db
  .update(comments)
  .set({
    likeCount: sql`${comments.likeCount} + 1`,
  })
  .where(eq(comments.id, Number(commentId)))
  .returning();
```

The comment ID is converted to a number and passed through Drizzle's `eq()` operator.

I also reviewed user-management operations, including updating usernames, changing roles, and deleting profiles.

For example:

```ts
await db
  .update(users)
  .set({ username: newName })
  .where(eq(users.id, Number(id)));
```

These operations use Drizzle query operators rather than building SQL strings from user-controlled values.

Converting an input to a number is useful for type handling, but it is not a replacement for validation. IDs should also be checked to ensure they are valid positive integers.

## Reviewing Password Reset Queries

I examined the forgot-password and update-password controllers as well.

The forgot-password controller looks up the account using:

```ts
const user = await db.select().from(users).where(eq(users.email, email));
```

The password update operation also uses a parameterized condition:

```ts
await db
  .update(users)
  .set({ password: hashedPassword })
  .where(eq(users.email, email))
  .execute();
```

In both cases, the email is passed through Drizzle's query builder.

This means the reviewed database operations do not construct SQL by concatenating the email value into a query string.

## Review Results

| Area reviewed         | Protection observed                              |
| --------------------- | ------------------------------------------------ |
| Login query           | Drizzle `eq()` parameterization                  |
| Signup form           | Zod frontend validation                          |
| User search           | Drizzle `ilike()` and `eq()`                     |
| Search criteria       | Fixed switch statement                           |
| Blog likes            | Parameterized SQL template interpolation         |
| Comment likes         | Drizzle query operators and parameterized values |
| User updates          | Drizzle query operators                          |
| User deletion         | Drizzle query operators                          |
| Password reset lookup | Drizzle `eq()`                                   |
| Password update       | Drizzle `eq()`                                   |

## Conclusion

During this review, I did not identify SQL injection vulnerabilities in the database operations examined.

The application uses several complementary protections:

1. Zod validates signup input in the frontend.
2. Backend input validation must independently enforce API constraints.
3. Drizzle ORM parameterizes user-provided values in the reviewed database queries.
4. Fixed query structures and allowlisted search criteria prevent arbitrary user input from becoming SQL identifiers or query fragments.

The production login tests showed that malformed email inputs were rejected by validation before reaching the database. The source-code review of Drizzle query construction provided the stronger evidence for SQL injection prevention.

This was a focused review of the inspected endpoints and services, not an exhaustive penetration test of every endpoint, database function, dependency, or possible SQL injection technique.

The conclusion is therefore limited to the code paths examined: **no SQL injection vulnerability was identified in the reviewed database operations.**

## References

- [OWASP SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [OWASP Web Security Testing Guide — Testing for SQL Injection](https://owasp.org/www-project-web-security-testing-guide/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [Zod Documentation](https://zod.dev/)
