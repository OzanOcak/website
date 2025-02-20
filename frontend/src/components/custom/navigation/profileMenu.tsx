"use client";
import { useLogout } from "@/hooks/auth/useLogout";
import { useUserName } from "@/hooks/roles/useProfile";
import { useCallback, useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { FaUser } from "react-icons/fa";
import Link from "next/link";

export const ProfileMenu = () => {
  const { data: profile, isLoading, isError, error } = useUserName();
  const { mutate: logout } = useLogout();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null); // Ref for the dropdown

  useEffect(() => {
    if (isError) {
      console.error("Error fetching profile data:", error);
    }
  }, [isError, error]);

  const AvatarComponent = useCallback(
    () => (
      <div
        className="flex flex-col items-center cursor-pointer w-10"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Avatar className="w-10 h-10">
          {isLoading || isError ? (
            <div className="w-10 h-10 bg-gray-300 animate-pulse rounded-full"></div>
          ) : null}
          {isLoading || isError ? null : (
            <>
              <AvatarImage src={profile?.profilePicture} />
              <AvatarFallback>
                <FaUser className="w-6 h-6 text-gray-500" />
              </AvatarFallback>
            </>
          )}
        </Avatar>
        {/*<p className="w-full text-center text-sm font-bold h-6">
          {profile?.username}
        </p>*/}
      </div>
    ),
    [isLoading, isError, profile?.profilePicture]
  );

  const handleLogout = useCallback(() => {
    logout();
    setIsOpen(false); // Close the dropdown after logout
  }, [logout]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div
      className="relative h-16 flex items-center justify-center bg-gray-800/0 dark:bg-gray-900/0"
      id="avatar"
    >
      <AvatarComponent />
      {isOpen && (
        <div
          ref={dropdownRef} // Attach the ref to the dropdown
          className="absolute right-[-1rem] mt-56 w-48 bg-gray-700 border border-gray-600 rounded-md shadow-lg z-50"
        >
          <div className="py-2">
            <Link
              href="/profile" // Make the entire area clickable
              className="block px-4 py-2 text-gray-200 hover:bg-gray-600 transition duration-200"
            >
              <div className="w-full text-left">Profile</div>
            </Link>
            <Link
              href={`/${profile.role}`} // Make the entire area clickable
              className="block px-4 py-2 text-gray-200 hover:bg-gray-600 transition duration-200"
            >
              <div className="w-full text-left capitalize">
                {`${profile.role} page`}{" "}
              </div>
            </Link>

            <div className="border-t border-gray-600"></div>
            <div
              className="px-4 py-2 text-gray-200 hover:bg-gray-600 cursor-pointer"
              onClick={handleLogout}
            >
              Sign Out
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
