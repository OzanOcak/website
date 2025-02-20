import React, { useCallback } from "react";
import Link from "next/link";
import { useStore } from "@/stores/useAuthStore";
import { SheetClose } from "../../ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useUserName } from "@/hooks/roles/useProfile";
import { useLogout } from "@/hooks/auth/useLogout";
import { Avatar, AvatarImage } from "../../ui/avatar";
import { SignIn } from "./signinButton";

interface MobileNavProps {
  onClose?: () => void; // Optional callback when the sheet is closed
}

export const MobileNav: React.FC<MobileNavProps> = ({ onClose }) => {
  const { data: profile /*, isLoading, isError, error */ } = useUserName();
  const { mutate: logout } = useLogout();
  const accessToken = useStore((state) => state.accessToken);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return (
    <div>
      <ul className="flex flex-col gap-4">
        {accessToken ? (
          <Avatar className="ml-3">
            <AvatarImage src={profile?.profilePicture} />
          </Avatar>
        ) : null}
        <li>
          <SheetClose asChild>
            <Link
              href="/"
              className="block px-4 py-2 font-bold text-gray-700 dark:text-gray-100 hover:bg-gray-500 hover:font-extrabold transition duration-200"
              onClick={onClose} // Optional: Call onClose if needed
            >
              Home
            </Link>
          </SheetClose>
        </li>
        <li>
          <SheetClose asChild>
            <Link
              href="/apps"
              className="block px-4 py-2 font-bold text-gray-700  dark:text-gray-100 hover:bg-gray-500 hover:font-extrabold transition duration-200"
              onClick={onClose} // Optional: Call onClose if needed
            >
              Apps
            </Link>
          </SheetClose>
        </li>
        <li>
          <SheetClose asChild>
            <Link
              href="/blog"
              className="block px-4 py-2 font-bold text-gray-700  dark:text-gray-100 hover:bg-gray-500 hover:font-extrabold transition duration-200"
              onClick={onClose} // Optional: Call onClose if needed
            >
              Blog
            </Link>
          </SheetClose>
        </li>
        <li>
          <SheetClose asChild>
            <div> {accessToken ? null : <SignIn onClose={onClose} />}</div>
          </SheetClose>
        </li>
        {accessToken && <Separator />}
        <li>
          <SheetClose asChild>
            {accessToken ? (
              <Link
                href="/profile"
                className="block px-4 py-2 font-bold text-gray-700  dark:text-gray-100 hover:bg-gray-500 hover:font-extrabold transition duration-200"
                onClick={onClose} // Optional: Call onClose if needed
              >
                Profile
              </Link>
            ) : null}
          </SheetClose>
        </li>
        <li>
          {profile && profile.role === "admin" ? (
            <SheetClose asChild>
              <Link
                href={`/${profile.role}`} // Make the entire area clickable
                className="block px-4 py-2 font-bold text-gray-700  dark:text-gray-100 hover:bg-gray-500 hover:font-extrabold transition duration-200"
              >
                <span className="w-full text-left">Admin Page</span>
              </Link>
            </SheetClose>
          ) : null}
        </li>
        <li>
          {accessToken ? (
            <Link
              href="/"
              className="block px-4 py-2 font-bold text-red-700  dark:text-gray-100 hover:bg-gray-500 hover:font-extrabold transition duration-200"
              onClick={handleLogout} // Optional: Call onClose if needed
            >
              <SheetClose>Sign Out</SheetClose>
            </Link>
          ) : null}
        </li>
      </ul>
    </div>
  );
};
