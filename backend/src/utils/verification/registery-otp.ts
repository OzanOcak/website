import { transporter } from "../node-mailer";

export const verificationEmailRegister = async (
  username: string,
  email: string,
  verificationToken: string
): Promise<void> => {
  // Send verification email
  const verificationUrl = `http://localhost:3000/api/verify-email?token=${verificationToken}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification",
    html: `<p>Hello ${username},</p><br><br><p>Click <a href="${verificationUrl}">here</a> to verify your email address.</p>`,
  });
};
