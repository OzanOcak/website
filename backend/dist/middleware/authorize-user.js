"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPermissionsToAuthorize = void 0;
const roles_permissions_1 = require("../config/roles_permissions");
const checkPermissionsToAuthorize = (...requiredPermissions) => {
    return (req, res, next) => {
        var _a;
        const userRole = req.role; // req.role is set in authenticate middleware
        // console.log("rolePermissions: ", roles[userRole]?.permissions);
        const rolePermissions = ((_a = roles_permissions_1.roles[userRole]) === null || _a === void 0 ? void 0 : _a.permissions) || [];
        // console.log(rolePermissions);
        // Check if the user has all the required permissions
        const hasPermission = requiredPermissions.every((permission) => rolePermissions.includes(permission));
        if (!hasPermission) {
            // Log the missing permissions for debugging
            console.error(`${userRole}" lacks permissions: ${requiredPermissions.join(", ")}`);
            res.status(403).json({ message: "Forbidden: You do not have access" });
            return;
        }
        next();
    };
};
exports.checkPermissionsToAuthorize = checkPermissionsToAuthorize;
