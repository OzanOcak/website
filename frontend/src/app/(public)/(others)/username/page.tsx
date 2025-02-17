"use client";
import { WelcomeMessage } from "@/components/oauth/welcome-message";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const UsernameEntryPage: React.FC = () => {
  const [profileName, setProfileName] = useState<string>(""); // State to store the profile name
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const searchParams = useSearchParams(); // Get query parameters
  const usernameFromQuery = searchParams.get("xyz"); // Extract the username

  const decodedUsername = usernameFromQuery
    ? decodeURIComponent(usernameFromQuery)
    : ""; // Decode the username

  // Set profileName in the parent component if username is not empty
  useEffect(() => {
    if (decodedUsername) {
      setProfileName(decodedUsername);
    }
    setLoading(false); // Mark loading as complete
  }, [decodedUsername]);

  // Show a loading spinner or message while waiting for the state to update
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-800 flex flex-col justify-center items-center">
        <div className="bg-white dark:bg-gray-700  p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 flex flex-col justify-center items-center">
      <div className="bg-white p-8 dark:bg-gray-700 rounded-lg shadow-md w-full max-w-md">
        {profileName && (
          // If profileName is not empty, show a welcome message
          <div>
            <WelcomeMessage profileName={profileName} />
          </div>
        )}
      </div>
    </div>
  );
};

export default UsernameEntryPage;
