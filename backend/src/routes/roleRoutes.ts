import { Router } from "express";

import { authenticate } from "../middleware/authenticate-user";
import { checkPermissionsToAuthorize } from "../middleware/authorize-user";
import { user } from "../controllers/role-controllers/user-controller";
import { admin } from "../controllers/role-controllers/admin-controller";
import { deleteUserProfile } from "../controllers/feature-controllers/delete-user-profile";
import { updateUserRole } from "../controllers/feature-controllers/update-user-role";
import { updatePassword } from "../controllers/forgot-password-controllers/otp/update-password";
import { adminEdit } from "../controllers/role-controllers/admin-edit-controller";
import { updateUserSelfName } from "../controllers/feature-controllers/update-user-self-name";
import { deleteSelfUserProfile } from "../controllers/feature-controllers/delete-self-user-profile";
import { emailRateLimiter } from "../middleware/rate-limitter";
import {
  dislikeBlog,
  getLikeBlog,
  likeBlog,
} from "../controllers/feature-controllers/likes-controller";

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

// Get likes for blog
router.get("/blogpost/:postId/like", getLikeBlog);
// Like a post
router.post("/blogpost/:postId/like", likeBlog);
// Disike a post
router.post("/blogpost/:postId/dislike", dislikeBlog);

export default router;
