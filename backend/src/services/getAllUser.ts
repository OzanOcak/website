import { eq, ilike } from "drizzle-orm";
import { db } from "../db/db-conn";
import { users } from "../db/schema";

export type User = {
  id: number;
  username: string;
  email: string; // Add this if it's missing
  password: string | null; // Allow password to be null
  role: string;
};

export const getAllUsers = async (
  page: number,
  limit: number,
  searchQuery: string,
  searchCriteria: string
): Promise<User[]> => {
  try {
    const offset = (page - 1) * limit; // Calculate the offset

    // Base query
    let query = db.select().from(users);

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

    // Add pagination
    const result = await query.limit(limit).offset(offset);
    return result as User[]; // Type assertion for the result
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Error fetching users"); // Throw an error if something goes wrong
  }
};
