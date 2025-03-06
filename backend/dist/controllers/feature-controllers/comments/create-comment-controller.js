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
exports.createComment = void 0;
const db_conn_1 = require("../../../db/db-conn");
const schema_1 = require("../../../db/schema");
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const { content, userId } = req.body;
    try {
        // Insert the comment into the database
        const [newComment] = yield db_conn_1.db
            .insert(schema_1.comments)
            .values({
            content,
            userId,
            blogId: postId,
            likeCount: 0, // Default like count
        })
            .returning();
        res.status(201).json({ comment: newComment });
    }
    catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({ message: "Error creating comment" });
    }
});
exports.createComment = createComment;
