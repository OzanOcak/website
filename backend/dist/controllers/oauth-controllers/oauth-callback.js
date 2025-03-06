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
exports.oauthCallback = exports.memory = void 0;
const googleapis_1 = require("googleapis");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const oauth_url_1 = require("./oauth-url");
exports.memory = {};
const oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
const oauthCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code, state, error } = req.query;
    // Determine the base URL based on the environment
    const baseUrl = process.env.NODE_ENV === "production"
        ? "https://website-nine-eta-87.vercel.app" // Production URL
        : "http://localhost:5173"; // Development URL
    //console.log("code :", code);
    //console.log("state :", state);
    // Check if the user cancelled the OAuth flow
    if (error) {
        // console.log("OAuth flow cancelled by user:", error);
        return res.redirect(baseUrl); // Redirect to the login page
    }
    // Validate the code and state
    if (typeof code !== "string" || typeof state !== "string") {
        const errorMessage = encodeURIComponent("Invalid code or state");
        return res.redirect(`${baseUrl}/error?message=${errorMessage}`);
    }
    // Retrieve the code verifier using the state
    const codeVerifier = oauth_url_1.codeVerifiers[state];
    if (!codeVerifier) {
        const errorMessage = encodeURIComponent("Missing code verifier");
        return res.redirect(`${baseUrl}/error?message=${errorMessage}`);
    }
    try {
        // 3. Exchange the code for tokens
        const { tokens } = yield oauth2Client.getToken({
            code: code,
            codeVerifier: codeVerifier,
        });
        oauth2Client.setCredentials(tokens);
        // 4. Fetch the user's profile from Google
        const oauth2 = googleapis_1.google.oauth2({ version: "v2", auth: oauth2Client });
        const { data: profile } = yield oauth2.userinfo.get();
        // pass profile id or maybe all profile data with access token to client then send it to ologin
        // 5. Ensure profile.email is a valid string
        if (!profile.email || !profile.id) {
            const errorMessage = encodeURIComponent("Invalid profile data");
            return res.redirect(`${baseUrl}/error?message=${errorMessage}`);
        }
        //console.log("profile :", profile);
        exports.memory[profile.id] = {
            id: profile.id,
            email: profile.email,
            name: profile.name,
            picture: profile.picture,
        };
        // Generate a short-lived access token
        const accessToken = jsonwebtoken_1.default.sign({ id: profile.id }, // Payload
        process.env.ACCESS_JWT_SECRET, // Secret key
        { expiresIn: "30s" } // Short expiration time
        );
        // Set the token in a secure, HTTP-only cookie
        res.cookie("accessToken", accessToken, {
            httpOnly: process.env.NODE_ENV !== "development", // Prevent client-side JavaScript access
            secure: true, // Only send over HTTPS
            sameSite: "strict", // Prevent CSRF attacks
            maxAge: 30000, // 30 seconds
        });
        // Redirect to the username page with the username as a query parameter
        const redirectUrl = `${baseUrl}/username?xyz=${encodeURIComponent(profile.name)}`;
        res.redirect(redirectUrl);
    }
    catch (error) {
        // Redirect to an error page or the home page
        const errorRedirectUrl = `${baseUrl}/error`; // Or any other error page
        res.redirect(errorRedirectUrl);
    }
});
exports.oauthCallback = oauthCallback;
