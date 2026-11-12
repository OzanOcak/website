import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../../../db/db-conn";
import { users, tokens } from "../../../db/schema";
import { mobileResetMemory, MAX_OTP_ATTEMPTS } from "./mobile-forgot-password";

export const mobileResetPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { email, otp, newPassword } = req.body;

  if (
    typeof email !== "string" ||
    typeof otp !== "string" ||
    typeof newPassword !== "string" ||
    newPassword.length < 6
  ) {
    res.status(400).json({ message: "Invalid request" });
    return;
  }

  const entry = mobileResetMemory[email];
  if (!entry) {
    res.status(400).json({ message: "Invalid or expired reset code" });
    return;
  }

  if (entry.expiresAt < Date.now()) {
    if (entry.timerId) clearTimeout(entry.timerId);
    delete mobileResetMemory[email];
    res.status(400).json({ message: "Reset code has expired" });
    return;
  }

  if (entry.attempts >= MAX_OTP_ATTEMPTS) {
    if (entry.timerId) clearTimeout(entry.timerId);
    delete mobileResetMemory[email];
    res.status(429).json({ message: "Too many attempts. Please start over." });
    return;
  }

  entry.attempts += 1;

  if (otp !== entry.storedOtp) {
    res.status(403).json({ message: "Invalid reset code" });
    return;
  }

  try {
    const hashed = await bcrypt.hash(newPassword, 10);

    await db.transaction(async (tx) => {
      // Update password
      await tx
        .update(users)
        .set({ password: hashed })
        .where(eq(users.id, entry.userId));

      // Revoke ALL refresh tokens → force re-login everywhere
      await tx.delete(tokens).where(eq(tokens.userId, entry.userId));
    });

    // ═══ Single use — delete after success ═══
    if (entry.timerId) clearTimeout(entry.timerId);
    delete mobileResetMemory[email];

    res.json({ message: "Password updated. Please sign in." });
  } catch (err) {
    console.error("[mobile-reset-password] error:", err);
    res.status(500).json({ message: "Failed to reset password" });
  }
};
