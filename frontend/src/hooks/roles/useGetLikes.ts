import axiosInstance from "@/utils/AxiosInterceptor";
import { useQuery } from "@tanstack/react-query";

const fetchLikes = async (postId: string) => {
  const response = await axiosInstance.get(`/blogpost/${postId}/like`);
  return response.data;
};

export const useGetLikes = (postId: string) => {
  return useQuery({
    queryKey: ["blogpost", postId, "likes"],
    queryFn: () => fetchLikes(postId),
  });
};
