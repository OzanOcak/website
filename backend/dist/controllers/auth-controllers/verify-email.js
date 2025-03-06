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
exports.verifyEmail = void 0;
const db_conn_1 = require("../../db/db-conn");
const schema_1 = require("../../db/schema");
const register_user_1 = require("./register-user");
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    // Accessing userId set by the authenticate middleware
    //const userId = req.userId;
    //console.log(otp);
    //console.log(unverifiedUsers[otp]);
    // Check if token and temporary user registry data exist
    if (!otp || !register_user_1.unverifiedUsers[otp]) {
        res.status(400).json({ message: "Invalid or expired token" });
        return;
    }
    try {
        const { username, email, hashedPassword, storedOtp, timerId } = register_user_1.unverifiedUsers[otp];
        //console.log(storedOtp);
        if (otp !== storedOtp) {
            res
                .status(403)
                .json({ message: "Invalid or expired verification code." });
            return;
        }
        // Create the user in the database
        yield db_conn_1.db
            .insert(schema_1.users)
            .values({ username, email, password: hashedPassword, role: "user" }) // Store the user
            .returning();
        // Clear the timer if it exists
        if (timerId) {
            clearTimeout(timerId);
        }
        // Remove the user from temporary storage
        delete register_user_1.unverifiedUsers[otp];
        //res.redirect(process.env.FRONTEND_URL || "http://localhost:5173");  // CORS err
        res.status(200).json({
            message: "done",
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error verifying email" });
    }
});
exports.verifyEmail = verifyEmail;
