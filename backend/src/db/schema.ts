import { relations } from "drizzle-orm";
import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }), // Optional for OAuth users
  role: varchar("role", { length: 10 }).default("user").notNull(),
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
}));

// While cascading deletes do not reduce the number of queries, they can improve performance in some cases:
