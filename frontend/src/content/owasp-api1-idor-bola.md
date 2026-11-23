---
title: "OWASP API1:2023 — IDOR and Broken Object Level Authorization (BOLA)"
slug: owasp-api1-idor-bola
description: A practical investigation of Broken Object Level Authorization (BOLA), demonstrating how authenticated users can modify other users' resources through insecure API endpoints. Covers IDOR, horizontal privilege escalation, multi-account testing with curl, PostgreSQL verification, production validation, and server-side authorization fixes.
imageUrl: /images/6.webp
author: o. ocak
date: 20.11.2026
tags:
  - OWASP
  - API Security
  - BOLA
  - IDOR
  - Broken Access Control
  - Authorization
  - Node.js
  - Express
  - PostgreSQL
published: true
---

## 1. Introduction

Imagine you're using an online healthcare platform. You log in and open your medical records:

```http
GET /api/patients/12345/medical-records
Authorization: Bearer YOUR_ACCESS_TOKEN
```

The API returns your medical history.

Now imagine changing `12345` to `12346`:

```http
GET /api/patients/12346/medical-records
Authorization: Bearer YOUR_ACCESS_TOKEN
```

If the server returns another patient's medical records, you have discovered an authorization vulnerability.

You didn't steal another user's password, bypass authentication, or exploit SQL injection. You simply changed an identifier in a legitimate request.

This is an example of **Insecure Direct Object Reference (IDOR)**, commonly discussed in API security as **Broken Object Level Authorization (BOLA)**.

OWASP classifies BOLA as API1:2023, the first entry in its API Security Top 10.

The core problem is simple:

**The application authenticates the user but fails to verify whether that user is authorized to access the requested object.**

## 2. Authentication vs. Authorization

These concepts are related but serve different purposes.

| Concept                    | Question                               | Example                                 |
| -------------------------- | -------------------------------------- | --------------------------------------- |
| Authentication             | Who are you?                           | Is this a valid JWT?                    |
| Authorization              | What can you access?                   | Can you access patient 12345's records? |
| Object-level authorization | Can you access this specific resource? | Does this medical record belong to you? |

A valid JWT proves the identity associated with the token. It does not automatically grant access to every resource in the database.

For example:

- Alice has a valid account and JWT.
- Bob has a valid account and JWT.
- Alice owns user ID `21`.
- Bob owns user ID `22`.

Alice should not be able to modify Bob's profile just because she knows his ID.

## 3. How IDOR works

Consider this endpoint:

```http
PATCH /api/profile/22/name
Authorization: Bearer ALICE_TOKEN
Content-Type: application/json

{
  "newName": "Modified Name"
}
```

A vulnerable backend might implement the update like this:

```typescript
const userId = req.params.userId;
const { newName } = req.body;

await db
  .update(users)
  .set({ username: newName })
  .where(eq(users.id, Number(userId)));
```

The database query updates whichever user ID the client supplies.

There is no ownership check.

The server knows Alice is authenticated, but it never checks whether Alice owns user ID 22.

The result is unauthorized modification of Bob's profile.

### Common IDOR locations

Object identifiers can appear in different parts of an HTTP request:

| Location          | Example                       |
| ----------------- | ----------------------------- |
| URL path          | `/api/users/22`               |
| Query parameter   | `/api/invoices?id=500`        |
| Request body      | `{"userId":22}`               |
| File reference    | `/api/documents/893/download` |
| Nested resource   | `/api/orders/500/items/12`    |
| GraphQL arguments | `user(id: 22)`                |

IDOR is not limited to sequential numeric IDs. UUIDs, usernames, filenames and other identifiers can also be vulnerable.

### Sequential IDs vs. UUIDs

Sequential IDs can make resource enumeration easier.

For example:

```text
/api/users/101
/api/users/102
/api/users/103
/api/users/104
```

An attacker may be able to guess other resource identifiers by incrementing or decrementing a number.

