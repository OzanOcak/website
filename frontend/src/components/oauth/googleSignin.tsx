import { useGoogleSignInUrl } from "@/hooks/oauth/useGoogleSignin";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc"; // Import the Google icon

export const GoogleSignInButton: React.FC = () => {
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);

  // Pass isClicked to control when to fetch the URL
  const { data, error /*, isLoading */ } = useGoogleSignInUrl(isClicked);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevent default button behavior
    if (isDisabled) {
      return; // Prevent further clicks if disabled
    }

    // Enable fetching by setting isClicked to true
    setIsClicked(true);
    setIsDisabled(true);

    sessionStorage.setItem("oauth_provider", "google"); // Store the provider
  };

  // Handle redirect when data is available
  React.useEffect(() => {
    if (data && data.url) {
      window.location.href = data.url; // Redirect to Google sign-in URL
    }
  }, [data]);

  return (
    <div className="flex flex-col items-center">
      {/*isLoading && (
        <div className="text-red-600 mb-2">Loading sign-in URL...</div>
      )*/}

      {/* Check for error and display a user-friendly message */}
      {error && (
        <div className="text-red-600 mb-2">
          {error.message.includes("429")
            ? "Too many sign-in attempts. Please wait to sign-in again."
            : error.message}
        </div>
      )}

      {/* Button to initiate sign-in process */}
      <button
        onClick={handleClick}
        disabled={isDisabled}
        className={`flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors duration-200 ${
          isDisabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        style={{ outline: "none" }} // This line removes the default outline
      >
        <FcGoogle className="text-xl" /> {/* Google logo */}
        <span>{isDisabled ? "Signing in..." : "Sign in with Google"}</span>
      </button>
    </div>
  );
};

/* React Query enabled :
if we dont pass boolean to useGoogleSignInUrl, it will return url everytime user visit login
  `const { data, error , isLoading  } = useGoogleSignInUrl(isClicked);`
so we pass props as default false to add it react query enabled to make it false unill we click the button
*/
