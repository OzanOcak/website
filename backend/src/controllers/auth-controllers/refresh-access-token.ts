import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import { db } from "../../db/db-conn";
import { tokens } from "../../db/schema";
import { eq } from "drizzle-orm";

export const getAccessToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const refreshTokenId = req.headers["refresh-token-id"] as string; // Expecting refresh token ID in the header

  if (!refreshTokenId) {
    res.status(400).json({ message: "Error!!!" });
    return;
  }

  try {
    // Check if the refresh token ID exists in the database
    const storedRefreshTokenId = await db
      .select()
      .from(tokens)
      .where(eq(tokens.tokenId, refreshTokenId))
      .execute();

    if (!storedRefreshTokenId) {
      res.status(403).json({ message: "Invalid Access!!!" });
      return;
    }

    // Retrieve the refresh token from the cookie
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(401).json({ message: "Refresh token not found." });
      return;
    }

    // Verify the refresh token
    jwt.verify(
      refreshToken,
      process.env.REFRESH_JWT_SECRET!,
      async (err: jwt.JsonWebTokenError | null, payload: any) => {
        if (err) {
          res.status(401).json({ message: "Invalid refresh token." });
          return;
        }

        const payloadId = payload.id; // Extract id from payload
        const payloadRole = payload.role;

        // Ensure the payload ID is valid
        if (typeof payloadId !== "number") {
          res.status(400).json({ message: "Invalid payload ID." });
          return;
        }

        // Generate a new refresh token and refresh token ID
        const newRefreshToken = jwt.sign(
          { id: payloadId, role: payloadRole },
          process.env.REFRESH_JWT_SECRET!,
          {
            expiresIn: "5d",
          }
        );

        const newRefreshTokenId = randomUUID(); // New UUID for the refresh token ID

        // Generate a new access token
        const newAccessToken = jwt.sign(
          { id: payloadId, role: payloadRole },
          process.env.ACCESS_JWT_SECRET!,
          {
            expiresIn: "15m", // Short-lived access token
          }
        );

        // Set the accessToken in the response header
        res.setHeader("Authorization", `Bearer ${newAccessToken}`);

        // Set the new refresh token in a cookie
        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: process.env.NODE_ENV !== "development", // Prevents JavaScript access
          secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
          maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
          sameSite: "strict", // Helps prevent CSRF attacks
        });
        // Set the new refreshTokenId in a response header
        res.setHeader("Refresh-Token-ID", newRefreshTokenId);

        // Store the new refresh token ID in the database
        await db.insert(tokens).values({
          userId: payloadId,
          tokenId: newRefreshTokenId,
        });

        // Optionally, delete the old refresh token ID from the database
        await db
          .delete(tokens)
          .where(eq(tokens.tokenId, refreshTokenId))
          .execute();

        // Respond with the new refresh token ID
        res.json({
          message: "Tokens refreshed successfully",
        });
      }
    );
  } catch (error) {
    console.error("Error refreshing access token:", error);
    res.status(500).json({ message: "Error refreshing access token." });
  }
};
