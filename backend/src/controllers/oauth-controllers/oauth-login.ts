import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db } from "../../db/db-conn";
import { oauth_identities, tokens, users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { memory } from "./oauth-callback";

export const loginOauth = async (
  req: Request,
  res: Response
): Promise<void> => {
  // 1. Read the access token from cookies
  const refreshTokenId = randomUUID(); // Generate a unique ID for the refresh token

  // Read the accessToken from the cookie
  const accessTokenFromCallback = req.cookies.accessToken;

  const { username } = req.body; // Destructure username and password from the request body
  const { provider } = req.query; // Extract provider from the query parameters

  //console.log("Username from request:", username);

  if (!accessTokenFromCallback || typeof accessTokenFromCallback !== "string") {
    res.status(400).json({ message: "Invalid or missing access token" });
    return;
  }

  try {
    // Verify the access token
    const decoded = jwt.verify(
      accessTokenFromCallback,
      process.env.ACCESS_JWT_SECRET as string
    ) as {
      id: string;
    };

    // Fetch the profile data from memory (or database)
    const profile = memory[decoded.id];
    //console.log("Profile from callback:", profile);

    if (!profile || !profile.id) {
      res.status(400).json({ success: false, message: "Invalid profile data" });
      return;
    }

    // Start a transaction
    await db.transaction(async (tx) => {
      // 6. Check if the user already exists in your database
      let user = await tx
        .select()
        .from(users)
        .where(eq(users.email, profile.email))
        .execute();

      if (user.length === 0) {
        // 7. If the user doesn't exist, create a new user
        const newUser = await db
          .insert(users)
          .values({
            username: profile.name || profile.email.split("@")[0],
            email: profile.email,
            password: "oauth_user_no_password", // No password for OAuth users
            role: "user",
          })
          .onConflictDoUpdate({
            target: users.email, // Conflict target (unique constraint)
            set: {
              username: profile.name || profile.email.split("@")[0], // Update this field on conflict
            },
          })
          .returning()
          .execute();

        user = newUser;

        // 8. Add the OAuth identity to the oauth_identities table
        await tx
          .insert(oauth_identities)
          .values({
            provider: provider as string,
            providerId: profile.id,
            profilePicture: profile.picture,
            userId: newUser[0].id,
          })
          .onConflictDoNothing() // Do nothing if the OAuth identity already exists
          .execute();
      } else {
        // If the user exists, ensure their OAuth identity is linked
        const oauthIdentity = await tx
          .select()
          .from(oauth_identities)
          .where(eq(oauth_identities.userId, user[0].id))
          .execute();

        if (oauthIdentity.length === 0) {
          await tx
            .insert(oauth_identities)
            .values({
              provider: "google",
              providerId: profile.id,
              profilePicture: profile.picture,
              userId: user[0].id,
            })
            .execute();
        }
      }

      // 9. Generate your application's tokens
      const accessToken = jwt.sign(
        { id: user[0].id, role: user[0].role }, // Payload
        process.env.ACCESS_JWT_SECRET as string, // Secret key
        { expiresIn: "2m" } // Expiration time
      );

      const refreshToken = jwt.sign(
        { id: user[0].id, role: user[0].role },
        process.env.REFRESH_JWT_SECRET!,
        { expiresIn: "5d" } // Longer expiration time
      );

      // Store the refresh token in the tokens table
      await tx.insert(tokens).values({
        userId: user[0].id,
        tokenId: refreshTokenId,
      });

      // 10. Set the refresh token in a secure cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
      });

      //console.log("Setting Refresh-Token-ID header:", refreshTokenId);

      // Send the refreshTokenId in the response header
      res.setHeader("Refresh-Token-ID", refreshTokenId);

      // Set the access token in the response header
      res.setHeader("Authorization", `Bearer ${accessToken}`);

      // Respond with the username
      res.json({ username: user[0].username });
    });
  } catch (error) {
    console.error("Error during OAuth login:", error);

    // Handle specific JWT errors
    if (error instanceof jwt.JsonWebTokenError) {
      res
        .status(401)
        .json({ success: false, message: "Invalid or expired token" });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Authentication failed" });
    }
  }
};
