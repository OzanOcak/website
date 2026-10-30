import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { db } from "../../../db/db-conn";
import { tokens, users } from "../../../db/schema";
import { eq, and } from "drizzle-orm";

export const deviceLogin: RequestHandler = async (req, res) => {
  const { deviceToken } = req.body;

  if (!deviceToken) {
    res.status(400).json({ message: "Device token required" });
    return; // <--- Just return, do NOT return res.status(...)
  }

  try {
    const payload = jwt.verify(
      deviceToken,
      process.env.REFRESH_JWT_SECRET!,
    ) as any;

    if (payload.type !== "device") {
      res.status(401).json({ message: "Invalid token type" });
      return; // <--- Just return
    }

    const stored = await db
      .select()
      .from(tokens)
      .where(and(eq(tokens.tokenId, payload.jti), eq(tokens.type, "device")))
      .execute();

    if (stored.length === 0) {
      res.status(403).json({ message: "Token revoked" });
      return; // <--- Just return
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.id))
      .execute();
    if (user.length === 0) {
      res.status(404).json({ message: "User not found" });
      return; // <--- Just return
    }

    const sessionId = randomUUID();
    const accessToken = jwt.sign(
      { id: user[0].id, role: user[0].role },
      process.env.ACCESS_JWT_SECRET!,
      { expiresIn: "2m" },
    );
    const refreshToken = jwt.sign(
      { id: user[0].id, role: user[0].role, jti: sessionId },
      process.env.REFRESH_JWT_SECRET!,
      { expiresIn: "5d" },
    );

    await db
      .insert(tokens)
      .values({ userId: user[0].id, tokenId: sessionId, type: "session" });

    res.json({ accessToken, refreshToken, refreshTokenId: sessionId });
  } catch (err) {
    res.status(401).json({ message: "Invalid device token" });
  }
};
