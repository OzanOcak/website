import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { db } from "../../../db/db-conn";
import { tokens } from "../../../db/schema";

export const registerDeviceToken: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).userId; // <--- From your authenticate middleware
    const role = (req as any).role; // <--- From your authenticate middleware

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const deviceTokenId = randomUUID();

    const deviceToken = jwt.sign(
      { id: userId, role, jti: deviceTokenId, type: "device" },
      process.env.REFRESH_JWT_SECRET!,
      { expiresIn: "30d" },
    );

    await db.insert(tokens).values({
      userId: parseInt(userId, 10), // Ensure it's an integer for the DB
      tokenId: deviceTokenId,
      type: "device",
    });

    res.json({ deviceToken, deviceTokenId });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate device token" });
  }
};
