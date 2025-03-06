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
exports.getAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const node_crypto_1 = require("node:crypto");
const db_conn_1 = require("../../db/db-conn");
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const getAccessToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshTokenId = req.headers["refresh-token-id"]; // Expecting refresh token ID in the header
    if (!refreshTokenId) {
        res.status(400).json({ message: "Error!!!" });
        return;
    }
    try {
        // Check if the refresh token ID exists in the database
        const storedRefreshTokenId = yield db_conn_1.db
            .select()
            .from(schema_1.tokens)
            .where((0, drizzle_orm_1.eq)(schema_1.tokens.tokenId, refreshTokenId))
            .execute();
        if (!storedRefreshTokenId) {
            res.status(403).json({ message: "Invalid Access!!!" });
            return;
        }
        // Retrieve the refresh token from the cookie
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.status(401).json({ message: "Refresh token not found." });
            return;
        }
        // Verify the refresh token
        jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_JWT_SECRET, (err, payload) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                res.status(401).json({ message: "Invalid refresh token." });
                return;
            }
            const payloadId = payload.id; // Extract id from payload
            const payloadRole = payload.role;
            // Ensure the payload ID is valid
            if (typeof payloadId !== "number") {
                res.status(400).json({ message: "Invalid payload ID." });
                return;
            }
            // Generate a new refresh token and refresh token ID
            const newRefreshToken = jsonwebtoken_1.default.sign({ id: payloadId, role: payloadRole }, process.env.REFRESH_JWT_SECRET, {
                expiresIn: "5d",
            });
            const newRefreshTokenId = (0, node_crypto_1.randomUUID)(); // New UUID for the refresh token ID
            // Generate a new access token
            const newAccessToken = jsonwebtoken_1.default.sign({ id: payloadId, role: payloadRole }, process.env.ACCESS_JWT_SECRET, {
                expiresIn: "15m", // Short-lived access token
            });
            // Set the accessToken in the response header
            res.setHeader("Authorization", `Bearer ${newAccessToken}`);
            // Set the new refresh token in a cookie
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: process.env.NODE_ENV !== "development", // Prevents JavaScript access
                secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
                maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
                sameSite: "strict", // Helps prevent CSRF attacks
            });
            // Set the new refreshTokenId in a response header
            res.setHeader("Refresh-Token-ID", newRefreshTokenId);
            // Store the new refresh token ID in the database
            yield db_conn_1.db.insert(schema_1.tokens).values({
                userId: payloadId,
                tokenId: newRefreshTokenId,
            });
            // Optionally, delete the old refresh token ID from the database
            yield db_conn_1.db
                .delete(schema_1.tokens)
                .where((0, drizzle_orm_1.eq)(schema_1.tokens.tokenId, refreshTokenId))
                .execute();
            // Respond with the new refresh token ID
            res.json({
                message: "Tokens refreshed successfully",
            });
        }));
    }
    catch (error) {
        console.error("Error refreshing access token:", error);
        res.status(500).json({ message: "Error refreshing access token." });
    }
});
exports.getAccessToken = getAccessToken;
