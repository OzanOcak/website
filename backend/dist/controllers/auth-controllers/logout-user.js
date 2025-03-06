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
exports.logout = void 0;
const db_conn_1 = require("../../db/db-conn");
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshTokenId = req.headers["refresh-token-id"]; // Get refreshTokenId from headers
    if (!refreshTokenId) {
        res.status(400).json({ message: "Refresh token ID is required" });
        return;
    }
    try {
        // Delete the refresh token from the database
        const deleteResult = yield db_conn_1.db
            .delete(schema_1.tokens)
            .where((0, drizzle_orm_1.eq)(schema_1.tokens.tokenId, refreshTokenId))
            .execute();
        // Check if the refresh token was deleted
        if (deleteResult.rowCount === 0) {
            res.status(204).json({ message: "No token found to delete" });
            return;
        }
        res.clearCookie("refreshToken"); // Clear the refresh token cookie
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ message: "Error logging out" });
    }
});
exports.logout = logout;