UUIDs make guessing substantially harder. A UUIDv4 contains 122 random bits, making blind enumeration impractical when generated correctly.

However, UUIDs do not solve authorization.

If an attacker obtains another user's UUID through an API response, frontend state, shared link, or another endpoint, the same authorization vulnerability may still exist.

The important distinction is:

- Sequential IDs make identifiers easier to guess.
- UUIDs make identifiers harder to guess.
- Object-level authorization determines whether a user is allowed to access a resource.

For self-service operations, an even better design is often to avoid accepting a user ID from the client altogether and derive it from the authenticated identity.

## 4. Real-world scenario: Healthcare platform

Consider a hypothetical healthcare platform.

Each patient has:

- A patient ID.
- Medical records.
- Prescriptions.
- Appointment history.
- Laboratory results.

The API exposes:

```http
GET /api/patients/{patientId}/records
GET /api/patients/{patientId}/prescriptions
GET /api/patients/{patientId}/appointments
```

A patient authenticates and receives a JWT.

The backend verifies the JWT but uses the patient ID supplied in the URL without checking ownership.

An attacker with their own legitimate account could attempt:

```bash
curl -i \
  -H "Authorization: Bearer $ATTACKER_TOKEN" \
  "$BASE_URL/patients/12346/records"
```

If the server returns another patient's medical records, this is unauthorized information disclosure.

The consequences could include:

- Exposure of personal information.
- Disclosure of medical history.
- Access to prescription information.
- Unauthorized modification of appointments.
- Potential privacy and regulatory consequences.

This example is illustrative, not a claim about how any particular healthcare breach occurred.

## 5. Horizontal and vertical privilege escalation

IDOR commonly leads to horizontal privilege escalation.

### Horizontal privilege escalation

One ordinary user accesses another ordinary user's resources.

```text
Alice (User ID 21)
       |
       | Uses her own JWT
       |
       v
GET /api/users/22
       |
       v
Bob's private information
```

Alice has not become an administrator. She has accessed another user's resource.

### Vertical privilege escalation

A user gains access to functionality intended for a higher privilege level.

For example:

```http
PATCH /api/admin/users/22/role
```

If an ordinary user can change their own role to `admin`, that is a privilege escalation caused by broken function-level or property-level authorization, depending on the implementation.

The distinction matters:

- **BOLA:** Can Alice access Bob's object?
- **BFLA:** Can Alice execute an administrative function?
- **Privilege escalation:** Can Alice obtain permissions she should not have?

These vulnerabilities can overlap, but they describe different authorization failures.

## 6. Practical testing with curl

Now let's reproduce the issue using two accounts in a local application.

We will use:

- User A: Alice, ID `21`.
- User B: Bob, ID `22`.
- Alice's access token.
- Bob's access token.
- A local Express API.
- PostgreSQL for verifying database changes.

**Only run these tests against your own application or an environment you are authorized to test.**

### Step 1 — Configure the environment

Set the API URL:

```bash
export BASE_URL="http://localhost:3000/api"
```

Set the account credentials using your existing local test accounts:

```bash
export USER_A_EMAIL="alice@example.com"
export USER_B_EMAIL="bob@example.com"

export USER_A_PASSWORD="YOUR_LOCAL_TEST_PASSWORD"
export USER_B_PASSWORD="YOUR_LOCAL_TEST_PASSWORD"
```

These are placeholders. Use the credentials of your existing test accounts.

### Step 2 — Authenticate User A

Login and capture the response headers without printing the access token:

```bash
curl -sS \
  -D /tmp/a01-login-a.headers \
  -o /tmp/a01-login-a.json \
  -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d "$(jq -n \
    --arg email "$USER_A_EMAIL" \
    --arg password "$USER_A_PASSWORD" \
    '{email:$email,password:$password}')"
```

Extract the JWT:

