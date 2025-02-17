import { useOauthLogin } from "@/hooks/oauth/useOathLogin";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export const WelcomeMessage: React.FC<{ profileName: string }> = ({
  profileName,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  // Use the useOauthLogin hook
  const loginMutation = useOauthLogin(setErrorMessage);

  // Automatically trigger the mutation when profileName changes
  useEffect(() => {
    if (profileName) {
      setErrorMessage(null); // Clear any previous errors
      loginMutation.mutate({ username: profileName });
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileName]); // adding loginMutation makes max call

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-center">
          Welcome, {profileName}!
        </h1>
        {/* Show loading animation if the mutation is in progress */}
        {loginMutation.isPending && (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2">Loading profile...</span>
          </div>
        )}
      </div>
      {/* Show error message if the mutation fails */}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm">
          {errorMessage}
        </div>
      )}
    </>
  );
};
