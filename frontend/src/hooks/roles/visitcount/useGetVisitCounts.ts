import axiosInstance from "@/utils/AxiosInterceptor";
import { useQuery } from "@tanstack/react-query";

const visitCounts = async () => {
  const response = await axiosInstance.get(`/get-visit-count`);
  return response.data;
};

export const useGetVisitCounts = () => {
  return useQuery({
    queryKey: ["get-visit-count"],
    queryFn: () => visitCounts(),
  });
};
