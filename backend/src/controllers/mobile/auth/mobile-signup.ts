import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { db } from "../../../db/db-conn";
import { users } from "../../../db/schema";
import { eq, or } from "drizzle-orm";
import { randomInt } from "node:crypto";
import { transporter } from "../../../utils/node-mailer";
import { CreateEmailPasswordUserDTO } from "../../../types";
import { unverifiedUsers } from "../../auth-controllers/register-user";

export const mobileSignup = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { username, email, password }: CreateEmailPasswordUserDTO = req.body;

  try {
    // 1. Check duplicate email/username
    const existingUser = await db
      .select()
      .from(users)
      .where(or(eq(users.email, email), eq(users.username, username)))
      .execute();

    if (existingUser.length) {
      if (existingUser.some((u) => u.email === email)) {
        res.status(400).json({ message: "Email is already registered." });
        return;
      }
      if (existingUser.some((u) => u.username === username)) {
        res.status(409).json({ message: "Username is already taken." });
        return;
      }
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Generate 6-digit OTP
    const otp = randomInt(0, 1_000_000).toString().padStart(6, "0");
    console.log("[mobile-signup] OTP for", email, "=", otp);

    // 4. Send email (awaited so failures are logged)
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your verification code",
        html: `<p>Hello ${username},</p><p>Your verification code is: <strong>${otp}</strong>.</p><p>It is valid for 5 minutes.</p>`,
      });
      console.log("[mobile-signup] email sent OK to:", email);
    } catch (mailErr: any) {
      console.error(
        "[mobile-signup] email FAILED:",
        mailErr?.message ?? mailErr,
      );
      res.status(500).json({ message: "Failed to send verification email" });
      return;
    }

    // 5. Store pending user in the SAME map web uses
    //    (so mobile-verify-email can find it)
    const timerId = setTimeout(
      () => {
        delete unverifiedUsers[otp];
      },
      5 * 60 * 1000,
    );

    unverifiedUsers[otp] = {
      username,
      email,
      hashedPassword,
      storedOtp: otp,
      timerId,
    };

    // 6. Respond — NO tokens yet, those come from /mobile/auth/verify-email
    res.status(201).json({
      message: "Verification code sent. Please check your email.",
    });
  } catch (error) {
    console.error("[mobile-signup] error:", error);
    res.status(500).json({ message: "Error creating user" });
  }
};
