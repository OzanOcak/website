import axiosInstance from "@/utils/AxiosInterceptor";
import { useQuery } from "@tanstack/react-query";

const fetchComments = async (postId: string) => {
  const response = await axiosInstance.get(`/posts/${postId}/comments`);
  return response.data.comments;
};

export const useGetComments = (postId: string) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
  });
};
