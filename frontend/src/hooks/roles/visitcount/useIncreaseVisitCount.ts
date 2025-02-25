import axiosInstance from "@/utils/AxiosInterceptor";
import { useMutation } from "@tanstack/react-query";

const increaseCount = async () => {
  const response = await axiosInstance.post(`/increase-visit-count`);
  return response.data;
};

export const useIncreaseVisitCount = () => {
  return useMutation({
    mutationFn: increaseCount,
    onSuccess: () => {
      console.log("count is increase");
    },
    onError: (error) => {
      console.error("Error increasing count:", error);
    },
  });
};
