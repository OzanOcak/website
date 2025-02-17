"use client"; // Mark this as a Client Component
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface PrivateAuthLayoutProps {
  children: React.ReactNode; // Explicitly define the type of `children`
}

export default function PrivateAuthLayout({
  children,
}: PrivateAuthLayoutProps) {
  const router = useRouter();

  // Check for the access token in local storage
  const accessToken = localStorage.getItem("xg8a");
  const hasAccess = !!accessToken; // Convert to boolean

  useEffect(() => {
    if (!hasAccess) {
      router.push("/"); // Redirect to home if no access
    }
  }, [hasAccess, router]);

  // Render children if access is granted
  return hasAccess ? children : null;
}
