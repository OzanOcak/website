import axiosInstance from "@/utils/AxiosInterceptor";
import { useMutation } from "@tanstack/react-query";

const dislikePost = async (postId: string) => {
  const response = await axiosInstance.post(`/blogpost/${postId}/dislike`);
  return response.data;
};

export const useDislike = () => {
  return useMutation({
    mutationFn: dislikePost,
    onSuccess: () => {
      console.log("Post disliked successfully");
    },
    onError: (error) => {
      console.error("Error disliking post:", error);
    },
  });
};
