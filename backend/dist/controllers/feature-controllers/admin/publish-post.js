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
exports.publishPost = void 0;
const node_fs_1 = require("node:fs");
const gray_matter_1 = __importDefault(require("gray-matter"));
const db_conn_1 = require("../../../db/db-conn");
const schema_1 = require("../../../db/schema");
const publishPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    try {
        // Update the markdown file
        const filePath = `../frontend/src/content/${slug}.md`;
        const fileContent = (0, node_fs_1.readFileSync)(filePath, "utf-8");
        const { data, content } = (0, gray_matter_1.default)(fileContent);
        // Update the published field to true
        const updatedData = Object.assign(Object.assign({}, data), { published: true });
        // Write the updated markdown file
        const updatedFileContent = gray_matter_1.default.stringify(content, updatedData);
        (0, node_fs_1.writeFileSync)(filePath, updatedFileContent, "utf-8");
        // Insert a default row into the likes table
        yield db_conn_1.db
            .insert(schema_1.likes)
            .values({ slug, likes_count: 0 })
            .onConflictDoNothing(); // Avoid duplicate entries
        res.status(200).json({ message: `Post ${slug} published successfully` });
    }
    catch (error) {
        console.error("Error publishing post:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.publishPost = publishPost;
