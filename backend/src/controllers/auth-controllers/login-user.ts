import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { users, tokens } from "../../db/schema"; // Import tokens schema
import { db } from "../../db/db-conn";
import { randomUUID } from "node:crypto";

export const login = async (req: Request, res: Response): Promise<void> => {
  const refreshTokenId = randomUUID(); // Generate a unique ID for the refresh token

  try {
    const { email, password } = req.body; // Destructure username and password from the request body
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .execute();

    // User not found
    if (!user.length) {
      res.status(404).json({ message: "User not found" });
      return; // Prevent further execution
    }

    // Compare password
    if (!(await bcrypt.compare(password, user[0].password!))) {
      res.status(401).json({ message: "Invalid password" });
      return; // Prevent further execution
    }

    // Delete existing refresh-token-id from the tokens table if it exists
    await db.delete(tokens).where(eq(tokens.userId, user[0].id)).execute();

    // Generate new access and refresh tokens
    const accessToken = jwt.sign(
      { id: user[0].id, role: user[0].role },
      process.env.ACCESS_JWT_SECRET!,
      {
        expiresIn: "15m", // Short expiration for access token
      }
    );

    const refreshToken = jwt.sign(
      { id: user[0].id, role: user[0].role },
      process.env.REFRESH_JWT_SECRET!,
      {
        expiresIn: "5d", // Longer expiration for refresh token
      }
    );

    // Store the refresh token in the tokens table
    await db.insert(tokens).values({
      userId: user[0].id,
      tokenId: refreshTokenId,
    });

    // Set the refresh token in cookies (optional, if you still want it)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: process.env.NODE_ENV !== "development",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    //console.log("Setting Refresh-Token-ID header:", refreshTokenId);

    // Send the refreshTokenId in the response header
    res.setHeader("Refresh-Token-ID", refreshTokenId);

    // Set the access token in the response header
    res.setHeader("Authorization", `Bearer ${accessToken}`);

    // Respond with the username
    res.json({ username: user[0].username }); // Only return the username
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in" });
  }
};
