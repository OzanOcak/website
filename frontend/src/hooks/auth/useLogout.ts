import { useStore } from "@/stores/useAuthStore";
//import { clearTokens } from "@/lib/clearTokens";
import axiosInstance from "@/utils/AxiosInterceptor";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

// Function to handle user logout
const logoutUser = async (): Promise<void> => {
  const refreshTokenId = useStore.getState().refreshTokenId;
  // we cant use function call cz it is not react function which returns jsx
  // const refreshTokenId = localStorage.getItem("refreshTokenId");

  if (!refreshTokenId) return;

  // Attempt to log out
  try {
    await axiosInstance.post(
      "/logout",
      {}, // Send an empty body
      {
        headers: {
          "refresh-token-id": refreshTokenId, // Send refreshTokenId in a custom header
        },
      },
    );
  } catch (error) {
    console.error("Logout failed:", error);
  }
  //useStore.getState().clearToken();
};

// Custom hook for logout
export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearToken = useStore((state) => state.clearToken); //useStore.getState().clearToken;
  return useMutation({
    mutationFn: logoutUser,
    mutationKey: ["logout"],
    onSettled: () => {
      clearToken(); // reset Zustand in-memory
      useStore.persist.clearStorage(); // wipe persisted Zustand
      queryClient.removeQueries({ queryKey: ["user"] }); // drop cached profile
      localStorage.removeItem("store"); // legacy cleanup
      router.push("/login"); // redirect
    },
    onError: (error: Error) => {
      console.error("Logout failed:", error.message);
    },
  });
};
