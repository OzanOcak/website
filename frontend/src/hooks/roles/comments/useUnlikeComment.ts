import axiosInstance from "@/utils/AxiosInterceptor";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const unlikeComment = async (commentId: string) => {
  const response = await axiosInstance.post(
    `/comments/${commentId}/unlikecomment`
  );
  return response.data.comment;
};

export const useLikeComment = (postId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unlikeComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] }); // Refresh comments after liking
    },
    onError: (error) => {
      console.error("Error liking comment:", error);
    },
  });
};
