"use client";
import { useEffect, useState } from "react";
import { X, Triangle } from "lucide-react";
import { useRouter } from "next/navigation"; // For Next.js

const CloseButton = () => {
  const router = useRouter();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false); // Shared visibility state
  const [startHeight, setStartHeight] = useState(0); // Height at which the close button appears

  // Handle redirection to /blog
  const handleClose = () => {
    router.push("/blog");
  };

  // Track scroll progress of the entire page
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY; // Current scroll position
      // const totalHeight =
      //   document.documentElement.scrollHeight - window.innerHeight; // Total scrollable height

      // Show/hide buttons when the user scrolls down 300px
      if (scrollY > 300) {
        if (!isVisible) {
          setIsVisible(true);
          setStartHeight(scrollY); // Set the height at which the close button appears
        }

        // Calculate progress based on the height after the close button appears
        // const adjustedHeight = totalHeight - startHeight;
        // const progress = ((scrollY - startHeight) / adjustedHeight) * 100;
        // setScrollProgress(progress > 0 ? progress : 0); // Ensure progress doesn't go below 0
      } else {
        setIsVisible(false);
        setStartHeight(0); // Reset start height
        setScrollProgress(0); // Reset progress
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isVisible, startHeight]);

  // Calculate stroke dashoffset for SVG
  const radius = 20; // Radius of the circle
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (scrollProgress / 100) * circumference;

  return (
    <>
      {/* Close Button */}
      {isVisible && (
        <div className="fixed top-4 right-8">
          <button
            onClick={handleClose}
            className="relative p-2 bg-gray-200 text-black rounded-full hover:bg-gray-300 transition-all duration-300"
          >
            <svg
              className="absolute top-0 left-0 w-full h-full"
              viewBox="0 0 44 44"
            >
              <circle
                cx="22"
                cy="22"
                r="20"
                fill="none"
                stroke="#31ce7d" // Use bg-green-400 color
                strokeWidth="3" // Increase strokeWidth for a thicker border
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 22 22)" // Start progress from the top
              />
            </svg>
            <div className="relative z-10">
              <X size={24} strokeWidth={5} /> {/* Lucide "X" icon */}
            </div>
          </button>
        </div>
      )}

      {/* Scroll-to-Top Button */}
      {isVisible && (
        <div className="fixed bottom-8 right-8">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="p-2.5 bg-gray-800 dark:bg-gray-200 text-gray-100 dark:text-black rounded-full shadow-lg hover:bg-gray-700 dark:hover:bg-gray-400 transition-all duration-300"
          >
            <Triangle size={24} strokeWidth={5} />
          </button>
        </div>
      )}
    </>
  );
};

export default CloseButton;
