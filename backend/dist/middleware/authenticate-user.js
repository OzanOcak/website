"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const get_extracted_access_token_1 = require("../utils/get-extracted-access-token");
dotenv_1.default.config(); // Load environment variables
const authenticate = (req, res, next) => {
    const accessToken = (0, get_extracted_access_token_1.extractAccessToken)(req, res);
    // Check if token is present to stasfy ts for undefined possibility
    if (!accessToken) {
        res.status(401).json({ message: "No token provided" });
        return;
    }
    // Verify the token
    jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_JWT_SECRET || "", (err, payload) => {
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
        req.userId = (payload && payload.id) || undefined; // Set userId safely
        req.role = (payload && payload.role) || undefined; // or handle as needed
        req.accessToken = accessToken;
        // console.log("You are:", req.role);
        // console.log("Payload:", payload);
        // console.log("Authenticated user:", req.userId, "role:", req.role); // Log user info for debugging
        next();
    });
};
exports.authenticate = authenticate;
// When you encode a number in a JWT, it is treated as a string when decoded
// req.userId = parseInt((payload as { id: string }).id, 10);
// parseInt(string, 10); 10 for decimal (base 10)
// Convert string to number if you need it in app logic
