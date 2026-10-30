import { RequestHandler, Router } from "express";

import { ipRateLimiter } from "../middleware/ip-rate-limiter";
import { getMobileOAuthUrl } from "../controllers/mobile/oauth/mobile-oauth-url";
import { mobileOAuthCallback } from "../controllers/mobile/oauth/mobile-oauth-callback";
import { mobileOAuthExchange } from "../controllers/mobile/oauth/mobile-oauth-exchange";
import { mobileOAuthRefresh } from "../controllers/mobile/oauth/mobile-oauth-refresh";
import { mobileEmailLogin } from "../controllers/mobile/auth/mobile-login";
import { mobileLogout } from "../controllers/mobile/auth/mobile-logout";
import { deviceLogin } from "../controllers/mobile/faceid-auth/device-login";
import { registerDeviceToken } from "../controllers/mobile/faceid-auth/device-token";
import { revokeDeviceToken } from "../controllers/mobile/faceid-auth/device-revoke";
import { authenticate } from "../middleware/authenticate-user";

const router = Router();

// Step 1 — client requests the Google OAuth URL
// Rate-limited to prevent abuse of the state store
router.get("/oauth/url", ipRateLimiter, getMobileOAuthUrl);

// Step 2 — Google redirects here after the user authenticates
// No rate limiter — this is triggered by Google, not the client.
// State validation + single-use code are the protection.
router.get("/oauth/callback", mobileOAuthCallback as RequestHandler);

// Step 3 — client submits { code, code_verifier } to exchange for tokens
// Rate-limited to prevent brute-force of the single-use code
router.post("/oauth/exchange", ipRateLimiter, mobileOAuthExchange);

// Step 4 — Validate and rotate refresh credentials to issue new JWTs.
router.post("/oauth/refresh", ipRateLimiter, mobileOAuthRefresh);

// ═══ Email/password auth ═══
router.post("/auth/login", ipRateLimiter, mobileEmailLogin);
router.post("/auth/logout", ipRateLimiter, mobileLogout);

// ═══ Face ID Auth ═══
// Face ID login (Public)
router.post("/faceid-auth/device-login", ipRateLimiter, deviceLogin);

// Enable Face ID (Protected by your authenticate middleware)
router.post("/faceid-auth/device-token", authenticate, registerDeviceToken);

// Disable Face ID (Protected by your authenticate middleware)
router.delete("/faceid-auth/device-token", authenticate, revokeDeviceToken);

export default router;

/**
 * Architecture:
 *  React Native → PKCE → system browser → Google
 *   →  backend callback → app deep link → token exchange
 *      → secure Keychain storage → API requests
 *          → refresh and token rotation when needed.
 */
