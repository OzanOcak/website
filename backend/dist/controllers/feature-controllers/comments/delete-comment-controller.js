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
exports.deleteCommentById = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_conn_1 = require("../../../db/db-conn");
const schema_1 = require("../../../db/schema");
const deleteCommentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId } = req.params;
    try {
        // Check if the comment exists
        const comment = yield db_conn_1.db
            .select()
            .from(schema_1.comments)
            .where((0, drizzle_orm_1.eq)(schema_1.comments.id, Number(commentId)))
            .execute();
        if (comment.length === 0) {
            res.status(404).json({ message: "Comment not found" });
            return;
        }
        const foundComment = comment[0]; // Get the first comment object
        // Delete the comment
        yield db_conn_1.db
            .delete(schema_1.comments)
            .where((0, drizzle_orm_1.eq)(schema_1.comments.id, Number(commentId)))
            .execute();
        res.status(200).json({ message: "Comment deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ message: "Error deleting comment" });
    }
});
exports.deleteCommentById = deleteCommentById;
