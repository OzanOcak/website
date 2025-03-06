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
exports.loginOauth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_conn_1 = require("../../db/db-conn");
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const crypto_1 = require("crypto");
const oauth_callback_1 = require("./oauth-callback");
const loginOauth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Read the access token from cookies
    const refreshTokenId = (0, crypto_1.randomUUID)(); // Generate a unique ID for the refresh token
    // Read the accessToken from the cookie
    const accessTokenFromCallback = req.cookies.accessToken;
    const { username } = req.body; // Destructure username and password from the request body
    const { provider } = req.query; // Extract provider from the query parameters
    //console.log("Username from request:", username);
    if (!accessTokenFromCallback || typeof accessTokenFromCallback !== "string") {
        res.status(400).json({ message: "Invalid or missing access token" });
        return;
    }
    try {
        // Verify the access token
        const decoded = jsonwebtoken_1.default.verify(accessTokenFromCallback, process.env.ACCESS_JWT_SECRET);
        // Fetch the profile data from memory (or database)
        const profile = oauth_callback_1.memory[decoded.id];
        console.log("Profile from callback:", profile);
        if (!profile || !profile.id) {
            res.status(400).json({ success: false, message: "Invalid profile data" });
            return;
        }
        // Start a transaction
        yield db_conn_1.db.transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // 6. Check if the user already exists in your database
            let user = yield tx
                .select()
                .from(schema_1.users)
                .where((0, drizzle_orm_1.eq)(schema_1.users.email, profile.email))
                .execute();
            if (user.length === 0) {
                // 7. If the user doesn't exist, create a new user
                const newUser = yield db_conn_1.db
                    .insert(schema_1.users)
                    .values({
                    username: profile.name || profile.email.split("@")[0],
                    email: profile.email,
                    password: "oauth_user_no_password", // No password for OAuth users
                    role: "user",
                })
                    .onConflictDoUpdate({
                    target: schema_1.users.email, // Conflict target (unique constraint)
                    set: {
                        username: profile.name || profile.email.split("@")[0], // Update this field on conflict
                    },
                })
                    .returning()
                    .execute();
                user = newUser;
                // 8. Add the OAuth identity to the oauth_identities table
                yield tx
                    .insert(schema_1.oauth_identities)
                    .values({
                    provider: provider,
                    providerId: profile.id,
                    profilePicture: profile.picture,
                    userId: newUser[0].id,
                })
                    .onConflictDoNothing() // Do nothing if the OAuth identity already exists
                    .execute();
            }
            else {
                // If the user exists, ensure their OAuth identity is linked
                const oauthIdentity = yield tx
                    .select()
                    .from(schema_1.oauth_identities)
                    .where((0, drizzle_orm_1.eq)(schema_1.oauth_identities.userId, user[0].id))
                    .execute();
                if (oauthIdentity.length === 0) {
                    yield tx
                        .insert(schema_1.oauth_identities)
                        .values({
                        provider: "google",
                        providerId: profile.id,
                        profilePicture: profile.picture,
                        userId: user[0].id,
                    })
                        .execute();
                }
            }
            // 9. Generate your application's tokens
            const accessToken = jsonwebtoken_1.default.sign({ id: user[0].id, role: user[0].role }, // Payload
            process.env.ACCESS_JWT_SECRET, // Secret key
            { expiresIn: "2m" } // Expiration time
            );
            const refreshToken = jsonwebtoken_1.default.sign({ id: user[0].id, role: user[0].role }, process.env.REFRESH_JWT_SECRET, { expiresIn: "5d" } // Longer expiration time
            );
            // Store the refresh token in the tokens table
            yield tx.insert(schema_1.tokens).values({
                userId: user[0].id,
                tokenId: refreshTokenId,
            });
            // 10. Set the refresh token in a secure cookie
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
                maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
            });
            //console.log("Setting Refresh-Token-ID header:", refreshTokenId);
            // Send the refreshTokenId in the response header
            res.setHeader("Refresh-Token-ID", refreshTokenId);
            // Set the access token in the response header
            res.setHeader("Authorization", `Bearer ${accessToken}`);
            // Respond with the username
            res.json({ username: user[0].username });
        }));
    }
    catch (error) {
        console.error("Error during OAuth login:", error);
        // Handle specific JWT errors
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res
                .status(401)
                .json({ success: false, message: "Invalid or expired token" });
        }
        else {
            res
                .status(500)
                .json({ success: false, message: "Authentication failed" });
        }
    }
});
exports.loginOauth = loginOauth;
