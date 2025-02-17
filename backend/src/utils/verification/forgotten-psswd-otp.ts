import { transporter } from "../node-mailer";

export const verificationOTPPassword = async (
  username: string,
  email: string,
  otp: string
): Promise<void> => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your one time code for Password Reset",
    html: `<p>Hello ${username},</p><br><br><p>Your OTP is: <strong>${otp}</strong>. It is valid for 5 minutes.</p>`,
  });
};
