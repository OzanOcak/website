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
exports.getGoogleOAuthUrl = exports.codeVerifiers = void 0;
const googleapis_1 = require("googleapis");
// Temporary storage for code verifiers (in-memory)
exports.codeVerifiers = {};
const getGoogleOAuthUrl = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code_challenge, code_verifier } = req.query; // Get the code challenge from the client
        // console.log("Session:", req.session); // Debug log
        // Validate the code challenge and code verifier
        if (typeof code_challenge !== "string" ||
            typeof code_verifier !== "string") {
            res
                .status(400)
                .json({ error: "Invalid code challenge or code verifier" });
            return;
        }
        // create an instance of OAuth2Client using the google.auth.OAuth2 constructor,
        const oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
        // generates the URL to which the user will be redirected to grant permission.
        const state = "some_random_state_string";
        //(req.session as any).oauthState = state;
        // Store the code verifier linked to the state
        exports.codeVerifiers[state] = code_verifier;
        // use the generateAuthUrl method to generate the authentication URL
        const url = oauth2Client.generateAuthUrl({
            access_type: "offline", // Requests a refresh token in addition to an access token.
            scope: ["profile", "email"], // Requests access to the user’s profile and email.
            prompt: "consent", // Ensures the user is prompted to grant permission, even if they’ve already done so.
            state: state, // later use it for CSRF
            code_challenge: code_challenge, // Use the provided code challenge
            code_challenge_method: "S256", // Use SHA-256
        });
        // cast the req object to any to avoid the TypeScript error
        // (req as { googleOauthUrl?: string }).googleOauthUrl = url;
        res.json({ url, state });
        //  next();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getGoogleOAuthUrl = getGoogleOAuthUrl;
