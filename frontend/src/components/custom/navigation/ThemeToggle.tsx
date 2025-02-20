"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

export function ModeSwitch() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const scrollY = window.scrollY; // Save the current scroll position

    // Disable smooth scrolling
    document.documentElement.style.scrollBehavior = "auto";
    setTheme(theme === "light" ? "dark" : "light");
    window.scrollTo(0, scrollY); // Restore the scroll position

    // Re-enable smooth scrolling after a short delay
    setTimeout(() => {
      document.documentElement.style.scrollBehavior = "smooth";
    }, 200); // Adjust the delay as needed
  };

  return (
    <div className="flex items-center">
      <label className="relative inline-flex items-center mx-2">
        <input
          type="checkbox"
          checked={theme === "dark"}
          onChange={toggleTheme}
          className="sr-only"
        />
        <div
          className={`w-14 h-8 p-0.5 rounded-full shadow-inner transition duration-200 ease-in-out ${
            theme === "dark" ? "bg-black" : "bg-gray-200"
          }`}
          style={{ minWidth: "3.5rem" }} // Ensure consistent width
        >
          <div
            className={`dot w-7 h-7 rounded-full shadow transition duration-200 ease-in-out transform ${
              theme === "dark" ? "translate-x-6 bg-black" : "bg-white"
            }`}
            style={{ minWidth: "1.75rem", minHeight: "1.75rem" }} // Ensure consistent size
          />
        </div>
        <SunIcon
          className={`absolute left-[.35rem] h-5 w-5 transition-opacity duration-200 ${
            theme === "dark" ? "opacity-0" : "opacity-100"
          } text-yellow-500`}
          style={{ top: "50%", transform: "translateY(-50%)" }} // Center vertically
        />
        <MoonIcon
          className={`absolute right-[.35rem] h-5 w-5 transition-opacity duration-200 ${
            theme === "light" ? "opacity-0" : "opacity-100"
          } text-white`}
          style={{ top: "50%", transform: "translateY(-50%)" }} // Center vertically
        />
      </label>
    </div>
  );
}

// npm install @radix-ui/react-icons
