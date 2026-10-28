import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../../../db/db-conn";
import { tokens } from "../../../db/schema";

export const mobileLogout = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { refreshTokenId } = req.body;

  if (typeof refreshTokenId !== "string" || !refreshTokenId) {
    // Logout is idempotent — always return 200 even if no ID given
    res.status(200).json({ message: "Logged out" });
    return;
  }

  try {
    await db.delete(tokens).where(eq(tokens.tokenId, refreshTokenId)).execute();
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("[mobile-logout] error:", error);
    // Even on DB failure, the client will clear local state — return 200
    res.status(200).json({ message: "Logged out" });
  }
};
