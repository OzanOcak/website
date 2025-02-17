export type User = {
  id: string; // or number, depending on your database
  username: string;
  role: string; // Consider using a union type for roles if they are known
};

export type UpdateUserRoleRequest = {
  userId: string; // or number
  newRole: string; // Consider using a union type for roles
};
