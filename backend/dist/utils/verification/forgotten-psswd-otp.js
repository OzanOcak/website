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
exports.verificationOTPPassword = void 0;
const node_mailer_1 = require("../node-mailer");
const verificationOTPPassword = (username, email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    yield node_mailer_1.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your one time code for Password Reset",
        html: `<p>Hello ${username},</p><br><br><p>Your OTP is: <strong>${otp}</strong>. It is valid for 5 minutes.</p>`,
    });
});
exports.verificationOTPPassword = verificationOTPPassword;