```bash
export USER_A_TOKEN=$(
  awk 'tolower($1)=="authorization:" {
    sub(/\r$/, "");
    sub(/^Bearer /, "");
    print
  }' /tmp/a01-login-a.headers
)
```

Check that the token was captured:

```bash
echo "User A token length: ${#USER_A_TOKEN}"
```

The token should not be empty.

### Step 3 — Authenticate User B

```bash
curl -sS \
  -D /tmp/a01-login-b.headers \
  -o /tmp/a01-login-b.json \
  -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d "$(jq -n \
    --arg email "$USER_B_EMAIL" \
    --arg password "$USER_B_PASSWORD" \
    '{email:$email,password:$password}')"
```

Extract the token:

```bash
export USER_B_TOKEN=$(
  awk 'tolower($1)=="authorization:" {
    sub(/\r$/, "");
    sub(/^Bearer /, "");
    print
  }' /tmp/a01-login-b.headers
)
```

Check it:

```bash
echo "User B token length: ${#USER_B_TOKEN}"
```

**Note:** The application's access JWT expires after 15 minutes. Log in again if you receive an expired-token response.

### Step 4 — Confirm both accounts in PostgreSQL

Connect to your database:

```bash
docker exec -it websitedb_container2 \
  psql -U postgres -d database
```

Run:

```sql
SELECT id, username, email, role
FROM users
WHERE id IN (21, 22);
```

Expected starting state:

| ID  | Username   | Role |
| --- | ---------- | ---- |
| 21  | a01_test_a | user |
| 22  | a01_test_b | user |

Use the actual IDs and usernames returned by your database if they differ.

Exit PostgreSQL:

```sql
\q
```

### Step 5 — Test normal access

Alice requests her own profile:

```bash
curl -i \
  "$BASE_URL/profile" \
  -H "Authorization: Bearer $USER_A_TOKEN"
```

Expected:

```http
HTTP/1.1 200 OK
```

This confirms Alice can access her own profile.

### Step 6 — Attempt to modify Bob's profile using Alice's token

Your vulnerable endpoint is:

```http
PATCH /api/profile/:userId/name
```

Try modifying Bob's username using Alice's JWT:

```bash
curl -i \
  -X PATCH "$BASE_URL/profile/22/name" \
  -H "Authorization: Bearer $USER_A_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"newName":"a01_test_b_modified_by_a"}'
```

A vulnerable implementation might respond:

```http
HTTP/1.1 200 OK
```

```json
{
  "message": "User name updated successfully"
}
```

But HTTP 200 alone does not prove the vulnerability.

We must verify the actual database state.

### Step 7 — Verify the modification in PostgreSQL

```bash
docker exec -it websitedb_container2 \
  psql -U postgres -d database \
  -c "SELECT id, username FROM users WHERE id IN (21,22);"
```

If the result is:

```text
 id | username
----+--------------------------
 21 | a01_test_a
 22 | a01_test_b_modified_by_a
```

Then we have confirmed that Alice modified Bob's record using her own token.

This is a horizontal authorization failure:

**User A modified User B's resource without authorization.**

If the database did not change, investigate the actual update operation before reporting a vulnerability.

### Step 8 — Test the reverse direction

Bob should be able to modify his own profile:

```bash
curl -i \
  -X PATCH "$BASE_URL/profile/22/name" \
  -H "Authorization: Bearer $USER_B_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"newName":"a01_test_b"}'
```

This is a positive authorization test.

An authorization system must not simply block everybody. It must allow legitimate access and deny unauthorized access.

## 7. Production validation: Confirming BOLA in a live application

After examining the local implementation, I performed a separate test against my production application.

The production API was:

```text
https://api.oocak.com/api
```

The vulnerable endpoint was:

```http
PATCH /api/profile/{userId}/name
```

I authenticated using a separate account, `frontendproapp@gmail.com`, and obtained a fresh access JWT.

