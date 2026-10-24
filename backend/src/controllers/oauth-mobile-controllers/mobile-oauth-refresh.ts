import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { db } from "../../db/db-conn";
import { tokens } from "../../db/schema";
import { eq, and } from "drizzle-orm";

export const mobileOAuthRefresh = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { refreshToken, refreshTokenId } = req.body;

  if (typeof refreshToken !== "string" || typeof refreshTokenId !== "string") {
    res.status(400).json({ message: "Missing refresh credentials" });
    return;
  }

  if (!process.env.REFRESH_JWT_SECRET || !process.env.ACCESS_JWT_SECRET) {
    res.status(500).json({ message: "Server misconfigured" });
    return;
  }

  let payload: { id: number; role: string; jti?: string };
  try {
    payload = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET) as {
      id: number;
      role: string;
      jti?: string;
    };
  } catch {
    res.status(401).json({ message: "Invalid refresh token" });
    return;
  }

  if (payload.jti !== refreshTokenId) {
    res.status(401).json({ message: "Token mismatch" });
    return;
  }

  const stored = await db
    .select()
    .from(tokens)
    .where(and(eq(tokens.tokenId, payload.jti), eq(tokens.userId, payload.id)))
    .execute();

  if (stored.length === 0) {
    res.status(403).json({ message: "Invalid refresh token ID" });
    return;
  }

  const newRefreshTokenId = randomUUID();

  const newAccessToken = jwt.sign(
    { id: payload.id, role: payload.role },
    process.env.ACCESS_JWT_SECRET,
    { expiresIn: "2m" },
  );

  const newRefreshToken = jwt.sign(
    { id: payload.id, role: payload.role, jti: newRefreshTokenId },
    process.env.REFRESH_JWT_SECRET,
    { expiresIn: "5d" },
  );

  try {
    await db.transaction(async (tx) => {
      const deleted = await tx
        .delete(tokens)
        .where(
          and(eq(tokens.tokenId, payload.jti!), eq(tokens.userId, payload.id)),
        )
        .returning()
        .execute();

      if (deleted.length === 0) {
        throw new Error("Token already consumed");
      }

      await tx.insert(tokens).values({
        userId: payload.id,
        tokenId: newRefreshTokenId,
      });
    });
  } catch (err: any) {
    if (err?.message === "Token already consumed") {
      res.status(403).json({ message: "Token already consumed" });
      return;
    }
    console.error("[oauth-mobile-refresh] rotation failed:", err);
    res.status(500).json({ message: "Refresh failed" });
    return;
  }

  res.json({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    refreshTokenId: newRefreshTokenId,
  });
};
