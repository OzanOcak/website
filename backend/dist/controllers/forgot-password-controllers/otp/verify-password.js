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
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtpPassword = void 0;
const forgot_password_1 = require("./forgot-password");
const verifyOtpPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    // Accessing userId set by the authenticate middleware
    const userId = req.userId; // This will hold the user ID from the token
    // Get the token from the Authorization header
    console.log("User ID from middleware:", userId);
    console.log("OTP received:", otp);
    // Check if the OTP entry exists in memory
    const memoryEntry = forgot_password_1.memory[userId];
    //console.log("Memory entry for OTP:", memoryEntry);
    // Aceess token verified in middleware
    try {
        // If the memory entry doesn't exist, the OTP has expired or was never set
        if (!memoryEntry) {
            res.status(410).json({ message: "Verification code has expired." });
            return;
        }
        const storedOtp = forgot_password_1.memory[userId].storedOtp;
        // Check if the exact verification code (otp) exists as a key in passwordResetCodes
        if (otp !== storedOtp) {
            res
                .status(403)
                .json({ message: "Invalid or expired verification code." });
            return;
        }
        //console.log("stored otp", storedOtp);
        res.status(200).json({
            message: "OTP code is matching",
            userId: userId,
            otps: true,
        });
        // Redirect to the update password page after successful verification
        // when cpi end point fetched by cliend redirection gives cors error
        //res.redirect(`http://localhost:5173/update-password?code=${otp}`); // send otp to client
        // Clear the timer
        clearTimeout(forgot_password_1.memory[userId].timerId);
        forgot_password_1.memory[userId].timerId = null;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error verifying OTP" });
    }
});
exports.verifyOtpPassword = verifyOtpPassword;
