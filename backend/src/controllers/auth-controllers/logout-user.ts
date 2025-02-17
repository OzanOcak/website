import { Request, Response } from "express";
import { db } from "../../db/db-conn";
import { tokens } from "../../db/schema";
import { eq } from "drizzle-orm";

export const logout = async (req: Request, res: Response) => {
  const refreshTokenId = req.headers["refresh-token-id"] as string; // Get refreshTokenId from headers

  if (!refreshTokenId) {
    res.status(400).json({ message: "Refresh token ID is required" });
    return;
  }

  try {
    // Delete the refresh token from the database
    const deleteResult = await db
      .delete(tokens)
      .where(eq(tokens.tokenId, refreshTokenId))
      .execute();

    // Check if the refresh token was deleted
    if (deleteResult.rowCount === 0) {
      res.status(204).json({ message: "No token found to delete" });
      return;
    }

    res.clearCookie("refreshToken"); // Clear the refresh token cookie
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Error logging out" });
  }
};
