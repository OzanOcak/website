import { Button } from "@/components/ui/button";
import React from "react";
import { useRouter } from "next/router";

const ErrorPage: React.FC = () => {
  const router = useRouter();

  // Get the error message from the query parameters
  const { message: errorMessage } = router.query;

  const handleGoHome = () => {
    router.push("/"); // Redirect to the home page
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-6xl font-bold text-red-600">Error</h1>
      <h2 className="mt-4 text-2xl font-semibold">Something Went Wrong</h2>
      {errorMessage && <p className="mt-2 text-gray-600">{errorMessage}</p>}
      <p className="mt-2 text-gray-600">
        Sorry, an error occurred while processing your request.
      </p>
      <Button onClick={handleGoHome} className="mt-6">
        Go to Home
      </Button>
    </div>
  );
};

export default ErrorPage;
