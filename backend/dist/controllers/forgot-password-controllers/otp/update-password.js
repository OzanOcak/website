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
exports.updatePassword = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_conn_1 = require("../../../db/db-conn");
const schema_1 = require("../../../db/schema");
const forgot_password_1 = require("./forgot-password");
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, newPassword, confirmPassword, otps } = req.body;
    //console.log("userId", userId);
    //console.log(newPassword);
    //console.log(confirmPassword);
    // Validate input
    if (!userId || !newPassword || !confirmPassword || !otps) {
        res.status(400).json({
            message: "OTP, new password, and confirmation password are required.",
        });
        return;
    }
    if (newPassword !== confirmPassword) {
        res.status(400).json({ message: "Passwords do not match." });
        return;
    }
    try {
        if (!forgot_password_1.memory[userId]) {
            res.status(400).json({ message: "Something went wrong!" });
            return;
        }
        const email = forgot_password_1.memory[userId].email;
        // Hash the new password
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        // Update the user's password in the database
        yield db_conn_1.db
            .update(schema_1.users)
            .set({ password: hashedPassword })
            .where((0, drizzle_orm_1.eq)(schema_1.users.email, email))
            .execute();
        //localStorage.removeItem("xg8a"); // delete access token
        delete forgot_password_1.memory[userId]; // Remove the verification code from temporary storage
        res.status(200).json({ message: "Password updated successfully." });
    }
    catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ message: "Error updating password." });
    }
});
exports.updatePassword = updatePassword;
/**
When the client navigates from the /verify-otp page to the /update-password page,
a new request is sent to the server, and a new req object is created. The userId
that was stored in the previous req object is not carried over to the new req object.
Thus we cant access userId set by the authenticate middleware
const userId = req.userId;
 */
