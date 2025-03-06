"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const get_likes_controller_1 = require("../controllers/feature-controllers/blog-likes/get-likes-controller");
const like_controller_1 = require("../controllers/feature-controllers/blog-likes/like-controller");
const unlike_controller_1 = require("../controllers/feature-controllers/blog-likes/unlike-controller");
const router = (0, express_1.Router)();
// Apply rate limiter middleware (to be implemented later)
const likeRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 100 requests per windowMs
    message: "Too many requests, please try again later.",
});
router.get("/blogpost/:postId/bloglikes", get_likes_controller_1.getLikeBlog); // Public route
router.post("/blogpost/:postId/likeblog", likeRateLimiter, like_controller_1.likeBlog); // Public route with rate limiter
router.post("/blogpost/:postId/unlikeblog", likeRateLimiter, unlike_controller_1.dislikeBlog); // Public route with rate limiter
exports.default = router;
