import { useStore } from "@/stores/useAuthStore";
import axiosInstance from "@/utils/AxiosInterceptor";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const unlikeComment = async (commentId: string) => {
  const userId = useStore.getState().id;
  const response = await axiosInstance.post(
    `/comments/${commentId}/commentunlike`,
    { userId }
  );
  return response.data.comment;
};

export const useUnlikeComment = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unlikeComment,
    onSuccess: () => {
      // Invalidate the comments query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
    onError: (error) => {
      console.error("Error unliking comment:", error);
    },
  });
};
