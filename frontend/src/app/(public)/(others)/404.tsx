import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

const NotFound: React.FC = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/"); // Redirect to the home page
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-6xl font-bold text-red-600">404</h1>
      <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>
      <p className="mt-2 text-gray-600">
        Sorry, the page you are looking for does not exist.
      </p>
      <Button onClick={handleGoHome} className="mt-6">
        Go to Home
      </Button>
    </div>
  );
};

export default NotFound;
