import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";

// Helper function to get the client IP from X-Forwarded-For or req.ip
const getClientIp = (req: Request) => {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string") {
    return forwardedFor.split(",")[0].trim(); // Get the first IP in the list
  }
  return req.ip; // Fallback to req.ip if no X-Forwarded-For header
};

// Email-based rate limiter for private routes
export const emailRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each email to 5 requests per windowMs
  message: "Too many requests for this email, please try again later.",
  handler: (req: Request, res: Response, next: NextFunction) => {
    res.status(429).json({
      message: "Too many requests for this email, please try again later.",
    });
  },
  keyGenerator: (req: Request) => {
    // Use the email from the request body, or fallback to the client IP
    return req.body.email || getClientIp(req);
  },
});
