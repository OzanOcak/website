"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// Helper function to get the client IP from X-Forwarded-For or req.ip
const getClientIp = (req) => {
    const forwardedFor = req.headers["x-forwarded-for"];
    if (typeof forwardedFor === "string") {
        return forwardedFor.split(",")[0].trim(); // Get the first IP in the list
    }
    return req.ip; // Fallback to req.ip if no X-Forwarded-For header
};
// Email-based rate limiter for private routes
exports.emailRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 40, // Limit each email to 5 requests per windowMs
    message: "Too many requests for this email, please try again later.",
    handler: (req, res, next) => {
        res.status(429).json({
            message: "Too many requests for this email, please try again later.",
        });
    },
    keyGenerator: (req) => {
        // Use the email from the request body, or fallback to the client IP
        return req.body.email || getClientIp(req);
    },
});
