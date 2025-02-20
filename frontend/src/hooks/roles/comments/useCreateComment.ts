import axiosInstance from "@/utils/AxiosInterceptor";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const createComment = async ({
  postId,
  content,
  userId,
}: {
  postId: string;
  content: string;
  userId: number;
}) => {
  const response = await axiosInstance.post(`/posts/${postId}/comments`, {
    content,
    userId,
  });
  return response.data.comment;
};

export const useCreateComment = (postId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { content: string; userId: number }) =>
      createComment({ postId, ...data }),
    onSuccess: (newComment) => {
      queryClient.invalidateQueries({ queryKey: ["comments", newComment.id] }); // Refresh comments after creation
    },
    onError: (error) => {
      console.error("Error creating comment:", error);
    },
  });
};
