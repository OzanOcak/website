---
title: Advanced Sql Queries With Drizzle
slug: advanced-sql-queries-with-drizzle
description: Comprehensive guide on learning SQL and drizzle.
imageUrl: /images/1.png
author: ozan
date: 12.09.2024
tags:
  - SQL
  - Drizzle
  - Docker
published: true
---

## Introduction

In modern web development, efficiently managing database interactions is crucial for building responsive applications. Drizzle, a powerful TypeScript ORM, provides developers with a robust toolkit for querying and observing database tables. One of its standout features is the ease of use in executing SQL queries, allowing for seamless data retrieval and manipulation.

### Drizzle-Kit Studio

```bash
npx drizzle-kit studio
```

To streamline your database interactions, you can utilize npx drizzle-kit studio. This tool serves as an interactive environment where you can query and observe your database tables. It simplifies the process of testing and refining your SQL queries, enabling you to visualize the data structure and understand relationships between tables more intuitively.

You can also see database diagram and source code of project in [github](https://github.com/OzanOcak/json-rpc-api)

### execute() vs returning()

When working with Drizzle, you often encounter two primary methods for executing queries: execute() and returning(). Understanding the difference between these methods is essential for effective data handling.

_execute():_ This method is typically used for sending a query to the database and receiving the results directly. It is useful when you need to retrieve data without any specific requirements for the returned format. For example, in an API function like getUserById, you might implement it as follows:

```typescript
getUserById: async (userId: number) => {
  return await db.select().from(user).where(eq(user.id, userId)).execute();
};
```

_returning():_ In contrast, returning() is employed when you want more control over the data you retrieve after performing an operation, such as an insert or update. This method allows you to specify which fields to return, providing a more tailored response based on your application's needs.
By leveraging the capabilities of Drizzle and understanding these methods, you can create advanced SQL queries that enhance your application's performance and user experience. In the following sections, we'll dive deeper into practical examples and best practices for using Drizzle in your projects.

```typescript
const result = await db
  .insert(product)
  .values({
    name: "Coke",
    description: "Coca Cola",
  })
  .returning({
    name: true,
    description: true,
  });
```

### Relations and ORM like Queries

You can also create relations and qury like prisma orm with drizzle.

#### One-to-Many Relationship Example

Example: Users and Orders
In this case, a user can have many orders.

```js
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
}));
```

#### Many-to-Many Relationship Example

Example: Products and Categories
In this case, products can belong to many categories, and categories can have many products.

```js
export const productCategoriesRelations = relations(
  product_categories,
  ({ one, many }) => ({
    product: one(products, {
      fields: [product_categories.product_id],
      references: [products.id],
    }),
    category: one(categories, {
      fields: [product_categories.category_id],
      references: [categories.id],
    }),
  })
);

export const productsRelations = relations(products, ({ many }) => ({
  categories: many(product_categories),
}));
```

#### Sample Queries

One-to-Many Query: Fetching a User's Orders

```js
async function fetchUserOrders(userId) {
  const userWithOrders = await db.users.findOne({
    where: { id: userId },
    include: {
      orders: true, // This will include the orders related to the user
    },
  });
  return userWithOrders;
}
```

Many-to-Many Query: Fetching Products with Their Categories

```js
async function fetchProductCategories(productId) {
  const productWithCategories = await db.products.findOne({
    where: { id: productId },
    include: {
      categories: true, // This will include the categories related to the product
    },
  });
  return productWithCategories;
}
```

The one-to-many relationship example shows how a user can be linked to multiple orders.
The many-to-many relationship example illustrates how products can be associated with multiple categories and vice versa.
Sample queries demonstrate how to fetch related data using these relationships in an ORM-like style.

## Basic

### 1. Basic SELECT Statement

To select all cart items:

```js
db.select().from(cartItems);
```

### 2. SELECT with WHERE Clause

To select cart items for a specific cart ID:

```js
db.select().from(cartItems).where(eq(cartItems.cartId, "your-cart-id")); // UUID
```

### 3. Filtering Results with AND

To select reviews for a specific product by a specific user:

```js
db.select()
  .from(reviews)
  .where(
    and(
      eq(reviews.productId, "your-product-id"), //  UUID
      eq(reviews.userId, "your-user-id") // UUID
    )
  );
```

### 4. Filtering Results with OR

To select reviews that are either from a specific user or have a specific rating:

```js
db.select()
  .from(reviews)
  .where(
    or(
      eq(reviews.userId, "your-user-id"), // UUID
      eq(reviews.rating, 5)
    )
  );
```

### 5. Filtering Results with NOT

To select addresses that do not belong to a specific user:

```js
db.select()
  .from(addresses)
  .where(not(eq(addresses.userId, "your-user-id"))); //UUID
```

Each query uses db.select() to initiate the selection.
The .from() method specifies the table.
The .where() method adds conditions, using eq(), and(), or(), and not() for filtering.
Replace 'your-cart-id-here', 'your-product-id-here', and 'your-user-id-here' with actual UUID values as needed.

### 6. Sorting Results with ORDER BY

To select all reviews and sort them by rating in descending order:

```js
db.select().from(reviews).orderBy(desc(reviews.rating)); // Sort by rating in descending order
```

### 7. Combining ORDER BY with LIMIT

To select the top 5 highest-rated reviews for a specific product:

```js
db.select()
  .from(reviews)
  .where(eq(reviews.productId, "your-product-id")) // Replace with actual UUID
  .orderBy(desc(reviews.rating)) // Sort by rating in descending order
  .limit(5); // Limit to 5 results
```

### 8. Sorting with Multiple Columns

To select cart items and sort them first by quantity in ascending order and then by productId in descending order:

```js
db.select().from(cartItems).orderBy(
  asc(cartItems.quantity), // Sort by quantity in ascending order
  desc(cartItems.productId) // Then by productId in descending order
);
```

The .orderBy() method is used to specify the sorting criteria. You can use asc() for ascending order and desc() for descending order.
The .limit() method restricts the number of results returned.
Replace 'your-product-id-here' with the actual UUID when executing the queries.

### 9. Using Aggregate Functions

COUNT()
To count the number of reviews for a specific product:

```js
db.select({
  count: countDistinct(reviews.id), // Count the number of review IDs
})
  .from(reviews)
  .where(eq(reviews.productId, "your-product-id")); // Replace with actual UUID
```

SUM();
To calculate the total amount of payments made:

```js
const totalPayments = await db
  .select({
    total: sum(payments.amount), // Sum of all payment amounts
  })
  .from(payments)
  .execute();
```

AVG();
To calculate the average rating for a specific product:

```js
const averageRating = await db
  .select({
    average: avg(reviews.rating), // Average of ratings
  })
  .from(reviews)
  .where(eq(reviews.productId, "your-product-id-here")) // Replace with actual UUID
  .execute();
```

MIN()
To find the minimum payment amount:

```js
const minPayment = await db
  .select({
    minimum: min(payments.amount), // Minimum payment amount
  })
  .from(payments)
  .execute();
```

MAX()
To find the maximum rating for a specific product:

```js
const maxRating = await db
  .select({
    maximum: max(reviews.rating), // Maximum rating
  })
  .from(reviews)
  .where(eq(reviews.productId, "your-product-id-here")) // Replace with actual UUID
  .execute();
```

### 10. Grouping Results with GROUP BY

To group reviews by user and count how many reviews each user has made:

```js
db.select({
  userId: reviews.userId,
  reviewCount: count(reviews.id), // Count reviews for each user
})
  .from(reviews)
  .groupBy(reviews.userId); // Group by userId
```

### 11. Filtering Groups with HAVING

To find users who have made more than 3 reviews:

```js
db.select({
  userId: reviews.userId,
  reviewCount: count(reviews.id), // Count reviews for each user
})
  .from(reviews)
  .groupBy(reviews.userId) // Group by userId
  .having(gt(count(reviews.id), 3)); // Filter groups with more than 3 reviews
```

Use count(), sum(), avg(), min(), and max() to perform aggregate calculations.
The .groupBy() method is used to group results based on specified columns.
The .having() method allows filtering of grouped results, using conditions like gt() (greater than).
Replace 'your-product-id-here' with actual UUID values as needed.

## Intermediate

### 12. Inner Join

To select cart items along with the associated products:

```js
db.select()
  .from(cartItems)
  .innerJoin(products, eq(cartItems.productId, products.id)); // Join with products table
```

### 13. Left Join

To select all cart items and their associated products, including cart items that may not have a corresponding product:

```js
db.select()
  .from(cartItems)
  .leftJoin(products, eq(cartItems.productId, products.id));
```

### 14. Right Join

To select all products and their associated cart items, including products that may not have been added to any cart:

```js
db.select()
  .from(products)
  .rightJoin(cartItems, eq(cartItems.productId, products.id));
```

### 15. Full Outer Join

To select all cart items and products, including those that may not have matches in either table:

```js
db.select()
  .from(cartItems)
  .fullOuterJoin(products, eq(cartItems.productId, products.id));
```

Each query uses the .select() method to initiate the selection.
The .from() method specifies the primary table, while the join methods (innerJoin, leftJoin, rightJoin, fullOuterJoin, and crossJoin) specify how to combine it with other tables.
The eq() function is used to define the condition for joining tables.

### 16. Nested Subqueries Queries

To find all products that have reviews with an average rating above 4.0:

```js
db.select()
  .from(products)
  .where(
    inArray(
      products.id,
      db
        .select({ productId: avg(reviews.rating) })
        .from(reviews)
        .groupBy(reviews.productId)
        .having(gt(avg(reviews.rating), 4.0))
    )
  );
```

### 17. Correlated Subqueries

To find all users who have written reviews for products with an average rating above 4.0:

```js
db.select()
  .from(users)
  .where(
    exists(
      db
        .select()
        .from(reviews)
        .where(
          eq(reviews.userId, users.id), // Correlated subquery linking userId
          inArray(
            reviews.productId,
            db
              .select({ productId: avg(reviews.rating) })
              .from(reviews)
              .groupBy(reviews.productId)
              .having(gt(avg(reviews.rating), 4.0))
          )
        )
    )
  );
```

Nested Queries: The first example uses a subquery to find product IDs that have an average rating greater than 4.0. The outer query then retrieves products that match these IDs using inArray().
Correlated Subqueries: The second example retrieves users who have written reviews for products with an average rating above 4.0. The subquery correlates to the outer query by using users.id to link to reviews.userId.

### 18. UNION

To combine results from two different queries (e.g., retrieves user IDs from both reviews and wishlists):

```js
db.select({ userId: reviews.userId })
  .from(reviews)
  .union(db.select({ userId: wishlists.userId }).from(wishlists)); // get user IDs from wishlists
```

### 19. UNION ALL

To combine results from two different queries without removing duplicates (e.g., retrieves all user IDs from reviews and wishlists):

```js
db.select({ userId: reviews.userId })
  .from(reviews)
  .unionAll(
    db.select({ userId: wishlists.userId }).from(wishlists) // get user IDs from wishlists
  );
```

### 20. INTERSECT

To find user IDs that exist in both reviews and wishlists:

```js
db.select({ userId: reviews.userId })
  .from(reviews)
  .intersect(
    db.select({ userId: wishlists.userId }).from(wishlists) //  get user IDs from wishlists
  );
```

### 21. EXCEPT

To find user IDs from reviews that do not exist in wishlists:

```js
db.select({ userId: reviews.userId })
  .from(reviews)
  .except(
    db.select({ userId: wishlists.userId }).from(wishlists) // get user IDs from wishlists
  );
```

UNION: Combines the results of two queries while removing duplicates.
UNION ALL: Combines the results of two queries without removing duplicates.
INTERSECT: Retrieves common results from two queries.
EXCEPT: Retrieves results from the first query that do not exist in the second query.

### 22. INSERT Statements

Inserting a New Cart Item
To insert a new item into the cart_items table:

```js
db.insert(product).values({
  name: "Coke",
  description: "Coca Cola",
  price: 1.99,
  stockQuantity: 120,
});
```

### 23. UPDATE Statements

Updating a Review
To update the comment and rating of a specific review:

```js
db.update(reviews)
  .set({
    rating: 5, // New rating
    comment: "Updated comment text.", // Updated comment
  })
  .where(eq(reviews.id, "your-review-id-here")); // Replace with actual UUID
```

### 24. DELETE Statements

Deleting a Wishlist Item
To delete a specific item from the wishlist_items table:

```js
db.delete(wishlistItems).where(
  eq(wishlistItems.id, "your-wishlist-item-id-here")
); // Replace with actual UUID
```

Explanation
INSERT: The insert() method is used to add a new record to a table. The .values() method specifies the data to be inserted.
UPDATE: The update() method modifies existing records in a table. The .set() method specifies the new values, and the .where() method identifies which record to update.
DELETE: The delete() method removes records from a table. The .where() method specifies which record(s) to delete.

Understanding ACID Properties
ACID stands for:

Atomicity: Transactions are all-or-nothing. If one part of the transaction fails, the entire transaction fails.
Consistency: Transactions must leave the database in a consistent state, adhering to all rules and constraints.
Isolation: Transactions should not interfere with one another. Each transaction operates independently.
Durability: Once a transaction is committed, it remains so, even in the event of a system failure.
COMMIT and ROLLBACK Statements
In Drizzle ORM, you can manage transactions using COMMIT and ROLLBACK to ensure that your operations adhere to ACID properties.

### 25.Transaction

```js
db.transaction();

try {
  // Insert a new cart item
  await transaction
    .insert(cartItems)
    .values({
      id: "your-cart-item-uuid", // Replace with actual UUID
      cartId: "your-cart-id", // Replace with actual UUID
      productId: "your-product-id", // Replace with actual UUID
      quantity: 1,
    })
    .execute();

  // Update a product's stock (for example)
  await transaction
    .update(products)
    .set({ stock: decrement(products.stock, 1) }) // Decrease stock by 1
    .where(eq(products.id, "your-product-id")) // Replace with actual UUID
    .execute();

  // Commit the transaction
  await transaction.commit();
} catch (error) {
  console.error("Transaction failed:", error);
  // Rollback the transaction in case of error
  await transaction.rollback();
}
```

### 26.Savepoints

Savepoints allow you to set a point within a transaction to which you can roll back without affecting the entire transaction.

Example of Using Savepoints

```js
db.transaction();

try {
  // Start the transaction
  await transaction.begin();

  // Insert a new cart item
  await transaction
    .insert(cartItems)
    .values({
      id: "your-cart-item-uuid", // Replace with actual UUID
      cartId: "your-cart-id", // Replace with actual UUID
      productId: "your-product-id", // Replace with actual UUID
      quantity: 1,
    })
    .execute();

  // Create a savepoint
  await transaction.savepoint("afterInsert");

  // Update a product's stock
  await transaction
    .update(products)
    .set({ stock: decrement(products.stock, 1) }) // Decrease stock by 1
    .where(eq(products.id, "your-product-id")) // Replace with actual UUID
    .execute();

  // If something goes wrong, roll back to the savepoint
  // Uncomment to simulate error handling
  // throw new Error('Simulated error');

  // Commit the transaction if everything is fine
  await transaction.commit();
} catch (error) {
  console.error("Transaction failed:", error);
  // Rollback to the savepoint if needed
  await transaction.rollbackTo("afterInsert");
  // Or rollback the entire transaction
  // await transaction.rollback();
}
```

Explanation
COMMIT: Saves all changes made during the transaction. In the example, if all operations succeed, the transaction is committed.
ROLLBACK: Reverts any changes made during the transaction if an error occurs. You can roll back to the last savepoint or the entire transaction.
Savepoints: Allow you to set a point within a transaction. If an error occurs after a savepoint, you can roll back to that point rather than starting over from the beginning.

### 27. Indexes

What Are Indexes?
Indexes are special database structures that improve the speed of data retrieval operations on a database table. They work similarly to an index in a book, allowing the database to find and access data without scanning every row in the table.

Benefits of Indexes
Faster Query Performance: Indexes can significantly reduce the time it takes to retrieve data, especially for large tables.
Efficient Sorting: They help speed up the sorting of results, particularly when using ORDER BY clauses.
Improved Filtering: Indexes enhance the performance of queries that filter data using WHERE clauses.
Creating and Dropping Indexes
In Drizzle ORM, you can create and drop indexes using the following methods:

Creating an Index
To create an index on a specific column (e.g., on the productId column in the reviews table):

```js
await db.schema.createIndex("idx_reviews_productId", reviews, {
  columns: [reviews.productId],
});
```

This creates an index named idx_reviews_productId on the productId column of the reviews table.

Dropping an Index
To drop an index when it's no longer needed:

```js
await db.schema.dropIndex("idx_reviews_productId");
```

This removes the index named idx_reviews_productId.

Impact of Indexes on Performance
While indexes can greatly improve read performance, they also have some trade-offs:

Positive Impacts
Faster Query Execution: Queries that use indexed columns in WHERE, JOIN, and ORDER BY clauses run faster.
Reduced I/O Operations: Indexes allow the database to read only the relevant rows instead of scanning the entire table.
Negative Impacts
Slower Write Operations: Insert, update, and delete operations can slow down because the database must also update the index.
Increased Storage Space: Indexes consume additional disk space, which can be significant for large tables or multiple indexes.
Conclusion
Indexes are powerful tools for enhancing database performance, especially for read-heavy applications. However, it's crucial to balance the benefits of faster query performance against the overhead they introduce for write operations and storage requirements. Careful planning and analysis are necessary to determine when and where to use indexes effectively.

## Advanced

### Views in Databases

Views are virtual tables that provide a way to represent the result of a query as if it were a table. They can simplify complex queries, enhance security by restricting access to certain data, and allow users to work with a simplified representation of the data.

#### Creating and Using Views

Creating a View
To create a view in Drizzle ORM, you can define it based on a query. For example, creating a view to show the average rating of each product:

```js
await db.schema.createView("product_average_ratings", {
  select: {
    productId: reviews.productId,
    averageRating: avg(reviews.rating),
  },
  from: reviews,
  groupBy: reviews.productId,
});
```

This creates a view named product_average_ratings that calculates the average rating for each product.

#### Using a View

To query data from a view:

```js
const productRatings = await db
  .select()
  .from("product_average_ratings")
  .execute();
```

This retrieves the average ratings from the product_average_ratings view.

#### Updatable Views

Updatable views allow you to perform INSERT, UPDATE, and DELETE operations on the view, which will affect the underlying tables. However, not all views are updatable. A view is typically updatable if it meets certain conditions, such as:

It is based on a single table.
It does not include aggregate functions.
It does not use DISTINCT, GROUP BY, or HAVING.
Example of an Updatable View
If you create a simple view on the reviews table:

```js
await db.schema.createView("user_reviews", {
  select: {
    id: reviews.id,
    userId: reviews.userId,
    productId: reviews.productId,
    rating: reviews.rating,
    comment: reviews.comment,
  },
  from: reviews,
});
```

You can update the view:

```js
await db
  .update("user_reviews")
  .set({ rating: 4 }) // Update the rating
  .where(eq("id", "your-review-id-here")) // Specify the review ID
  .execute();
```

#### Materialized Views

Materialized views are similar to regular views but store the result of the query physically. This allows for faster access to data, as the results do not need to be recalculated on each query. However, they require maintenance to keep the data up to date.

#### Creating a Materialized View

To create a materialized view (if supported by the database), you might use a command like this (note that Drizzle ORM may not directly support creating materialized views, and you may need to use raw SQL):

``sql
CREATE MATERIALIZED VIEW product_ratings_mv AS
SELECT productId, AVG(rating) AS averageRating
FROM reviews
GROUP BY productId;

```
#### Refreshing a Materialized View
To update the data in a materialized view, you typically need to refresh it:

``sql
REFRESH MATERIALIZED VIEW product_ratings_mv;
```

#### Conclusion

Views: Simplify complex queries and provide a secure interface to the data.
Updatable Views: Allow data manipulation through the view, affecting the underlying tables.
Materialized Views: Store query results physically for faster access, requiring periodic refreshes to update the data.
Using views effectively can enhance both performance and security in your database applications!
