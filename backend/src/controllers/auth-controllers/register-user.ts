import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { db } from "../../db/db-conn";
import { users } from "../../db/schema";
import { eq, or } from "drizzle-orm";
import { randomInt } from "node:crypto";
import jwt from "jsonwebtoken";
import { transporter } from "../../utils/node-mailer";
import { CreateEmailPasswordUserDTO } from "../../types";

// Temporary storage for unverified users
export const unverifiedUsers: Record<
  string,
  {
    username: string;
    email: string;
    hashedPassword: string;
    storedOtp: string;
    timerId: NodeJS.Timeout | null;
  }
> = {};

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password }: CreateEmailPasswordUserDTO = req.body;
  try {
    // Check if user is already exist and return client response errors if username or email exists
    const existingUser = await db
      .select()
      .from(users)
      .where(or(eq(users.email, email), eq(users.username, username)))
      .execute();

    if (existingUser.length) {
      // Check if the existing user is found by username and email
      if (existingUser.some((user) => user.email === email)) {
        res.status(400).json({ message: "Email is already registered." });
        return;
      }
      if (existingUser.some((user) => user.username === username)) {
        res.status(409).json({ message: "Username is already taken." });
        return;
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    // Generate a 6-digit OTP
    const otp = randomInt(100000, 999999).toString();

    verificationOTPPassword(username, email, otp);

    const accessToken = jwt.sign({ id: otp }, process.env.ACCESS_JWT_SECRET!, {
      expiresIn: "15m",
    });

    res.setHeader("Authorization", `Bearer ${accessToken}`);

    // Start a timer to delete the OTP from memory after 5 minutes
    const timerId = setTimeout(() => {
      delete unverifiedUsers[otp];
      //console.log("OTP deleted from memory");
    }, 300000); // 5 minutes in milliseconds

    // Store the user data temporarily
    unverifiedUsers[otp] = {
      username,
      email,
      hashedPassword,
      storedOtp: otp,
      timerId,
    };

    res.status(201).json({
      message:
        "User registered. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: "Error creating user" });
  }
};

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

/* 
The timerId is a reference to a timer created by setTimeout.This timer is set to delete the OTP and
associated user data from memory after a specified amount of time (in this case, 5 minutes). 
*/
