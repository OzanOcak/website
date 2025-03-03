import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { extractAccessToken } from "../utils/get-extracted-access-token";

dotenv.config(); // Load environment variables

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const accessToken = extractAccessToken(req, res);

  // Check if token is present to stasfy ts for undefined possibility
  if (!accessToken) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  // Verify the token
  jwt.verify(
    accessToken,
    process.env.ACCESS_JWT_SECRET || "",
    (err, payload) => {
      if (err) {
        // Handle specific JWT errors
        if (err.name === "TokenExpiredError") {
          res.status(401).json({ message: "Unauthorized: Token has expired" });
          return;
        }
        // Any other error (e.g., invalid token)
        res.status(403).json({ message: "Forbidden: Invalid token" });
        return;
      }

      // Set userId in request if token is valid
      req.userId = (payload && (payload as { id: string }).id) || undefined; // Set userId safely
      req.role = (payload && (payload as { role: string }).role) || undefined; // or handle as needed
      req.accessToken = accessToken;
      // console.log("You are:", req.role);
      // console.log("Payload:", payload);
      // console.log("Authenticated user:", req.userId, "role:", req.role); // Log user info for debugging
      next();
    }
  );
};
// When you encode a number in a JWT, it is treated as a string when decoded
// req.userId = parseInt((payload as { id: string }).id, 10);
// parseInt(string, 10); 10 for decimal (base 10)
// Convert string to number if you need it in app logic
