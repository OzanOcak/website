"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRelations = exports.tokens = exports.oauth_identities = exports.comments = exports.likes = exports.website_visits = exports.users = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    username: (0, pg_core_1.varchar)("username", { length: 50 }).notNull(),
    email: (0, pg_core_1.varchar)("email", { length: 255 }).unique().notNull(),
    password: (0, pg_core_1.varchar)("password", { length: 255 }), // Optional for OAuth users
    role: (0, pg_core_1.varchar)("role", { length: 10 }).default("user").notNull(),
});
exports.website_visits = (0, pg_core_1.pgTable)("website_visits", {
    id: (0, pg_core_1.integer)("id").notNull().primaryKey(), // not serial cuz no need increase by 1
    total_visits: (0, pg_core_1.bigint)("total_visits", { mode: "number" }).default(0).notNull(),
});
exports.likes = (0, pg_core_1.pgTable)("likes", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    slug: (0, pg_core_1.varchar)("slug", { length: 255 }).notNull(), // Slug of the post being liked
    likes_count: (0, pg_core_1.integer)("likes_count").default(0).notNull(),
});
exports.comments = (0, pg_core_1.pgTable)("comments", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    content: (0, pg_core_1.varchar)("content", { length: 255 }).notNull(), // The comment text
    userId: (0, pg_core_1.integer)("user_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }), // User who posted the comment
    blogId: (0, pg_core_1.varchar)("blog_id", { length: 255 }).notNull(), // Blog ID the comment belongs to
    likeCount: (0, pg_core_1.integer)("like_count").default(0).notNull(), // Number of likes on the comment
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(), // Timestamp of when the comment was created
});
exports.oauth_identities = (0, pg_core_1.pgTable)("oauth_identities", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    provider: (0, pg_core_1.varchar)("provider", { length: 50 }).notNull(), // e.g., 'google', 'github'
    providerId: (0, pg_core_1.varchar)("provider_id", { length: 255 }).notNull(), // Unique ID from the provider
    profilePicture: (0, pg_core_1.varchar)("profile_picture", { length: 512 }), // Add this column for the profile picture URL
    userId: (0, pg_core_1.integer)("user_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }), // Link to the users table
});
exports.tokens = (0, pg_core_1.pgTable)("tokens", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    tokenId: (0, pg_core_1.varchar)("refresh_token_id", { length: 255 }).notNull(),
    userId: (0, pg_core_1.integer)("user_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
});
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, ({ many }) => ({
    tokens: many(exports.tokens),
    oauthIdentities: many(exports.oauth_identities),
    likes: many(exports.likes),
    comments: many(exports.comments),
}));
// While cascading deletes do not reduce the number of queries, they can improve performance in some cases:
