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
exports.dislikeBlog = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_conn_1 = require("../../../db/db-conn");
const schema_1 = require("../../../db/schema");
const dislikeBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params; // Get the slug from the query parameters
    console.log("postId", postId);
    if (!postId) {
        res.status(400).json({ message: "Slug is required" });
        return;
    }
    try {
        // Increment the dislikes_count for the post
        yield db_conn_1.db
            .update(schema_1.likes)
            .set({ likes_count: (0, drizzle_orm_1.sql) `${schema_1.likes.likes_count} - 1` })
            .where((0, drizzle_orm_1.sql) `${schema_1.likes.slug} = ${postId}`)
            .execute();
        res.status(200).json({ message: "Post unliked successfully" });
    }
    catch (error) {
        console.error("Error unliking post:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.dislikeBlog = dislikeBlog;
