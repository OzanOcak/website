import axiosInstance from "@/utils/AxiosInterceptor";
import { useMutation } from "@tanstack/react-query";

const editComment = async ({
  commentId,
  content,
}: {
  commentId: number;
  content: string;
}) => {
  const response = await axiosInstance.patch(`/comments/${commentId}`, {
    content,
  });
  return response.data;
};

export const useEditComment = () => {
  return useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: number;
      content: string;
    }) => editComment({ commentId, content }),
  });
};
