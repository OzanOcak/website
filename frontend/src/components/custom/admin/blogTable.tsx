"use client";
import { useState } from "react";
import { BlogType } from "@/app/(private)/(roles)/articles/page";
import { useStore } from "@/stores/useAuthStore";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { useHandlePublish } from "@/hooks/roles/blogpublish/useHandlePublish";
import { useHandleUnpublish } from "@/hooks/roles/blogpublish/useHandleUnpublish";

interface BlogPostTableProps {
  blogs: BlogType[];
}

const BlogPostTable: React.FC<BlogPostTableProps> = ({ blogs }) => {
  const queryClient = useQueryClient();

  const [loadingStates, setLoadingStates] = useState<{
    [slug: string]: boolean;
  }>({});
  const userRole = useStore.getState().role;

  const { mutate: publishPost } = useHandlePublish();
  const { mutate: unpublishPost } = useHandleUnpublish();

  const handlePublish = (slug: string) => {
    setLoadingStates((prev) => ({ ...prev, [slug]: true })); // Set loading state
    publishPost(slug, {
      onSuccess: () => {
        setLoadingStates((prev) => ({ ...prev, [slug]: false })); // Reset loading state
        queryClient.invalidateQueries({ queryKey: ["articles"] }); // Invalidate the blogs query to refetch data
        //alert("Post published successfully");
      },
      onError: (error) => {
        setLoadingStates((prev) => ({ ...prev, [slug]: false })); // Reset loading state
        console.error("Error publishing post:", error);
        // alert("Failed to publish post");
      },
    });
  };

  const handleUnpublish = (slug: string) => {
    setLoadingStates((prev) => ({ ...prev, [slug]: true })); // Set loading state
    unpublishPost(slug, {
      onSuccess: () => {
        setLoadingStates((prev) => ({ ...prev, [slug]: false })); // Reset loading state
        queryClient.invalidateQueries({ queryKey: ["articles"] }); // Invalidate the blogs query to refetch data
        // alert("Post unpublished successfully");
      },
      onError: (error) => {
        setLoadingStates((prev) => ({ ...prev, [slug]: false })); // Reset loading state
        console.error("Error unpublishing post:", error);
        // alert("Failed to unpublish post");
      },
    });
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
            {!blogs || blogs.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-500"
                >
                  No results.
                </td>
              </tr>
            ) : (
              blogs
                .filter((blog) => {
                  // Show all blogs for admin
                  if (userRole === "admin") return true;
                  // Show only published blogs for non-admin users
                  return blog.published;
                })
                .map((blog) => (
                  <tr key={blog.slug}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {blog.title.length > 15
                        ? `${blog.title.substring(0, 25)}...`
                        : blog.title}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {blog.author}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {blog.date}
                    </td>
                    <td className="flex justify-end mr-4 px-4 py-4 whitespace-nowrap text-sm text-right">
                      {userRole === "admin" ? (
                        <>
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
                              {loadingStates[blog.slug]
                                ? "Publishing..."
                                : "Publish"}
                            </button>
                          )}
                        </>
                      ) : (
                        <Link href={`/blogpost/${blog.slug}`}>
                          <div className="bg-green-800 hover:bg-green-700 px-2 py-1 rounded-md">
                            READ
                          </div>
                        </Link>
                      )}
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlogPostTable;
