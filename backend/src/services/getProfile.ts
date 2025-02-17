import { eq } from "drizzle-orm";
import { db } from "../db/db-conn";
import { oauth_identities, users } from "../db/schema";

export const getUserProfile = async (
  userId: number
): Promise<{
  username: string;
  email: string;
  id: number;
  role: string;
  profilePicture: string | null;
} | null> => {
  // Replace UserType with the actual type
  try {
    // Fetch user data from the database
    const user = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        profilePicture: oauth_identities.profilePicture, // Fetch the profile picture
      })
      .from(users)
      .leftJoin(oauth_identities, eq(users.id, oauth_identities.userId)) // Join with oauth_identities
      .where(eq(users.id, Number(userId))) // Filter by user ID
      .execute();

    if (user.length === 0) {
      return null; // Return null if the user is not found
    }
    //console.log(user[0]);

    return user[0]; // Return the user data
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Database error"); // Throw an error to be caught in the controller
  }
};
