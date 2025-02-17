export const redirectUser = (role: string): string => {
  switch (role) {
    case "admin":
      return "/admin";
    case "editor":
      return "/editor";
    case "user":
      return "/user";
    default:
      return "/login";
  }
};
