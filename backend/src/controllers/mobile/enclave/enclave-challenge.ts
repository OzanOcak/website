import { RequestHandler } from "express";
import { randomBytes } from "crypto";

// In-memory store for challenges.
// In production, use Redis with a TTL.
export const pendingChallenges: Record<
  string,
  { deviceId: string; expiresAt: number }
> = {};

export const getEnclaveChallenge: RequestHandler = async (req, res) => {
  try {
    const { deviceId } = req.body;

    if (!deviceId) {
      res.status(400).json({ message: "Device ID required" });
      return;
    }

    // 1. Generate a cryptographically secure random string
    const challenge = randomBytes(32).toString("base64");

    // 2. Store it tied to the device, with a 60-second expiration
    pendingChallenges[challenge] = {
      deviceId,
      expiresAt: Date.now() + 60 * 1000,
    };

    // Clean up expired challenges to prevent memory leaks
    for (const key in pendingChallenges) {
      if (pendingChallenges[key].expiresAt < Date.now()) {
        delete pendingChallenges[key];
      }
    }

    res.json({ challenge });
  } catch (error) {
    console.error("Challenge error:", error);
    res.status(500).json({ message: "Failed to generate challenge" });
  }
};
