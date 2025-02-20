import { useStore } from "@/stores/useAuthStore";
import axiosInstance from "@/utils/AxiosInterceptor";
import { useMutation } from "@tanstack/react-query";

// Function to delete a user by ID
const deleteUser = async (userId: string): Promise<void> => {
  const { accessToken } = useStore.getState();
  //const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("No access token found: profile");
  }

  await axiosInstance.delete(`/admin/${userId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

// Custom hook for deleting a user
export const useDeleteUser = () => {
  return useMutation<void, Error, string>({
    mutationFn: deleteUser, // Specify the mutation function here
  });
};
