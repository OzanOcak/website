export type UserRole = "admin" | "editor" | "user";

export const roles: Record<UserRole, { permissions: string[] }> = {
  admin: {
    permissions: [
      "view_profile",
      "view_users",
      "edit_user_role",
      "edit_self_user_name",
      "delete_user",
      "delete_self_user",
    ],
  },
  editor: {
    permissions: ["view_profile", "view_users"],
  },
  user: {
    permissions: ["view_profile", "edit_self_user_name", "delete_self_user"],
  },
};
