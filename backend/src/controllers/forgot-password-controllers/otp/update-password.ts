import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "../../../db/db-conn";
import { users } from "../../../db/schema";
import { memory } from "./forgot-password";

export const updatePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, newPassword, confirmPassword, otps } = req.body;

  //console.log("userId", userId);
  //console.log(newPassword);
  //console.log(confirmPassword);

  // Validate input
  if (!userId || !newPassword || !confirmPassword || !otps) {
    res.status(400).json({
      message: "OTP, new password, and confirmation password are required.",
    });
    return;
  }

  if (newPassword !== confirmPassword) {
    res.status(400).json({ message: "Passwords do not match." });
    return;
  }

  try {
    if (!memory[userId as string]) {
      res.status(400).json({ message: "Something went wrong!" });
      return;
    }
    const email = memory[userId as string].email;
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.email, email))
      .execute();

    //localStorage.removeItem("xg8a"); // delete access token

    delete memory[userId as string]; // Remove the verification code from temporary storage

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Error updating password." });
  }
};

/**
When the client navigates from the /verify-otp page to the /update-password page,
a new request is sent to the server, and a new req object is created. The userId
that was stored in the previous req object is not carried over to the new req object.
Thus we cant access userId set by the authenticate middleware
const userId = req.userId; 
 */
