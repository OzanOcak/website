import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/*
    if (method === "email") {
      // Generate a verification code
      const verificationCode = uuidv4(); // Generate a unique verification code
      passwordResetCodes[verificationCode] = { email }; // Store the email temporarily

      // Send verification email
      await verificationEmailPassword(username, email, verificationCode);
    } else if (method === "otp") {
      // Generate a 6-digit OTP
      const otp = randomInt(100000, 999999).toString();
      passwordResetCodes[otp] = { email }; // Store the email temporarily

      // Send OTP email
      await verificationOTPPassword(username, email, otp);
    } else {
      res
        .status(400)
        .json({ message: "Invalid method. Choose 'otp' or 'email'." });
      return;
    }
*/
