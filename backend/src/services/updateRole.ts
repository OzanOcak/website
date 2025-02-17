import { eq } from "drizzle-orm";
import { db } from "../db/db-conn";
import { users } from "../db/schema";

// Controller to update user role
export const updateRole = async (
  id: string,
  newRole: string
): Promise<void> => {
  const validRoles = ["user", "admin", "editor"]; // Define valid roles

  if (!validRoles.includes(newRole)) {
    throw new Error("Invalid role"); // Throw an error if the role is invalid
  }

  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(id)))
      .execute();

    if (!user.length) {
      throw new Error("User not found"); // Throw an error if the user is not found
    }

    const euser = await db
      .update(users)
      .set({ role: newRole })
      .where(eq(users.id, Number(id)))
      .execute();
  } catch (error) {
    console.error("Error updating role:", error);
    throw new Error("Database error"); // Throw an error to be caught in the controller
  }
};
