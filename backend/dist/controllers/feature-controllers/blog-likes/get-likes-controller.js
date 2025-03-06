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
exports.getLikeBlog = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_conn_1 = require("../../../db/db-conn");
const schema_1 = require("../../../db/schema");
const getLikeBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params; // Extract postId from URL parameters
    if (!postId) {
        res.status(400).json({ message: "Post ID is required" });
        return;
    }
    try {
        // Fetch the likes and dislikes for the post
        const result = yield db_conn_1.db
            .select({
            likes_count: schema_1.likes.likes_count,
        })
            .from(schema_1.likes)
            .where((0, drizzle_orm_1.sql) `${schema_1.likes.slug} = ${postId}`)
            .execute();
        if (result.length === 0) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        // Return the likes and dislikes
        res.status(200).json({
            likes: result[0].likes_count,
        });
    }
    catch (error) {
        console.error("Error fetching likes:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getLikeBlog = getLikeBlog;
