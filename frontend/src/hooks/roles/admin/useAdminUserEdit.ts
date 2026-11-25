import { useStore } from "@/stores/useAuthStore";
import axiosInstance from "@/utils/AxiosInterceptor";
import { useQuery } from "@tanstack/react-query";

const fetchUserById = async (userId: string) => {
  const { accessToken } = useStore.getState(); // Get the access token from Zustand store

  if (!accessToken) {
    throw new Error("No access token found.");
  }

  const response = await axiosInstance.get(`/admin/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`, // Include the token
    },
  });

  console.log("Fetched User:", response.data.user);
  return response.data.user; // Return the user data
};
export const useAdminUserEdit = (userId: string) => {
  return useQuery({
    queryKey: ["adminUser", userId], // Unique query key
    queryFn: () => fetchUserById(userId), // Fetch function
    enabled: !!userId, // Only run the query if userId is defined
  });
};
