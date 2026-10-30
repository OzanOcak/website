import { RequestHandler } from "express";
import { db } from "../../../db/db-conn";
import { tokens } from "../../../db/schema";
import { eq, and } from "drizzle-orm";

export const revokeDeviceToken: RequestHandler = async (req, res) => {
  const { deviceTokenId } = req.body;
  const userId = (req as any).userId; // <--- From your authenticate middleware

  if (!deviceTokenId) {
    res.status(400).json({ message: "Device token ID required" });
    return;
  }

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    await db
      .delete(tokens)
      .where(
        and(
          eq(tokens.tokenId, deviceTokenId),
          eq(tokens.userId, parseInt(userId, 10)),
          eq(tokens.type, "device"),
        ),
      )
      .execute();

    res.status(200).json({ message: "Device revoked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to revoke device" });
  }
};
