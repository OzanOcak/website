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
exports.verificationOTPPassword = exports.forgotPassword = exports.memory = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_conn_1 = require("../../../db/db-conn");
const schema_1 = require("../../../db/schema");
const crypto_1 = require("crypto");
const node_mailer_1 = require("../../../utils/node-mailer");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Store for password reset verification codes
exports.memory = {};
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        // Check if the user exists
        const user = yield db_conn_1.db
            .select()
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.email, email))
            .execute();
        if (!user.length) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const { id, username } = user[0];
        // Generate a 6-digit OTP
        const otp = (0, crypto_1.randomInt)(100000, 999999).toString();
        exports.memory[id.toString()] = { email, storedOtp: otp, timerId: null }; // Store the OTP and associated email temporarily
        //console.log("1", memory[id.toString()]);
        // Send verification email
        (0, exports.verificationOTPPassword)(username, email, otp);
        const accessToken = jsonwebtoken_1.default.sign({ id: id.toString(), role: "user" }, process.env.ACCESS_JWT_SECRET, {
            expiresIn: "5m",
        });
        res.setHeader("Authorization", `Bearer ${accessToken}`);
        // Start a timer to delete the OTP from memory after 5 minutes
        const timerId = setTimeout(() => {
            delete exports.memory[id.toString()];
            //console.log("OTP deleted from memory");
        }, 300000); // 5 minutes in milliseconds
        exports.memory[id.toString()].timerId = timerId; // Store the timer ID
        // Send immediate response message
        res
            .status(200)
            .json({ message: "OTP sent to your email. Please check your inbox." });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error sending verification email" });
    }
});
exports.forgotPassword = forgotPassword;
// Function to email the OTP verification code
const verificationOTPPassword = (username, email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    yield node_mailer_1.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your one-time code for Password Reset",
        html: `<p>Hello ${username},</p><br><br><p>Your OTP is: <strong>${otp}</strong>. It is valid for 5 minutes.</p>`,
    });
});
exports.verificationOTPPassword = verificationOTPPassword;
