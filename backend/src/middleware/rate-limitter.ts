import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";

// Configure the rate limiter
export const signupRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 signup requests per windowMs
  message: "Too many signup attempts, please try again later!!!!!!!!",
  handler: (req: Request, res: Response, next: NextFunction) => {
    res.status(429).json({
      message: "Too many signup attempts, please try again later!!!!!!!!",
    });
  },
  keyGenerator: (req: Request) => {
    // Use the email from the request body to generate a unique key for each user
    return req.body.email;
  },
});

export const signinRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 signup requests per windowMs
  message: "Too many signup attempts, please try again later!!!!!!!!",
  handler: (req: Request, res: Response, next: NextFunction) => {
    res.status(429).json({
      message: "Too many signup attempts, please try again later!!!!!!!!",
    });
  },
  keyGenerator: (req: Request) => {
    // Use the email from the request body to generate a unique key for each user
    return req.body.email;
  },
});

// Generic rate limiter for /oauth/url (IP-based)
export const oauthUrlRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 5 signup requests per windowMs
  message: "Too many signup attempts, please try again later!!!!!!!!",
  handler: (req: Request, res: Response, next: NextFunction) => {
    res.status(429).json({
      message: "Too many signup attempts, please try again later!!!!!!!!",
    });
  },
  keyGenerator: (req: Request) => {
    // Use the email from the request body to generate a unique key for each user
    return req.body.email;
  },
});

// Login rate limiter for /oauth/ologin (email-based)
export const oauthLoginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 5 signup requests per windowMs
  message: "Too many signup attempts, please try again later!!!!!!!!",
  handler: (req: Request, res: Response, next: NextFunction) => {
    res.status(429).json({
      message: "Too many signup attempts, please try again later!!!!!!!!",
    });
  },
  keyGenerator: (req: Request) => {
    // Use the email from the request body to generate a unique key for each user
    return req.body.email;
  },
});
