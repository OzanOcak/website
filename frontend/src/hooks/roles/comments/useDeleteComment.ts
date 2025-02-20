import axiosInstance from "@/utils/AxiosInterceptor";
import { useMutation } from "@tanstack/react-query";

const deleteComment = async (commentId: number) => {
  const response = await axiosInstance.delete(`/comments/${commentId}`);
  return response.data;
};

export const useDeleteComment = () => {
  return useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),
  });
};