The account associated with that login had user ID `10`.

I then submitted a request targeting user ID `9`:

```bash
curl -i -X PATCH \
  "https://api.oocak.com/api/profile/9/name" \
  -H "Authorization: Bearer $ACCESS" \
  -H "Content-Type: application/json" \
  -d '{"newName":"bola_test_9"}'
```

The API returned:

```json
{
  "message": "User name updated successfully"
}
```

A successful response alone would not have been sufficient evidence.

I checked the target account in the production application's UI and confirmed that its name had changed.

### Finding

| Property              | Observation                   |
| --------------------- | ----------------------------- |
| Environment           | Production                    |
| Authenticated account | User ID 10                    |
| Target account        | User ID 9                     |
| HTTP method           | PATCH                         |
| Endpoint              | `/api/profile/9/name`         |
| Authentication        | Successful                    |
| Authorization         | Failed                        |
| Result                | Target account's name changed |

This demonstrated a cross-account modification through an authenticated API request.

The vulnerability was not caused by a missing JWT or an authentication bypass. The API accepted a valid authenticated request but failed to enforce object-level ownership.

The separate account used to perform the test was subsequently deleted.

**Important distinction:** Deleting the test account is cleanup. It does not establish that every outstanding token or session associated with that account was revoked. Session revocation must be verified separately.

This production test complements the local reproduction: the local lab illustrates the vulnerable implementation, while the production test demonstrates its impact in a deployed application.

## 8. How to fix IDOR

The correct solution is server-side object-level authorization.

For self-service profile operations, the client should not supply the user ID.

### Before

```typescript
router.patch(
  "/profile/:userId/name",
  authenticate,
  checkPermissionsToAuthorize("edit_self_user_name"),
  updateUserSelfName,
);
```

### After

```typescript
router.patch(
  "/profile/name",
  authenticate,
  checkPermissionsToAuthorize("edit_self_user_name"),
  updateUserSelfName,
);
```

Now the controller derives the user ID from the authenticated request.

```typescript
const updateUserSelfName = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;
    const { newName } = req.body;

    if (!userId) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    await updateName(userId, newName);

    res.status(200).json({
      message: "User name updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to update user name",
    });
  }
};
```

The service uses the authenticated ID:

```typescript
const updateName = async (userId: number, newName: string) => {
  return db
    .update(users)
    .set({ username: newName })
    .where(eq(users.id, userId));
};
```

The important change is that the client can no longer select another user's ID through this endpoint.

The example assumes `req.userId` is populated by trusted authentication middleware and has the expected type. Input validation and database error handling should also be implemented.

### What about resources that have their own IDs?

Consider a blog post.

A user may legitimately edit a post, but only if they own it or have another authorized role.

The database query should enforce both the object ID and ownership:

```typescript
await db
  .update(posts)
  .set({ title: newTitle })
  .where(and(eq(posts.id, postId), eq(posts.userId, authenticatedUserId)));
```

This is important because not every resource is a user's profile.

For more complex systems, authorization may depend on:

- Ownership.
- Organization or tenant membership.
- Resource sharing.
- Roles and permissions.
- Resource state.
- Relationships between users and resources.

The authorization policy must reflect the application's actual business rules.

## 9. Retest after the fix

After changing the route, the old endpoint should no longer be available for self-service profile updates.

Attempt the old request:

```bash
curl -i \
  -X PATCH "$BASE_URL/profile/22/name" \
  -H "Authorization: Bearer $USER_A_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"newName":"unauthorized_change"}'
```

Expected: the old route is rejected, typically with `404 Not Found` if it has been removed.

The new endpoint should work for Alice:

```bash
curl -i \
  -X PATCH "$BASE_URL/profile/name" \
  -H "Authorization: Bearer $USER_A_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"newName":"a01_test_a_updated"}'
```

Expected:

```http
HTTP/1.1 200 OK
```

Verify the database:

