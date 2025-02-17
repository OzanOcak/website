import { eq } from "drizzle-orm";
import { db } from "../db/db-conn";
import { users } from "../db/schema";

// Controller to update user role
export const updateName = async (
  id: string,
  newName: string
): Promise<void> => {
  try {
    const euser = await db
      .update(users)
      .set({ username: newName })
      .where(eq(users.id, Number(id)))
      .execute();
  } catch (error) {
    console.error("Error updating role:", error);
    throw new Error("Database error"); // Throw an error to be caught in the controller
  }
};
