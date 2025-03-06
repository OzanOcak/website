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
exports.verificationEmailPassword = void 0;
const node_mailer_1 = require("../node-mailer");
const verificationEmailPassword = (username, email, verificationCode) => __awaiter(void 0, void 0, void 0, function* () {
    const verificationUrl = `http://localhost:3000/api/verify-reset-code?code=${verificationCode}`;
    yield node_mailer_1.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset",
        html: `<p>Hello ${username},</p><br><br><p>Click <a href="${verificationUrl}">here</a> to reset your password.</p>`,
    });
});
exports.verificationEmailPassword = verificationEmailPassword;
