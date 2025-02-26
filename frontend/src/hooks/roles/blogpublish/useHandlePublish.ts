import axiosInstance from "@/utils/AxiosInterceptor";
import { useMutation } from "@tanstack/react-query";

const publishPost = async (slug: string) => {
  const response = await axiosInstance.post(`/admin/blog/${slug}/publish`);
  return response.data;
};

export const useHandlePublish = () => {
  return useMutation({
    mutationFn: publishPost,
  });
};
