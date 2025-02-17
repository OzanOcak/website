import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";

// Helper function to get the client IP from X-Forwarded-For or req.ip
const getClientIp = (req: Request): string => {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string") {
    return forwardedFor.split(",")[0].trim(); // Get the first IP in the list
  }
  return req.ip as string; // Fallback to req.ip if no X-Forwarded-For header
};

export const ipRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 40, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  handler: (req: Request, res: Response, next: NextFunction) => {
    res.status(429).json({
      message: "Too many requests from this IP, please try again later.",
    });
  },
  keyGenerator: (req: Request) => {
    return getClientIp(req); // Always returns a string
  },
});
