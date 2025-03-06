"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const oauth_url_1 = require("../controllers/oauth-controllers/oauth-url");
const oauth_callback_1 = require("../controllers/oauth-controllers/oauth-callback");
const oauth_login_1 = require("../controllers/oauth-controllers/oauth-login");
const ip_rate_limiter_1 = require("../middleware/ip-rate-limiter");
const router = (0, express_1.Router)();
router.get("/oauth/url", ip_rate_limiter_1.ipRateLimiter, oauth_url_1.getGoogleOAuthUrl); // by clicking  button get all oauth codes
router.get("/oauth/callback", oauth_callback_1.oauthCallback); // google will make this req
router.post("/oauth/ologin", ip_rate_limiter_1.ipRateLimiter, oauth_login_1.loginOauth); // client will consent and authorize the app
exports.default = router;
/*
1. /oauth/url (GET)
Purpose: Generate the Google OAuth URL and redirect the user to Google's consent screen.
HTTP Method: GET is appropriate because this route is fetching a URL.
Implementation:
Generate the Google OAuth URL with the required parameters (e.g., client_id, redirect_uri,
scope, state, code_challenge for PKCE).
Return the URL to the frontend.

2. /oauth/callback (GET)
Purpose: Handle the redirect from Google after the user grants permission. Google will send
an authorization code and state to this endpoint.
HTTP Method: GET is correct because Google redirects the user to this endpoint with query
parameters (code and state).
Implementation:
Validate the state parameter to prevent CSRF attacks.
Exchange the authorization code for tokens using Google's token endpoint.
Redirect the user to the frontend with the tokens or store them securely.

3. /ologin (POST)
Purpose: Authenticate the user after the OAuth flow is complete. This route is used to
finalize the login process (e.g., create a session or generate application-specific tokens).
HTTP Method: POST is appropriate because this route involves submitting data (e.g., the
authorization code or user profile information).
Implementation:
Validate the authorization code or access token.
Fetch the user's profile from Google.
Create or update the user in your database.
Generate application-specific tokens (e.g., access token and refresh token).
Return the tokens to the frontend.
*/
