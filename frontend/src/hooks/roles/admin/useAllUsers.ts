import { useStore } from "@/stores/useAuthStore";
import axiosInstance from "@/utils/AxiosInterceptor";
import { useQuery } from "@tanstack/react-query";

const fetchAllUsers = async () => {
  const { accessToken } = useStore.getState(); // Get the access token from Zustand store
  //const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("No access token found: profile");
  }

  const response = await axiosInstance.get("/editor", {
    headers: {
      Authorization: `Bearer ${accessToken}`, // Include the token
    },
  });
  console.log("All Users:", response.data.users);
  return response.data;
};

const useAllUsers = () => {
  return useQuery({
    queryKey: ["editor"],
    queryFn: () => fetchAllUsers(),
  });
};
export default useAllUsers;
