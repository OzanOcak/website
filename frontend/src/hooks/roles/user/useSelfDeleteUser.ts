import { useStore } from "@/stores/useAuthStore";
import axiosInstance from "@/utils/AxiosInterceptor";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

// Function to delete a user by ID
const selfDeleteUser = async (userId: string): Promise<void> => {
  const { accessToken } = useStore.getState();

  if (!accessToken) {
    throw new Error("No access token found: profile");
  }

  await axiosInstance.delete(`/profile/${userId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

// Custom hook for deleting a user
export const useSelfDeleteUser = () => {
  const router = useRouter();
  const deleteTokens = useStore((state) => state.clearToken);
  return useMutation<void, Error, string>({
    mutationFn: selfDeleteUser, // Specify the mutation function here
    onSuccess: () => {
      deleteTokens();
      router.push("/");
    },
  });
};
