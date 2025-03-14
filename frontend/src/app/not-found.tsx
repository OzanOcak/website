import Link from "next/link";
import React from "react";

const Custom404: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900  text-center p-4">
      <p className="text-[8rem] font-bold">404</p>

      {/* Title */}
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-300 mb-4">
        Page Not Found
      </h1>

      {/* Description */}
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        Oops! The page you are looking for does not exist.
      </p>

      {/* Back to Home Button */}
      <Link href="/">
        <div className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
          Go Back Home
        </div>
      </Link>
    </div>
  );
};

export default Custom404;
