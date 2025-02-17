import { useStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const useSessionChecker = () => {
  const clearToken = useStore((state) => state.clearToken);
  const accessToken = useStore((state) => state.accessToken);
  //const accessToken = localStorage.getItem("accessToken");

  const router = useRouter();

  useEffect(() => {
    const checkLoginTimestamp = () => {
      const loginTimestamp = localStorage.getItem("loginTimestamp");
      const currentTime = Date.now();

      // If no access token is present, redirect to login
      if (!accessToken) {
        router.push("/login"); // Redirect to login page
        return;
      }

      // If loginTimestamp exists, check its validity
      if (loginTimestamp) {
        const timeDifference = currentTime - Number(loginTimestamp);
        const expirationTime = 4 * 60 * 1000; // 30 minutes

        // If the timestamp is older than the expiration time, clear the token and user data
        if (timeDifference > expirationTime) {
          clearToken(); // Clear access token and user data if session has expired
          router.push("/login"); // Redirect to login page after clearing
          console.log("session is expired");
        }

        // Restore the last path
        const lastPath = useStore.getState().lastPath;
        if (lastPath && lastPath !== "/login") {
          router.push(lastPath);
        }
      }
    };

    // Check the timestamp when the component mounts or when accessToken changes
    checkLoginTimestamp();

    // Set an interval to check periodically
    const intervalId = setInterval(checkLoginTimestamp, 60 * 1000); // Check every minute

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [accessToken, clearToken, router]);
};

export default useSessionChecker;
