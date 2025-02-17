import { Router } from "express";

import { authenticate } from "../middleware/authenticate-user";
import { validateUser } from "../middleware/validate-user";
import { register } from "../controllers/auth-controllers/register-user";
import { login } from "../controllers/auth-controllers/login-user";
import { getAccessToken } from "../controllers/auth-controllers/refresh-access-token";
import { logout } from "../controllers/auth-controllers/logout-user";
import { verifyEmail } from "../controllers/auth-controllers/verify-email";
import { forgotPassword } from "../controllers/forgot-password-controllers/otp/forgot-password";
import { verifyOtpPassword } from "../controllers/forgot-password-controllers/otp/verify-password";
import { updatePassword } from "../controllers/forgot-password-controllers/otp/update-password";
import {
  signinRateLimiter,
  signupRateLimiter,
} from "../middleware/rate-limitter";
//import { forgotPassword } from "../controllers/forgot-password-controllers/e-link/forgot-password";
//import { updatePassword } from "../controllers/forgot-password-controllers/e-link/update-password";
//import { verifyPasswordResetCode } from "../controllers/forgot-password-controllers/e-link/verify-password-reset-code";

const router = Router();

router.post("/signup", signupRateLimiter, validateUser, register); //  public with  middleware
router.post("/login", signinRateLimiter, validateUser, login); // public with middleware
router.post("/refresh", getAccessToken); // refresh token will be extraxted ro get all the data, no need authenticate
router.post("/logout", authenticate, logout); // use middleware to verify if access token valid

router.post("/verify-email", authenticate, verifyEmail);

//router.post("/forgot-password", forgotPassword);
//router.post("/update-password", updatePassword); // Route to update password
//router.get("/verify-reset-code", verifyPasswordResetCode);

router.post("/forgot-password", forgotPassword);
router.post("/update-password", authenticate, updatePassword);
router.post("/verify-otp", authenticate, verifyOtpPassword);

export default router;
