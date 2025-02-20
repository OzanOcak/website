import axiosInstance from "@/utils/AxiosInterceptor";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const editComment = async (commentId: string) => {
  const response = await axiosInstance.post(`/comments/${commentId}/like`);
  return response.data.comment;
};

export const useEditComment = (postId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] }); // Refresh comments after liking
    },
    onError: (error) => {
      console.error("Error liking comment:", error);
    },
  });
};
