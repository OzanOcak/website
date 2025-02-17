import { transporter } from "../node-mailer";

export const verificationEmailPassword = async (
  username: string,
  email: string,
  verificationCode: string
): Promise<void> => {
  const verificationUrl = `http://localhost:3000/api/verify-reset-code?code=${verificationCode}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset",
    html: `<p>Hello ${username},</p><br><br><p>Click <a href="${verificationUrl}">here</a> to reset your password.</p>`,
  });
};
