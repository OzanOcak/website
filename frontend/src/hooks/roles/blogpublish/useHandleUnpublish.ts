import axiosInstance from "@/utils/AxiosInterceptor";
import { useMutation } from "@tanstack/react-query";

const unpublishPost = async (slug: string) => {
  const response = await axiosInstance.post(`/admin/blog/${slug}/unpublish`);
  return response.data;
};

export const useHandleUnpublish = () => {
  return useMutation({
    mutationFn: unpublishPost,
  });
};
