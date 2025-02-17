import { useStore } from "@/stores/useAuthStore";
import { useEffect } from "react";

const useInactivityTimeout = (timeoutDuration = 30 * 60 * 1000) => {
  // Default to 30 minutes

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleActivity = () => {
      // Clear the existing timeout
      clearTimeout(timeoutId);

      // Reset the timeout
      timeoutId = setTimeout(() => {
        console.log("Inactivity timeout reached. Clearing token.");
        localStorage.removeItem("loginTimestamp"); // Clear the local storage and access token
        useStore.getState().clearToken(); // Clear access token and user data
      }, timeoutDuration);
    };

    // Add event listeners for user activity
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keypress", handleActivity);
    window.addEventListener("click", handleActivity);
    window.addEventListener("scroll", handleActivity);

    // Initialize the timeout
    handleActivity();

    // Clean up the event listeners and timeout on component unmount
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keypress", handleActivity);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("scroll", handleActivity);
    };
  }, [timeoutDuration]);
};

export default useInactivityTimeout;
