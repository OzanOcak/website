import { RequestHandler } from "express";
import { randomUUID } from "crypto";
import { db } from "../../../db/db-conn";
import { deviceKeys } from "../../../db/schema";

export const registerEnclaveKey: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).userId; // From your authenticate middleware
    const { publicKey } = req.body;

    if (!userId || !publicKey) {
      res.status(400).json({ message: "User and public key required" });
      return;
    }

    // Generate a unique device ID for this specific phone
    const deviceId = randomUUID();

    // Save the public key to the database
    await db.insert(deviceKeys).values({
      userId: parseInt(userId, 10),
      publicKey,
      deviceId,
    });

    res.json({ success: true, deviceId });
  } catch (error) {
    console.error("Failed to register enclave key:", error);
    res.status(500).json({ message: "Failed to register key" });
  }
};
