import Link from "next/link";
import React from "react";
import { FaEllipsisH } from "react-icons/fa";

type User = {
  id: string;
  username: string;
  email: string;
  role: string;
};

interface DataTableProps {
  users: User[]; // Expect an array of Users
}

const UserTable: React.FC<DataTableProps> = ({ users }) => {
  return (
    <div className="rounded-md border border-gray-200 overflow-hidden">
      {/* Wrapper for horizontal scrolling on mobile */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table Header */}
          <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                Role
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium  uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white dark:bg-gray-600 divide-y divide-gray-200 text-gray-500 dark:text-gray-200">
            {!users || users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm ">
                    {user.id}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {user.username}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm ">
                    {user.email}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm ">
                    {user.role}
                  </td>
                  <td className="flex justify-end mr-4 px-4 py-4 whitespace-nowrap text-sm text-right">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className=" hover:text-black"
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

export default UserTable;
