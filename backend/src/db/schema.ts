import { relations } from "drizzle-orm";
import {
  bigint,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }), // Optional for OAuth users
  role: varchar("role", { length: 10 }).default("user").notNull(),
});

export const website_visits = pgTable("website_visits", {
  id: integer("id").notNull().primaryKey(), // not serial cuz no need increase by 1
  total_visits: bigint("total_visits", { mode: "number" }).default(0).notNull(),
});

export const likes = pgTable("likes", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull(), // Slug of the post being liked
  likes_count: integer("likes_count").default(0).notNull(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  content: varchar("content", { length: 255 }).notNull(), // The comment text
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // User who posted the comment
  blogId: varchar("blog_id", { length: 255 }).notNull(), // Blog ID the comment belongs to
  likeCount: integer("like_count").default(0).notNull(), // Number of likes on the comment
  createdAt: timestamp("created_at").defaultNow().notNull(), // Timestamp of when the comment was created
});

export const oauth_identities = pgTable("oauth_identities", {
  id: serial("id").primaryKey(),
  provider: varchar("provider", { length: 50 }).notNull(), // e.g., 'google', 'github'
  providerId: varchar("provider_id", { length: 255 }).notNull(), // Unique ID from the provider
  profilePicture: varchar("profile_picture", { length: 512 }), // Add this column for the profile picture URL
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // Link to the users table
});

export const tokens = pgTable("tokens", {
  id: serial("id").primaryKey(),
  tokenId: varchar("refresh_token_id", { length: 255 }).notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const usersRelations = relations(users, ({ many }) => ({
  tokens: many(tokens),
  oauthIdentities: many(oauth_identities),
  likes: many(likes),
  comments: many(comments),
}));

// While cascading deletes do not reduce the number of queries, they can improve performance in some cases:
