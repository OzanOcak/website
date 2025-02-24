import { useStore } from "@/stores/useAuthStore";
import axiosInstance from "@/utils/AxiosInterceptor";
import { useQuery } from "@tanstack/react-query";

const fetchTotalVisit = async () => {
  const { accessToken } = useStore.getState(); // Get the access token from Zustand store
  //const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("No access token found: profile");
  }

  const response = await axiosInstance.get("/admin/total-visits", {
    headers: {
      Authorization: `Bearer ${accessToken}`, // Include the token
    },
  });
  console.log("All Users:", response.data);
  return response.data;
};

const useTotalVisit = () => {
  return useQuery({
    queryKey: ["admin", "total-visits"],
    queryFn: () => fetchTotalVisit(),
  });
};
export default useTotalVisit;
