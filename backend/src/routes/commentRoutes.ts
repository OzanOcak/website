import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authenticate } from "../middleware/authenticate-user";
import { checkPermissionsToAuthorize } from "../middleware/authorize-user";
import { createComment } from "../controllers/feature-controllers/comments/create-comment-controller";
import { getCommentsByBlogId } from "../controllers/feature-controllers/comments/fetch-comments-controller";
import { likeComment } from "../controllers/feature-controllers/comments/like-comment-controller";
import { deleteCommentById } from "../controllers/feature-controllers/comments/delete-comment-controller";
import { editComment } from "../controllers/feature-controllers/comments/edit-comment-controller";
import { unlikeComment } from "../controllers/feature-controllers/comments/unlike-comment-controller";

const router = Router();

// Middleware for comment-related actions
const commentRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 50 requests per windowMs
  message: "Too many requests, please try again later.",
});

router.post(
  "/posts/:postId/comments",
  authenticate,
  checkPermissionsToAuthorize("create_comment"), // Only signed-in users can comment
  commentRateLimiter, // Apply rate limiter
  createComment
);

router.get("/posts/:postId/comments", getCommentsByBlogId); // Public route

router.post(
  "/comments/:commentId/likecomment",
  authenticate,
  checkPermissionsToAuthorize("like_comment"), // Only signed-in users can like comments
  commentRateLimiter, // Apply rate limiter
  likeComment
);

router.post(
  "/comments/:commentId/unlikecomment",
  authenticate,
  checkPermissionsToAuthorize("like_comment"), // Only signed-in users can unlike comments
  commentRateLimiter, // Apply rate limiter
  unlikeComment
);

router.post(
  "/comments/:commentId/reply",
  authenticate,
  checkPermissionsToAuthorize("create_comment"), // Only signed-in users can reply
  commentRateLimiter, // Apply rate limiter
  createComment
);

router.delete(
  "/comments/:commentId",
  authenticate,
  checkPermissionsToAuthorize("delete_comment"), // Only signed-in users can delete their own comments
  deleteCommentById
);

router.patch(
  "/comments/:commentId",
  authenticate,
  checkPermissionsToAuthorize("edit_comment"), // Only signed-in users can edit their own comments
  editComment
);
export default router;
