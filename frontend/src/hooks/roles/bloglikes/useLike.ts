import axiosInstance from "@/utils/AxiosInterceptor";
import { useMutation } from "@tanstack/react-query";

const likePost = async (postId: string) => {
  const response = await axiosInstance.post(`/blogpost/${postId}/likeblog`);
  return response.data;
};

export const useLike = () => {
  return useMutation({
    mutationFn: likePost,
    onSuccess: () => {
      console.log("Post liked successfully");
    },
    onError: (error) => {
      console.error("Error liking post:", error);
    },
  });
};
