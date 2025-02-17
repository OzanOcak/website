// app/(public)/layout.tsx
"use client"; // Mark this as a Client Component
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useStore } from "@/stores/useAuthStore"; // Import your Zustand store

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const pathname = usePathname(); // Get the current path
  const setPath = useStore((state) => state.setPath); // Get setPath from Zustand store

  useEffect(() => {
    setPath(pathname); // Save the current path in the store
  }, [pathname, setPath]);

  // Render children
  return children;
}
