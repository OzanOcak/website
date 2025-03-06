"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const authenticate_user_1 = require("../middleware/authenticate-user");
const authorize_user_1 = require("../middleware/authorize-user");
const create_comment_controller_1 = require("../controllers/feature-controllers/comments/create-comment-controller");
const fetch_comments_controller_1 = require("../controllers/feature-controllers/comments/fetch-comments-controller");
const like_comment_controller_1 = require("../controllers/feature-controllers/comments/like-comment-controller");
const delete_comment_controller_1 = require("../controllers/feature-controllers/comments/delete-comment-controller");
const edit_comment_controller_1 = require("../controllers/feature-controllers/comments/edit-comment-controller");
const unlike_comment_controller_1 = require("../controllers/feature-controllers/comments/unlike-comment-controller");
const router = (0, express_1.Router)();
// Middleware for comment-related actions
const commentRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 50 requests per windowMs
    message: "Too many requests, please try again later.",
});
router.post("/posts/:postId/comments", authenticate_user_1.authenticate, (0, authorize_user_1.checkPermissionsToAuthorize)("create_comment"), // Only signed-in users can comment
commentRateLimiter, // Apply rate limiter
create_comment_controller_1.createComment);
router.get("/posts/:postId/comments", fetch_comments_controller_1.getCommentsByBlogId); // Public route
router.post("/comments/:commentId/likecomment", authenticate_user_1.authenticate, (0, authorize_user_1.checkPermissionsToAuthorize)("like_comment"), // Only signed-in users can like comments
commentRateLimiter, // Apply rate limiter
like_comment_controller_1.likeComment);
router.post("/comments/:commentId/unlikecomment", authenticate_user_1.authenticate, (0, authorize_user_1.checkPermissionsToAuthorize)("like_comment"), // Only signed-in users can unlike comments
commentRateLimiter, // Apply rate limiter
unlike_comment_controller_1.unlikeComment);
router.post("/comments/:commentId/reply", authenticate_user_1.authenticate, (0, authorize_user_1.checkPermissionsToAuthorize)("create_comment"), // Only signed-in users can reply
commentRateLimiter, // Apply rate limiter
create_comment_controller_1.createComment);
router.delete("/comments/:commentId", authenticate_user_1.authenticate, (0, authorize_user_1.checkPermissionsToAuthorize)("delete_comment"), // Only signed-in users can delete their own comments
delete_comment_controller_1.deleteCommentById);
router.patch("/comments/:commentId", authenticate_user_1.authenticate, (0, authorize_user_1.checkPermissionsToAuthorize)("edit_comment"), // Only signed-in users can edit their own comments
edit_comment_controller_1.editComment);
exports.default = router;
