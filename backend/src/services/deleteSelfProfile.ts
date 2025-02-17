import { eq } from "drizzle-orm";
import { db } from "../db/db-conn";
import { users } from "../db/schema";

export const deleteSelfProfile = async (userId: number): Promise<void> => {
  const id = Number(userId);

  try {
    await db.delete(users).where(eq(users.id, id)).execute();
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Database error"); // Throw an error to be caught in the controller
  }
};
