import { Request, Response } from "express";
import { db } from "../../db/db-conn";
import { users } from "../../db/schema";
import { unverifiedUsers } from "./register-user";

export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { otp } = req.body;
  // Accessing userId set by the authenticate middleware
  //const userId = req.userId;
  //console.log(otp);
  //console.log(unverifiedUsers[otp]);

  // Check if token and temporary user registry data exist
  if (!otp || !unverifiedUsers[otp]) {
    res.status(400).json({ message: "Invalid or expired token" });
    return;
  }

  try {
    const { username, email, hashedPassword, storedOtp, timerId } =
      unverifiedUsers[otp];

    //console.log(storedOtp);

    if (otp !== storedOtp) {
      res
        .status(403)
        .json({ message: "Invalid or expired verification code." });
      return;
    }
    // Create the user in the database
    await db
      .insert(users)
      .values({ username, email, password: hashedPassword, role: "user" }) // Store the user
      .returning();

    // Clear the timer if it exists
    if (timerId) {
      clearTimeout(timerId);
    }
    // Remove the user from temporary storage
    delete unverifiedUsers[otp];

    //res.redirect(process.env.FRONTEND_URL || "http://localhost:5173");  // CORS err

    res.status(200).json({
      message: "done",
    });
  } catch (error) {
    res.status(500).json({ message: "Error verifying email" });
  }
};
