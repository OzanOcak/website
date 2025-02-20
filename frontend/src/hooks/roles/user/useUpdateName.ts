import { useStore } from "@/stores/useAuthStore";
import axiosInstance from "@/utils/AxiosInterceptor";
import { useMutation } from "@tanstack/react-query";

const updateUserName = async (
  userId: string,
  newName: string
): Promise<void> => {
  const { accessToken } = useStore.getState();
  //const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("No access token found: profile");
  }

  await axiosInstance.patch(
    `/profile/${userId}/name`,
    { newName },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};

// Custom hook for deleting a user
export const useUpdateUserName = () => {
  const username = useStore((state) => state.name);
  const setUsername = useStore((state) => state.setName);

  return useMutation<void, Error, { userId: string; newName: string }>({
    mutationFn: ({ userId, newName }) => updateUserName(userId, newName), // Specify the mutation function here
    onSuccess: () => {
      setUsername(username);
    },
  });
};
