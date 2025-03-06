"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_user_1 = require("../middleware/authenticate-user");
const validate_user_1 = require("../middleware/validate-user");
const register_user_1 = require("../controllers/auth-controllers/register-user");
const login_user_1 = require("../controllers/auth-controllers/login-user");
const refresh_access_token_1 = require("../controllers/auth-controllers/refresh-access-token");
const logout_user_1 = require("../controllers/auth-controllers/logout-user");
const verify_email_1 = require("../controllers/auth-controllers/verify-email");
const forgot_password_1 = require("../controllers/forgot-password-controllers/otp/forgot-password");
const verify_password_1 = require("../controllers/forgot-password-controllers/otp/verify-password");
const update_password_1 = require("../controllers/forgot-password-controllers/otp/update-password");
const ip_rate_limiter_1 = require("../middleware/ip-rate-limiter");
//import { forgotPassword } from "../controllers/forgot-password-controllers/e-link/forgot-password";
//import { updatePassword } from "../controllers/forgot-password-controllers/e-link/update-password";
//import { verifyPasswordResetCode } from "../controllers/forgot-password-controllers/e-link/verify-password-reset-code";
const router = (0, express_1.Router)();
router.post("/signup", ip_rate_limiter_1.ipRateLimiter, validate_user_1.validateUser, register_user_1.register); //  public with  middleware
router.post("/login", ip_rate_limiter_1.ipRateLimiter, validate_user_1.validateUser, login_user_1.login); // public with middleware
router.post("/refresh", refresh_access_token_1.getAccessToken); // refresh token will be extraxted ro get all the data, no need authenticate
router.post("/logout", authenticate_user_1.authenticate, logout_user_1.logout); // use middleware to verify if access token valid
router.post("/verify-email", ip_rate_limiter_1.ipRateLimiter, authenticate_user_1.authenticate, verify_email_1.verifyEmail);
//router.post("/forgot-password", forgotPassword);
//router.post("/update-password", updatePassword); // Route to update password
//router.get("/verify-reset-code", verifyPasswordResetCode);
router.post("/forgot-password", ip_rate_limiter_1.ipRateLimiter, forgot_password_1.forgotPassword);
router.post("/update-password", authenticate_user_1.authenticate, ip_rate_limiter_1.ipRateLimiter, update_password_1.updatePassword);
router.post("/verify-otp", authenticate_user_1.authenticate, verify_password_1.verifyOtpPassword);
exports.default = router;
