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
exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../db/schema"); // Import tokens schema
const db_conn_1 = require("../../db/db-conn");
const node_crypto_1 = require("node:crypto");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshTokenId = (0, node_crypto_1.randomUUID)(); // Generate a unique ID for the refresh token
    try {
        const { email, password } = req.body; // Destructure username and password from the request body
        const user = yield db_conn_1.db
            .select()
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.email, email))
            .execute();
        // User not found
        if (!user.length) {
            res.status(404).json({ message: "User not found" });
            return; // Prevent further execution
        }
        // Compare password
        if (!(yield bcryptjs_1.default.compare(password, user[0].password))) {
            res.status(401).json({ message: "Invalid password" });
            return; // Prevent further execution
        }
        // Delete existing refresh-token-id from the tokens table if it exists
        yield db_conn_1.db.delete(schema_1.tokens).where((0, drizzle_orm_1.eq)(schema_1.tokens.userId, user[0].id)).execute();
        // Generate new access and refresh tokens
        const accessToken = jsonwebtoken_1.default.sign({ id: user[0].id, role: user[0].role }, process.env.ACCESS_JWT_SECRET, {
            expiresIn: "15m", // Short expiration for access token
        });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user[0].id, role: user[0].role }, process.env.REFRESH_JWT_SECRET, {
            expiresIn: "5d", // Longer expiration for refresh token
        });
        // Store the refresh token in the tokens table
        yield db_conn_1.db.insert(schema_1.tokens).values({
            userId: user[0].id,
            tokenId: refreshTokenId,
        });
        // Set the refresh token in cookies (optional, if you still want it)
        res.cookie("refreshToken", refreshToken, {
            httpOnly: process.env.NODE_ENV !== "development",
            secure: process.env.NODE_ENV !== "development",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
        });
        //console.log("Setting Refresh-Token-ID header:", refreshTokenId);
        // Send the refreshTokenId in the response header
        res.setHeader("Refresh-Token-ID", refreshTokenId);
        // Set the access token in the response header
        res.setHeader("Authorization", `Bearer ${accessToken}`);
        // Respond with the username
        res.json({ username: user[0].username }); // Only return the username
    }
    catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Error logging in" });
    }
});
exports.login = login;
