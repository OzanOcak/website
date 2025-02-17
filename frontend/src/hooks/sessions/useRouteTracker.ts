import { useStore } from "@/stores/useAuthStore";
import { useRouter } from "next/router";
import { useEffect } from "react";

const useRouteTracker = () => {
  const router = useRouter(); // next/router
  const currentPath = router.pathname;

  useEffect(() => {
    // Check if currentPath is valid
    useStore.getState().setPath(currentPath);
    //localStorage.setItem("lastPath", currentPath);
    // Log the updated state (optional)
    // console.log("Current store state after update:", useStore.getState());
  }, [currentPath]); // Include onComplete in the dependency array
};

export default useRouteTracker;
