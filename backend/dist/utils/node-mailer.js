"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.transporter = nodemailer_1.default.createTransport({
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
