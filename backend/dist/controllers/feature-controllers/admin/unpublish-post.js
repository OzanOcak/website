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
exports.unpublishPost = void 0;
const node_fs_1 = require("node:fs");
const gray_matter_1 = __importDefault(require("gray-matter"));
const unpublishPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    try {
        // Update the markdown file
        const filePath = `../frontend/src/content/${slug}.md`;
        const fileContent = (0, node_fs_1.readFileSync)(filePath, "utf-8");
        const { data, content } = (0, gray_matter_1.default)(fileContent);
        // Update the published field to false
        const updatedData = Object.assign(Object.assign({}, data), { published: false });
        // Write the updated markdown file
        const updatedFileContent = gray_matter_1.default.stringify(content, updatedData);
        (0, node_fs_1.writeFileSync)(filePath, updatedFileContent, "utf-8");
        res.status(200).json({ message: `Post ${slug} unpublished successfully` });
    }
    catch (error) {
        console.error("Error unpublishing post:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.unpublishPost = unpublishPost;
