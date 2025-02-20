import React, { useState, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback: ReactNode; // Define fallback as ReactNode type
}

const ErrorBoundary: React.FC<Props> = ({ children, fallback }) => {
  const [hasError, setHasError] = useState(false);

  const handleError = (error: Error) => {
    console.error("Caught an error:", error);
    setHasError(true);
  };

  const runWithErrorBoundary = () => {
    try {
      return <>{children}</>;
    } catch (error) {
      handleError(error as Error); // Handle the error
      return null; // Return null if there's an error
    }
  };

  if (hasError) {
    return <>{fallback}</>;
  }

  return runWithErrorBoundary(); // Render children wrapped in error handling
};

export default ErrorBoundary;
