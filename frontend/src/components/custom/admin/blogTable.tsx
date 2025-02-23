"use client";
import { useState } from "react";
import { BlogType } from "@/app/(private)/(roles)/articles/page";
import axiosInstance from "@/utils/AxiosInterceptor";

interface BlogPostTableProps {
  blogs: BlogType[];
}

const BlogPostTable: React.FC<BlogPostTableProps> = ({ blogs }) => {
  const [loadingStates, setLoadingStates] = useState<{
    [slug: string]: boolean;
  }>({});

  const handlePublish = async (slug: string) => {
    setLoadingStates((prev) => ({ ...prev, [slug]: true })); // Set loading state
    try {
      await axiosInstance.post(`/admin/blogs/${slug}/publish`);
      // Optionally, refetch the blogs or update the UI
      alert(`Post ${slug} published successfully`);
    } catch (error) {
      console.error("Error publishing post:", error);
      alert("Failed to publish post");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [slug]: false })); // Reset loading state
    }
  };

  const handleUnpublish = async (slug: string) => {
    setLoadingStates((prev) => ({ ...prev, [slug]: true })); // Set loading state
    try {
      await axiosInstance.post(`/admin/blogs/${slug}/unpublish`);
      // Optionally, refetch the blogs or update the UI
      alert(`Post ${slug} unpublished successfully`);
    } catch (error) {
      console.error("Error unpublishing post:", error);
      alert("Failed to unpublish post");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [slug]: false })); // Reset loading state
    }
  };

  return (
    <div className="rounded-md border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Author
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-600 divide-y divide-gray-200 text-gray-500 dark:text-gray-200">
            {!blogs || blogs.length > 0 ? (
              blogs.map((blog) => (
                <tr key={blog.slug}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {blog.title}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    {blog.author}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    {blog.date}
                  </td>
                  <td className="flex justify-end mr-4 px-4 py-4 whitespace-nowrap text-sm text-right">
                    {blog.published ? (
                      <button
                        onClick={() => handleUnpublish(blog.slug)}
                        disabled={loadingStates[blog.slug]}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        {loadingStates[blog.slug]
                          ? "Unpublishing..."
                          : "Unpublish"}
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePublish(blog.slug)}
                        disabled={loadingStates[blog.slug]}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        {loadingStates[blog.slug] ? "Publishing..." : "Publish"}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-500"
                >
                  No results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlogPostTable;
