import { count, countDistinct, eq, ilike, sql } from "drizzle-orm";
import { db } from "../db/db-conn";
import { users } from "../db/schema";

export const countUsers = async (
  searchQuery: string,
  searchCriteria: string
): Promise<number> => {
  // Base query
  let query = db.select({ value: count() }).from(users);

  // Apply search filter based on criteria
  if (searchQuery) {
    switch (searchCriteria) {
      case "name":
        query = query.where(
          ilike(users.username, `%${searchQuery}%`)
        ) as typeof query;
        break;
      case "email":
        query = query.where(
          ilike(users.email, `%${searchQuery}%`)
        ) as typeof query;
        break;
      case "role":
        query = query.where(eq(users.role, searchQuery)) as typeof query;
        break;
      default:
        break;
    }
  }

  const result = await query;
  return result[0].value;
};
