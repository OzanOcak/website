// app/(protected)/layout.tsx
"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useStore } from "@/stores/useAuthStore";
import { routeConfig } from "./routeConfig";
import useInactivityTimeout from "@/hooks/sessions/useInactivityTimeout";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function PrivateLayout({ children }: ProtectedLayoutProps) {
  const router = useRouter();
  useInactivityTimeout();

  const pathname = usePathname(); // Get the current path

  const role = useStore((state) => state.role); // Get role from Zustand store
  const setPath = useStore((state) => state.setPath); // Get setPath from Zustand store

  // Check if the current path starts with /admin
  const isAdminRoute = pathname.startsWith("/admin");

  // Get required roles for admin routes if applicable
  const requiredRoles = isAdminRoute
    ? routeConfig.admin?.requiredRoles || []
    : [];

  const hasAccess = requiredRoles.includes(role); // Check if the user has the required roles
  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "/";

  useEffect(() => {
    if (isAdminRoute && !hasAccess) {
      router.push("/"); // Redirect to home if no access
    } else {
      setPath(currentPath); // Save the current path in the store
    }
  }, [hasAccess, isAdminRoute, router, currentPath, setPath]);

  // Render children if access is granted
  return hasAccess || !isAdminRoute ? children : null;
}
