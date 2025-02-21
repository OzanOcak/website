import axiosInstance from "@/utils/AxiosInterceptor";
import { useQuery } from "@tanstack/react-query";

const fetchLikes = async (postId: string) => {
  const response = await axiosInstance.get(`/blogpost/${postId}/bloglikes`);
  return response.data;
};

export const useGetLikes = (postId: string) => {
  return useQuery({
    queryKey: ["blogpost", postId, "bloglikes"],
    queryFn: () => fetchLikes(postId),
  });
};
