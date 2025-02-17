"use client"; // This makes it a Client Component

import React from "react";

type LinkItemProps = {
  id: string;
  text: string;
};

export const LinkItem: React.FC<LinkItemProps> = ({ id, text }) => {
  const handleScroll = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default anchor behavior
    const element = document.getElementById(id);
    //console.log("clicked");
    if (element) {
      // Smooth scroll to the target element
      element.scrollIntoView({ behavior: "smooth" });
      // console.log(element);
    }
  };

  return (
    <li className="pt-1 mb-2 text-lg font-normal text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white ">
      <a href={`#${id}`} onClick={handleScroll}>
        {text.slice(0, 50)}
        {text.length > 50 ? "..." : ""}
      </a>
    </li>
  );
};
