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
exports.getCommentsByBlogId = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../../db/schema");
const db_conn_1 = require("../../../db/db-conn");
const getCommentsByBlogId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    try {
        // Fetch comments for the blog post
        const commentsList = yield db_conn_1.db
            .select({
            id: schema_1.comments.id,
            content: schema_1.comments.content,
            userId: schema_1.comments.userId,
            likeCount: schema_1.comments.likeCount,
            createdAt: schema_1.comments.createdAt,
            username: schema_1.users.username,
            profilePicture: schema_1.oauth_identities.profilePicture,
        })
            .from(schema_1.comments)
            .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.comments.userId, schema_1.users.id))
            .leftJoin(schema_1.oauth_identities, (0, drizzle_orm_1.eq)(schema_1.users.id, schema_1.oauth_identities.userId))
            .where((0, drizzle_orm_1.eq)(schema_1.comments.blogId, postId))
            .execute();
        res.status(200).json({ comments: commentsList });
    }
    catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ message: "Error fetching comments" });
    }
});
exports.getCommentsByBlogId = getCommentsByBlogId;
