import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { db } from "../../../db/db-conn";
import { users, tokens } from "../../../db/schema";
import { randomUUID } from "node:crypto";

export const mobileEmailLogin = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const refreshTokenId = randomUUID();

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .execute();

    if (!user.length) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (!(await bcrypt.compare(password, user[0].password!))) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }

    // Delete any existing refresh token rows for this user
    await db.delete(tokens).where(eq(tokens.userId, user[0].id)).execute();

    // ─── Access token (2 min for mobile — same as OAuth mobile) ───
    const accessToken = jwt.sign(
      { id: user[0].id, role: user[0].role },
      process.env.ACCESS_JWT_SECRET!,
      { expiresIn: "2m" },
    );

    // ─── Refresh token WITH jti (required by /mobile/oauth/refresh) ───
    const refreshToken = jwt.sign(
      { id: user[0].id, role: user[0].role, jti: refreshTokenId },
      process.env.REFRESH_JWT_SECRET!,
      { expiresIn: "5d" },
    );

    // Store the refresh token ID
    await db.insert(tokens).values({
      userId: user[0].id,
      tokenId: refreshTokenId,
    });

    // ─── MOBILE: everything in body — no cookies, no headers ───
    res.json({
      accessToken,
      refreshToken,
      refreshTokenId,
      username: user[0].username,
    });
  } catch (error) {
    console.error("[mobile-email-login] error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
};
