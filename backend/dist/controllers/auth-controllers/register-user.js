"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationOTPPassword = exports.register = exports.unverifiedUsers = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_conn_1 = require("../../db/db-conn");
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const node_crypto_1 = require("node:crypto");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const node_mailer_1 = require("../../utils/node-mailer");
// Temporary storage for unverified users
exports.unverifiedUsers = {};
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    try {
        // Check if user is already exist and return client response errors if username or email exists
        const existingUser = yield db_conn_1.db
            .select()
            .from(schema_1.users)
            .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.users.email, email), (0, drizzle_orm_1.eq)(schema_1.users.username, username)))
            .execute();
        if (existingUser.length) {
            // Check if the existing user is found by username and email
            if (existingUser.some((user) => user.email === email)) {
                res.status(400).json({ message: "Email is already registered." });
                return;
            }
            if (existingUser.some((user) => user.username === username)) {
                res.status(409).json({ message: "Username is already taken." });
                return;
            }
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10); // Hash the password
        // Generate a 6-digit OTP
        const otp = (0, node_crypto_1.randomInt)(100000, 999999).toString();
        (0, exports.verificationOTPPassword)(username, email, otp);
        const accessToken = jsonwebtoken_1.default.sign({ id: otp }, process.env.ACCESS_JWT_SECRET, {
            expiresIn: "15m",
        });
        res.setHeader("Authorization", `Bearer ${accessToken}`);
        // Start a timer to delete the OTP from memory after 5 minutes
        const timerId = setTimeout(() => {
            delete exports.unverifiedUsers[otp];
            //console.log("OTP deleted from memory");
        }, 300000); // 5 minutes in milliseconds
        // Store the user data temporarily
        exports.unverifiedUsers[otp] = {
            username,
            email,
            hashedPassword,
            storedOtp: otp,
            timerId,
        };
        res.status(201).json({
            message: "User registered. Please check your email to verify your account.",
        });
    }
    catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: "Error creating user" });
    }
});
exports.register = register;
const verificationOTPPassword = (username, email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    yield node_mailer_1.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your one-time code for Password Reset",
        html: `<p>Hello ${username},</p><br><br><p>Your OTP is: <strong>${otp}</strong>. It is valid for 5 minutes.</p>`,
    });
});
exports.verificationOTPPassword = verificationOTPPassword;
/*
The timerId is a reference to a timer created by setTimeout.This timer is set to delete the OTP and
associated user data from memory after a specified amount of time (in this case, 5 minutes).
*/
