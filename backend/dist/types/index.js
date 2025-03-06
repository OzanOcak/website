"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthUserSchema = exports.EmailPasswordUserSchema = void 0;
const zod_1 = require("zod");
// Schema for email/password users
exports.EmailPasswordUserSchema = zod_1.z.object({
    username: zod_1.z.string().min(1).max(50),
    email: zod_1.z.string().email("Invalid email address").max(255),
    password: zod_1.z.string().min(6).max(255),
});
// Schema for OAuth users (password is optional)
exports.OAuthUserSchema = zod_1.z.object({
    username: zod_1.z.string().min(1).max(50),
    email: zod_1.z.string().email("Invalid email address").max(255),
    password: zod_1.z.string().min(6).max(255).optional(), // Make password optional
});