```bash
docker exec -it websitedb_container2 \
  psql -U postgres -d database \
  -c "SELECT id, username FROM users WHERE id IN (21,22);"
```

Only Alice's record should have changed.

For other resources that still accept client-supplied identifiers, test the ownership policy directly rather than assuming that removing the profile route fixes every BOLA issue.

## 10. Authorization testing matrix

A good security test suite should cover more than one endpoint and more than one HTTP method.

| Test                                      | Expected result |
| ----------------------------------------- | --------------- |
| Alice reads Alice's profile               | 200             |
| Alice reads Bob's private profile         | 403/404         |
| Alice updates Alice's profile             | 200             |
| Alice updates Bob's profile               | 403/404         |
| Alice deletes Bob's profile               | 403/404         |
| Bob updates Bob's profile                 | 200             |
| Ordinary user changes another user's role | 403/404         |
| Anonymous user accesses private profile   | 401             |

For write operations, verify database state as well as the HTTP response.

A 403 or 404 is not enough if the server already performed the unauthorized operation.

## 11. Why automated scanners can miss IDOR

Tools such as OWASP ZAP are useful for identifying many web application vulnerabilities.

However, IDOR often requires multiple authenticated identities and knowledge of resource ownership.

For example, a scanner might discover:

```http
PATCH /api/profile/22/name
```

But it does not necessarily know:

- Which user owns ID 22.
- Which account is making the request.
- Whether the account is permitted to modify that record.
- Whether a successful response actually changed another user's data.

This is why multi-user authorization testing is important.

A practical testing strategy combines:

1. **DAST:** Dynamic application security testing with ZAP.
2. **Code review:** Examining controllers, services and database queries.
3. **Multi-user testing:** Using separate accounts to test ownership.
4. **Database verification:** Confirming whether unauthorized changes occurred.
5. **Regression tests:** Ensuring the same vulnerability does not return.

## 12. Common mistakes when fixing IDOR

**Mistake 1: Using UUIDs instead of numeric IDs**

UUIDs make enumeration harder, but they do not enforce authorization. If an attacker obtains another user's UUID, the same vulnerability can still exist.

**Mistake 2: Checking authentication only**

A valid JWT proves identity. It does not prove ownership of the requested object.

**Mistake 3: Checking roles but not ownership**

A permission such as `edit_self_user_name` determines whether a user can perform a type of operation. It does not determine which user's name they can modify.

**Mistake 4: Hiding buttons in the frontend**

Removing an Edit button from the interface does not protect the API. Attackers can send requests directly with curl.

**Mistake 5: Checking only GET requests**

Unauthorized write and delete operations can be just as serious as unauthorized reads.

**Mistake 6: Trusting the HTTP status code**

A server might return an error after performing a database operation. Always verify the actual result.

**Mistake 7: Assuming one fixed endpoint means the entire application is secure**

Fixing one vulnerable endpoint does not automatically protect other routes that accept resource identifiers. Each resource operation needs the appropriate authorization policy.

## 13. Conclusion

IDOR is not primarily an authentication problem. It is an authorization problem.

The server must validate that the authenticated user has permission to perform the requested operation on the specific resource.

For APIs, this check must happen wherever client-controlled identifiers are used to retrieve, modify or delete objects.

The practical testing process demonstrated three important things:

- A valid authentication token does not guarantee object ownership.
- A successful HTTP response must be followed by verification of the actual operation.
- Testing with multiple identities can reveal authorization failures that ordinary single-account testing misses.

The most useful security principle is:

**Never trust a resource ID supplied by the client as proof of ownership or authorization.**

---

## References

- [OWASP API1:2023 — Broken Object Level Authorization](https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [PortSwigger — Insecure Direct Object References](https://portswigger.net/web-security/access-control/idor)
- [PortSwigger — Access Control and Privilege Escalation](https://portswigger.net/web-security/access-control)
