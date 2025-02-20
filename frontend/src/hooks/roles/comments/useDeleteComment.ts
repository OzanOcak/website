import axiosInstance from "@/utils/AxiosInterceptor";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteComment = async (commentId: number) => {
  const response = await axiosInstance.delete(`/comments/${commentId}`);
  return response.data; // Assuming the response contains a message or relevant data
};

export const useDeleteComment = (commentId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),
    onSuccess: () => {
      // Refresh comments after deletion
      queryClient.invalidateQueries({ queryKey: ["comments", commentId] });
    },
    onError: (error) => {
      console.error("Error deleting comment:", error);
    },
  });
};
