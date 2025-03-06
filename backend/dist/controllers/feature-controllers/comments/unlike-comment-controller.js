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
exports.unlikeComment = void 0;
const db_conn_1 = require("../../../db/db-conn");
const schema_1 = require("../../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const unlikeComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId } = req.params;
    try {
        // Increment the like count for the comment
        const [updatedComment] = yield db_conn_1.db
            .update(schema_1.comments)
            .set({ likeCount: (0, drizzle_orm_1.sql) `${schema_1.comments.likeCount} - 1` })
            .where((0, drizzle_orm_1.eq)(schema_1.comments.id, Number(commentId)))
            .returning();
        res.status(200).json({ comment: updatedComment });
    }
    catch (error) {
        console.error("Error unliking comment:", error);
        res.status(500).json({ message: "Error unliking comment" });
    }
});
exports.unlikeComment = unlikeComment;
