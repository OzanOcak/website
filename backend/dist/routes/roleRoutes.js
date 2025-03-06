"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_user_1 = require("../middleware/authenticate-user");
const authorize_user_1 = require("../middleware/authorize-user");
const user_controller_1 = require("../controllers/role-controllers/user-controller");
const admin_controller_1 = require("../controllers/role-controllers/admin-controller");
const delete_user_profile_1 = require("../controllers/feature-controllers/admin/delete-user-profile");
const update_password_1 = require("../controllers/forgot-password-controllers/otp/update-password");
const admin_edit_controller_1 = require("../controllers/role-controllers/admin-edit-controller");
const rate_limitter_1 = require("../middleware/rate-limitter");
const update_user_role_1 = require("../controllers/feature-controllers/admin/update-user-role");
const update_user_self_name_1 = require("../controllers/feature-controllers/user/update-user-self-name");
const delete_self_user_profile_1 = require("../controllers/feature-controllers/user/delete-self-user-profile");
const unpublish_post_1 = require("../controllers/feature-controllers/admin/unpublish-post");
const publish_post_1 = require("../controllers/feature-controllers/admin/publish-post");
const router = (0, express_1.Router)();
// user route
router.get("/profile", authenticate_user_1.authenticate, (0, authorize_user_1.checkPermissionsToAuthorize)("view_profile"), user_controller_1.user);
// admin routes
router.get("/admin", authenticate_user_1.authenticate, (0, authorize_user_1.checkPermissionsToAuthorize)("view_profile", "view_users", "edit_user_role", "delete_user"), admin_controller_1.admin);
// admin's user profile routes for editing
router.get("/admin/users/:userId", authenticate_user_1.authenticate, (0, authorize_user_1.checkPermissionsToAuthorize)("view_profile", "view_users", "edit_user_role", "delete_user"), admin_edit_controller_1.adminEdit);
router.delete("/admin/:userId", authenticate_user_1.authenticate, (0, authorize_user_1.checkPermissionsToAuthorize)("delete_user"), delete_user_profile_1.deleteUserProfile);
router.patch("/admin/:userId/role", authenticate_user_1.authenticate, (0, authorize_user_1.checkPermissionsToAuthorize)("edit_user_role"), update_user_role_1.updateUserRole);
router.post("/admin/blog/:slug/publish", authenticate_user_1.authenticate, (0, authorize_user_1.checkPermissionsToAuthorize)("publish_post"), // Only admins can publish posts
publish_post_1.publishPost);
router.post("/admin/blog/:slug/unpublish", authenticate_user_1.authenticate, (0, authorize_user_1.checkPermissionsToAuthorize)("unpublish_post"), // Only admins can unpublish posts
unpublish_post_1.unpublishPost);
router.patch("/profile/:userId/name", rate_limitter_1.emailRateLimiter, authenticate_user_1.authenticate, (0, authorize_user_1.checkPermissionsToAuthorize)("edit_self_user_name"), update_user_self_name_1.updateUserSelfName);
router.delete("/profile/:userId", authenticate_user_1.authenticate, (0, authorize_user_1.checkPermissionsToAuthorize)("delete_self_user"), delete_self_user_profile_1.deleteSelfUserProfile);
router.patch("/users/:userId/password", authenticate_user_1.authenticate, // Ensure user is authenticated
(0, authorize_user_1.checkPermissionsToAuthorize)("edit_self_user_name"), // Allow users to change their own password
update_password_1.updatePassword);
exports.default = router;
