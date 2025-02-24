import { Router } from "express";

import { authenticate } from "../middleware/authenticate-user";
import { checkPermissionsToAuthorize } from "../middleware/authorize-user";
import { user } from "../controllers/role-controllers/user-controller";
import { admin } from "../controllers/role-controllers/admin-controller";
import { deleteUserProfile } from "../controllers/feature-controllers/admin/delete-user-profile";
import { updatePassword } from "../controllers/forgot-password-controllers/otp/update-password";
import { adminEdit } from "../controllers/role-controllers/admin-edit-controller";
import { emailRateLimiter } from "../middleware/rate-limitter";
import { updateUserRole } from "../controllers/feature-controllers/admin/update-user-role";
import { updateUserSelfName } from "../controllers/feature-controllers/user/update-user-self-name";
import { deleteSelfUserProfile } from "../controllers/feature-controllers/user/delete-self-user-profile";
import { unpublishPost } from "../controllers/feature-controllers/admin/unpublish-post";
import { publishPost } from "../controllers/feature-controllers/admin/publish-post";

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

router.post(
  "/admin/blogs/:slug/publish",
  authenticate,
  checkPermissionsToAuthorize("publish_post"), // Only admins can publish posts
  publishPost
);

router.post(
  "/admin/blogs/:slug/unpublish",
  authenticate,
  checkPermissionsToAuthorize("unpublish_post"), // Only admins can unpublish posts
  unpublishPost
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

router.patch(
  "/users/:userId/password",
  authenticate, // Ensure user is authenticated
  checkPermissionsToAuthorize("edit_self_user_name"), // Allow users to change their own password
  updatePassword
);

export default router;
