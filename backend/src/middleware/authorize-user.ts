import { Request, Response, NextFunction } from "express";
import { roles, UserRole } from "../config/roles_permissions";

export const checkPermissionsToAuthorize = (
  ...requiredPermissions: string[]
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = req.role as UserRole; // req.role is set in authenticate middleware
    // console.log("rolePermissions: ", roles[userRole]?.permissions);
    const rolePermissions = roles[userRole]?.permissions || [];

    // console.log(rolePermissions);

    // Check if the user has all the required permissions
    const hasPermission = requiredPermissions.every((permission) =>
      rolePermissions.includes(permission)
    );

    if (!hasPermission) {
      // Log the missing permissions for debugging
      console.error(
        `${userRole}" lacks permissions: ${requiredPermissions.join(", ")}`
      );
      res.status(403).json({ message: "Forbidden: You do not have access" });
      return;
    }
    next();
  };
};
