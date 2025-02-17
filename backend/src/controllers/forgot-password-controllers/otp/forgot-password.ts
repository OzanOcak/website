import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../../../db/db-conn";
import { users } from "../../../db/schema";
import { randomInt } from "crypto";
import { transporter } from "../../../utils/node-mailer";
import jwt from "jsonwebtoken";

// Store for password reset verification codes
export const memory: Record<
  string, // userId as a key
  { email: string; storedOtp: string; timerId: NodeJS.Timeout | null }
> = {};

export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .execute();

    if (!user.length) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const { id, username } = user[0];

    // Generate a 6-digit OTP
    const otp = randomInt(100000, 999999).toString();
    memory[id.toString()] = { email, storedOtp: otp, timerId: null }; // Store the OTP and associated email temporarily
    //console.log("1", memory[id.toString()]);

    // Send verification email
    verificationOTPPassword(username, email, otp);

    const accessToken = jwt.sign(
      { id: id.toString() },
      process.env.ACCESS_JWT_SECRET!,
      {
        expiresIn: "5m",
      }
    );

    res.setHeader("Authorization", `Bearer ${accessToken}`);

    // Start a timer to delete the OTP from memory after 5 minutes
    const timerId = setTimeout(() => {
      delete memory[id.toString()];
      //console.log("OTP deleted from memory");
    }, 300000); // 5 minutes in milliseconds

    memory[id.toString()].timerId = timerId; // Store the timer ID

    // Send immediate response message
    res
      .status(200)
      .json({ message: "OTP sent to your email. Please check your inbox." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending verification email" });
  }
};

// Function to email the OTP verification code
export const verificationOTPPassword = async (
  username: string,
  email: string,
  otp: string
): Promise<void> => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your one-time code for Password Reset",
    html: `<p>Hello ${username},</p><br><br><p>Your OTP is: <strong>${otp}</strong>. It is valid for 5 minutes.</p>`,
  });
};
