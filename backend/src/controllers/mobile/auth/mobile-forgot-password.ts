import { Request, Response } from "express";
import { randomInt } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "../../../db/db-conn";
import { users } from "../../../db/schema";
import { transporter } from "../../../utils/node-mailer";

export const mobileResetMemory: Record<
  string, // email as key
  {
    userId: number;
    username: string;
    storedOtp: string;
    expiresAt: number;
    attempts: number;
    timerId: NodeJS.Timeout | null;
  }
> = {};

const RESET_TTL_MS = 5 * 60 * 1000;
export const MAX_OTP_ATTEMPTS = 5;

export const mobileForgotPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { email } = req.body;

  if (typeof email !== "string" || !email) {
    res.status(400).json({ message: "Email is required" });
    return;
  }

  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    // ═══ Never reveal existence ═══
    if (user.length === 0) {
      res.json({
        message: "If that email exists, a reset code has been sent.",
      });
      return;
    }

    // Clean expired entries
    const now = Date.now();
    for (const key of Object.keys(mobileResetMemory)) {
      if (mobileResetMemory[key].expiresAt < now) {
        if (mobileResetMemory[key].timerId) {
          clearTimeout(mobileResetMemory[key].timerId!);
        }
        delete mobileResetMemory[key];
      }
    }

    // Replace any existing entry for this email
    if (mobileResetMemory[email]?.timerId) {
      clearTimeout(mobileResetMemory[email].timerId!);
    }

    const otp = randomInt(0, 1_000_000).toString().padStart(6, "0");
    // console.log("[mobile-forgot-password] OTP for", email, "=", otp);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your password reset code",
      html: `
        <p>Hello ${user[0].username},</p>
        <p>Your password reset code is:</p>
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${otp}</p>
        <p>This code expires in 5 minutes.</p>
        <p>If you didn't request this, ignore this email.</p>
      `,
    });

    const timerId = setTimeout(() => {
      delete mobileResetMemory[email];
    }, RESET_TTL_MS);

    mobileResetMemory[email] = {
      userId: user[0].id,
      username: user[0].username,
      storedOtp: otp,
      expiresAt: now + RESET_TTL_MS,
      attempts: 0,
      timerId,
    };

    res.json({ message: "If that email exists, a reset code has been sent." });
  } catch (err) {
    console.error("[mobile-forgot-password] error:", err);
    res.status(500).json({ message: "Failed to send reset email" });
  }
};
