import { Router } from "express";

import { authenticate } from "../middleware/authenticate-user";
import { checkPermissionsToAuthorize } from "../middleware/authorize-user";
import { user } from "../controllers/role-controllers/user-controller";
import { admin } from "../controllers/role-controllers/admin-controller";
import { deleteUserProfile } from "../controllers/feature-controllers/admin/delete-user-profile";
import { updatePassword } from "../controllers/forgot-password-controllers/otp/update-password";
import { adminEdit } from "../controllers/role-controllers/admin-edit-controller";
import { emailRateLimiter } from "../middleware/rate-limitter";
import { createComment } from "../controllers/feature-controllers/comments/create-comment-controller";
import { getCommentsByBlogId } from "../controllers/feature-controllers/comments/fetch-comments-controller";
import { likeComment } from "../controllers/feature-controllers/comments/like-comment-controller";
import { getLikeBlog } from "../controllers/feature-controllers/blog-likes/get-likes-controller";
import { likeBlog } from "../controllers/feature-controllers/blog-likes/like-controller";
import { dislikeBlog } from "../controllers/feature-controllers/blog-likes/unlike-controller";
import { updateUserRole } from "../controllers/feature-controllers/admin/update-user-role";
import { updateUserSelfName } from "../controllers/feature-controllers/user/update-user-self-name";
import { deleteSelfUserProfile } from "../controllers/feature-controllers/user/delete-self-user-profile";

const router = Router();

// user route
router.get(
  "/profile",
  authenticate,
  checkPermissionsToAuthorize("view_profile"),
  user
);

// admin routes
router.get(
  "/admin",
  authenticate,
  checkPermissionsToAuthorize(
    "view_profile",
    "view_users",
    "edit_user_role",
    "delete_user"
  ),
  admin
);

// admin's user profile routes for editing
router.get(
  "/admin/users/:userId",
  authenticate,
  checkPermissionsToAuthorize(
    "view_profile",
    "view_users",
    "edit_user_role",
    "delete_user"
  ),
  adminEdit
);

router.delete(
  "/admin/:userId",
  authenticate,
  checkPermissionsToAuthorize("delete_user"),
  deleteUserProfile
);

router.patch(
  "/admin/:userId/role",
  authenticate,
  checkPermissionsToAuthorize("edit_user_role"),
  updateUserRole
);

router.patch(
  "/profile/:userId/name",
  emailRateLimiter,
  authenticate,
  checkPermissionsToAuthorize("edit_self_user_name"),
  updateUserSelfName
);

router.delete(
  "/profile/:userId",
  authenticate,
  checkPermissionsToAuthorize("delete_self_user"),
  deleteSelfUserProfile
);

router.patch("/users/:userId/password", updatePassword);

// Like routes
router.get("/blogpost/:postId/like", getLikeBlog);
router.post("/blogpost/:postId/like", likeBlog);
router.post("/blogpost/:postId/dislike", dislikeBlog);

// Comment routes
router.post("/posts/:postId/comments", createComment);
router.get("/posts/:postId/comments", getCommentsByBlogId);
router.post("/comments/:commentId/like", likeComment);
router.post("/comments/:commentId/reply", createComment);

export default router;
