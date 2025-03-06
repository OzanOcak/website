"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roles = void 0;
exports.roles = {
    admin: {
        permissions: [
            "view_profile",
            "view_users",
            "edit_user_role",
            "edit_self_user_name",
            "delete_user",
            "delete_self_user",
            "create_comment",
            "like_comment",
            "delete_comment",
            "edit_comment",
            "publish_post",
            "unpublish_post",
        ],
    },
    editor: {
        permissions: ["view_profile", "view_users"],
    },
    user: {
        permissions: [
            "view_profile",
            "edit_self_user_name",
            "delete_self_user",
            "create_comment",
            "like_comment",
            "delete_comment",
            "edit_comment",
        ],
    },
};
