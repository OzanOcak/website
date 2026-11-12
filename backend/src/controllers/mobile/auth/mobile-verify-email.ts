import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import { db } from "../../../db/db-conn";
import { users, tokens } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { unverifiedUsers } from "../../auth-controllers/register-user";

export const mobileVerifyEmail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { otp } = req.body;

  // 1. Check OTP exists
  if (!otp || !unverifiedUsers[otp]) {
    res.status(400).json({ message: "Invalid or expired token" });
    return;
  }

  const pending = unverifiedUsers[otp];

  // 2. Check OTP matches
  if (otp !== pending.storedOtp) {
    res.status(403).json({ message: "Invalid verification code" });
    return;
  }

  try {
    // 3. Check email doesn't already exist (race protection)
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, pending.email))
      .limit(1);

    if (existing.length > 0) {
      if (pending.timerId) clearTimeout(pending.timerId);
      delete unverifiedUsers[otp];
      res.status(409).json({ message: "Account already exists" });
      return;
    }

    // 4. Create the user
    const [newUser] = await db
      .insert(users)
      .values({
        username: pending.username,
        email: pending.email,
        password: pending.hashedPassword,
        role: "user",
      })
      .returning();

    // 5. Cleanup
    if (pending.timerId) clearTimeout(pending.timerId);
    delete unverifiedUsers[otp];

    // 6. Issue mobile tokens
    const refreshTokenId = randomUUID();

    const accessToken = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.ACCESS_JWT_SECRET!,
      { expiresIn: "2m" },
    );

    const refreshToken = jwt.sign(
      { id: newUser.id, role: newUser.role, jti: refreshTokenId },
      process.env.REFRESH_JWT_SECRET!,
      { expiresIn: "5d" },
    );

    await db.insert(tokens).values({
      userId: newUser.id,
      tokenId: refreshTokenId,
    });

    // 7. Return tokens (same shape as /mobile/auth/login)
    res.status(200).json({
      accessToken,
      refreshToken,
      refreshTokenId,
      username: newUser.username,
    });
  } catch (error) {
    console.error("[mobile-verify-email] error:", error);
    res.status(500).json({ message: "Error verifying email" });
  }
};
