import { Router } from "express";
import rateLimit from "express-rate-limit";
import { getLikeBlog } from "../controllers/feature-controllers/blog-likes/get-likes-controller";
import { likeBlog } from "../controllers/feature-controllers/blog-likes/like-controller";
import { dislikeBlog } from "../controllers/feature-controllers/blog-likes/unlike-controller";

const router = Router();

// Apply rate limiter middleware (to be implemented later)
const likeRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later.",
});

router.get("/blogpost/:postId/bloglikes", getLikeBlog); // Public route
router.post("/blogpost/:postId/likeblog", likeRateLimiter, likeBlog); // Public route with rate limiter
router.post("/blogpost/:postId/unlikeblog", likeRateLimiter, dislikeBlog); // Public route with rate limiter

export default router;
