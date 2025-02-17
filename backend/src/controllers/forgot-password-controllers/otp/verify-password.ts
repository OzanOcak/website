import { Request, Response } from "express";
import { memory } from "./forgot-password";

export const verifyOtpPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { otp } = req.body;

  // Accessing userId set by the authenticate middleware
  const userId = req.userId; // This will hold the user ID from the token
  // Get the token from the Authorization header
  console.log("User ID from middleware:", userId);
  console.log("OTP received:", otp);

  // Check if the OTP entry exists in memory
  const memoryEntry = memory[userId as string];
  //console.log("Memory entry for OTP:", memoryEntry);

  // Aceess token verified in middleware

  try {
    // If the memory entry doesn't exist, the OTP has expired or was never set
    if (!memoryEntry) {
      res.status(410).json({ message: "Verification code has expired." });
      return;
    }

    const storedOtp = memory[userId as string].storedOtp;

    // Check if the exact verification code (otp) exists as a key in passwordResetCodes
    if (otp !== storedOtp) {
      res
        .status(403)
        .json({ message: "Invalid or expired verification code." });
      return;
    }

    //console.log("stored otp", storedOtp);

    res.status(200).json({
      message: "OTP code is matching",
      userId: userId,
      otps: true,
    });

    // Redirect to the update password page after successful verification
    // when cpi end point fetched by cliend redirection gives cors error
    //res.redirect(`http://localhost:5173/update-password?code=${otp}`); // send otp to client

    // Clear the timer
    clearTimeout(memory[userId as string].timerId!);
    memory[userId as string].timerId = null;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error verifying OTP" });
  }
};
