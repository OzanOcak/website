import { eq } from "drizzle-orm";
import { db } from "../db/db-conn";
import { users } from "../db/schema";

export const deleteProfile = async (userId: number): Promise<void> => {
  const id = Number(userId);

  try {
    // Check if the user exists
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .execute();

    if (!user.length) {
      throw new Error("User not found");
    }

    //await db.delete(tokens).where(eq(tokens.userId, id)).execute();
    //await db.delete(oauth_identities).where(eq(oauth_identities.userId, id));

    await db.delete(users).where(eq(users.id, id)).execute();
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Database error"); // Throw an error to be caught in the controller
  }
};
