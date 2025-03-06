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
exports.editComment = void 0;
const db_conn_1 = require("../../../db/db-conn");
const schema_1 = require("../../../db/schema");
const drizzle_orm_1 = require("drizzle-orm"); // Import eq from drizzle-orm
const editComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId } = req.params;
    const { content } = req.body; // Assuming content is sent in the request body
    try {
        // Update the comment in the database using the commentId
        const result = yield db_conn_1.db
            .update(schema_1.comments)
            .set({ content })
            .where((0, drizzle_orm_1.eq)(schema_1.comments.id, Number(commentId))); // Use eq to match the commentId
        if (result.rowCount !== null && result.rowCount > 0) {
            res.status(200).json({ message: "Comment updated successfully" });
        }
        else {
            res.status(404).json({ message: "Comment not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error updating comment", error });
    }
});
exports.editComment = editComment;
