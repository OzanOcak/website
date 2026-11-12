import { Request, Response } from "express";
import { mobileResetMemory, MAX_OTP_ATTEMPTS } from "./mobile-forgot-password";

export const mobileVerifyResetOtp = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { email, otp } = req.body;

  if (typeof email !== "string" || typeof otp !== "string") {
    res.status(400).json({ message: "Email and OTP are required" });
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

  // ═══ OTP is correct — do NOT delete memory, reset-password needs it ═══
  // ═══ Do NOT clear timer yet — reset-password uses it ═══
  res.json({
    message: "OTP verified",
    email,
  });
};
