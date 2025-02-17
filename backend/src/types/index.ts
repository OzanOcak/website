import { z } from "zod";

declare global {
  namespace Express {
    interface Request {
      accessToken?: string;
      userId?: string; // To store user ID after authentication
      role?: string;
    }
  }
}

// Schema for email/password users
export const EmailPasswordUserSchema = z.object({
  username: z.string().min(1).max(50),
  email: z.string().email("Invalid email address").max(255),
  password: z.string().min(6).max(255),
});

// Schema for OAuth users (password is optional)
export const OAuthUserSchema = z.object({
  username: z.string().min(1).max(50),
  email: z.string().email("Invalid email address").max(255),
  password: z.string().min(6).max(255).optional(), // Make password optional
});

// Infer types from the schemas
export type CreateEmailPasswordUserDTO = z.infer<
  typeof EmailPasswordUserSchema
>;
export type CreateOAuthUserDTO = z.infer<typeof OAuthUserSchema>;

export type JWTPayload = {
  id: number; // user[0].id is number
  role: string;
};

export type UnverifiedUser = {
  username: string;
  email: string;
  hashedPassword: string;
};

export type UnverifiedUsers = {
  [token: string]: UnverifiedUser; // Allow string keys
};
