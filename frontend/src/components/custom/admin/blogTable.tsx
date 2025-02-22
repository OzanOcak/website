import { BlogType } from "@/app/(private)/(roles)/articles/page";
import Link from "next/link";
import { FaEllipsisH } from "react-icons/fa";

interface BlogPostTableProps {
  blogs: BlogType[];
}

const BlogPostTable: React.FC<BlogPostTableProps> = ({ blogs }) => {
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
                    <Link
                      href={`/admin/blogs/${blog.slug}`}
                      className="hover:text-black"
                    >
                      <FaEllipsisH className="text-md" />
                    </Link>
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
