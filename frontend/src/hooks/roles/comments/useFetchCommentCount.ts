import axiosInstance from "@/utils/AxiosInterceptor";
import { useQuery } from "@tanstack/react-query";

// Function to fetch comment count
const fetchCommentCount = async (postId: string) => {
  const response = await axiosInstance.get(`/blogpost/${postId}/commentcount`);
  return response.data;
};

// Hook to get comment count
export const useGetCommentCount = (postId: string) => {
  return useQuery({
    queryKey: ["blogpost", postId, "commentcount"], // Unique query key
    queryFn: () => fetchCommentCount(postId),
  });
};
