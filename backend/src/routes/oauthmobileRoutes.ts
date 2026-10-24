import { RequestHandler, Router } from "express";
import { getMobileOAuthUrl } from "../controllers/oauth-mobile-controllers/mobile-oauth-url";
import { mobileOAuthCallback } from "../controllers/oauth-mobile-controllers/mobile-oauth-callback";
import { mobileOAuthExchange } from "../controllers/oauth-mobile-controllers/mobile-oauth-exchange";
import { ipRateLimiter } from "../middleware/ip-rate-limiter";
import { mobileOAuthRefresh } from "../controllers/oauth-mobile-controllers/mobile-oauth-refresh";

const router = Router();

// Step 1 — client requests the Google OAuth URL
// Rate-limited to prevent abuse of the state store
router.get("/url", ipRateLimiter, getMobileOAuthUrl);

// Step 2 — Google redirects here after the user authenticates
// No rate limiter — this is triggered by Google, not the client.
// State validation + single-use code are the protection.
router.get("/callback", mobileOAuthCallback as RequestHandler);

// Step 3 — client submits { code, code_verifier } to exchange for tokens
// Rate-limited to prevent brute-force of the single-use code
router.post("/exchange", ipRateLimiter, mobileOAuthExchange);

// Step 4 — Validate and rotate refresh credentials to issue new JWTs.
router.post("/refresh", ipRateLimiter, mobileOAuthRefresh);

export default router;

/**
 * Architecture:
 *  React Native → PKCE → system browser → Google
 *   →  backend callback → app deep link → token exchange
 *      → secure Keychain storage → API requests
 *          → refresh and token rotation when needed.
 */
