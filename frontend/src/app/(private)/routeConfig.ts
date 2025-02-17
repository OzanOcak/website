// app/(protected)/routeConfig.ts
interface RouteConfig {
  [key: string]: {
    requiredRoles: string[];
  };
}

export const routeConfig: RouteConfig = {
  user: {
    requiredRoles: ["user"],
  },
  editor: {
    requiredRoles: ["editor"],
  },
  admin: {
    requiredRoles: ["admin"],
  },
  "admin/users": {
    requiredRoles: ["admin"],
  },
  "admin/users/[userId]": {
    requiredRoles: ["admin"],
  },
};
