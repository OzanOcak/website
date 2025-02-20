import { useStore } from "@/stores/useAuthStore";
import axiosInstance from "@/utils/AxiosInterceptor";
import { useMutation } from "@tanstack/react-query";

const updateUserRole = async (
  userId: string,
  newRole: string
): Promise<void> => {
  const { accessToken } = useStore.getState();
  //const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("No access token found: profile");
  }

  await axiosInstance.patch(
    `/admin/${userId}/role`,
    { newRole },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};

// Custom hook for deleting a user
export const useUpdateUserRole = () => {
  return useMutation<void, Error, { userId: string; newRole: string }>({
    mutationFn: ({ userId, newRole }) => updateUserRole(userId, newRole), // Specify the mutation function here
  });
};
