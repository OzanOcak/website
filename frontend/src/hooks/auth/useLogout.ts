import { useStore } from "@/stores/useAuthStore";
//import { clearTokens } from "@/lib/clearTokens";
import axiosInstance from "@/utils/AxiosInterceptor";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

// Function to handle user logout
const logoutUser = async (): Promise<void> => {
  const refreshTokenId = useStore.getState().refreshTokenId;
  // we cant use function call cz it is not react function which returns jsx
  // const refreshTokenId = localStorage.getItem("refreshTokenId");

  if (!refreshTokenId) {
    throw new Error("No refresh token ID found for logout.");
  }

  // Attempt to log out
  try {
    await axiosInstance.post(
      "/logout",
      {}, // Send an empty body
      {
        headers: {
          "refresh-token-id": refreshTokenId, // Send refreshTokenId in a custom header
        },
      }
    );
  } catch (error) {
    console.error("Logout failed:", error);
    throw new Error("Logout failed due to an unexpected error.");
  }
  //useStore.getState().clearToken();
};

// Custom hook for logout
export const useLogout = () => {
  const router = useRouter();
  const clearToken = useStore((state) => state.clearToken); //useStore.getState().clearToken;
  return useMutation({
    mutationFn: logoutUser,
    mutationKey: ["logout"],
    onSuccess: async () => {
      await clearToken(); // zustand items deleted
      localStorage.removeItem("store");
      // local storage key keeps zustand store object deleted
      console.log("User logged out successfully.");
      router.push("/login");
    },
    onError: (error: Error) => {
      console.error("Logout failed:", error.message);
    },
  });
};
