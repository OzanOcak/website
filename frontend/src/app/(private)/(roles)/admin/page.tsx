"use client";
import { useAdmin } from "@/hooks/roles/useAdmin";
import Layout from "@/components/custom/layout";
import { Pending } from "@/components/custom/isPending";
import { Erroring } from "@/components/custom/isError";
import UserTable from "@/components/custom/admin/userTable";
import { useEffect, useState } from "react";
import { useStore } from "@/stores/useAuthStore";
import SearchBox from "@/components/custom/admin/searchBox";

export default function AdminPage() {
  const { userDeleted, setUserDeleted } = useStore();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("name");

  const { data, isLoading, isError, refetch } = useAdmin(
    page,
    limit,
    searchQuery,
    searchCriteria
  );

  useEffect(() => {
    if (userDeleted) {
      refetch(); // Refetch if a user was deleted
      setUserDeleted(false); // Reset the state
    }
  }, [userDeleted, refetch, setUserDeleted]);

  const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(event.target.value));
    setPage(1); // Reset to the first page when limit changes
  };

  const handleSearch = (query: string, criteria: string) => {
    setSearchQuery(query); // Update searchQuery in the parent
    setSearchCriteria(criteria); // Update searchCriteria in the parent
    setPage(1); // Reset to the first page when performing a new search
  };

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  if (isLoading) return <Pending />;
  if (isError) return <Erroring />;

  return (
    <Layout>
      <div className="mt-4 w-full">
        <h2 className="text-2xl font-bold mb-2">List of All Users:</h2>

        {/* Search Box */}
        <SearchBox onSearch={handleSearch} />

        {/* Pagination Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm md:text-[1rem]">Items per page:</span>
            <select
              value={limit}
              onChange={handleLimitChange}
              className="border border-gray-300 rounded-md p-1 mr-1"
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={page === 1}
              className="px-2 py-1 bg-gray-200 dark:bg-gray-600 hover:dark:bg-gray-700 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm md:text-[1rem]">
              Page {page} of {data ? Math.ceil(data.total / limit) : page}
            </span>
            <button
              onClick={handleNextPage}
              disabled={!data || page >= Math.ceil(data.total / limit)}
              className="px-2 py-1 bg-gray-200 dark:bg-gray-600 hover:dark:bg-gray-700 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {/* User Table */}
        {/*data ? <UserTable users={data.users} /> : <Fallback />*/}
        <UserTable users={data?.users ?? []} />
      </div>
    </Layout>
  );
}

/* FETCHING FLOW:
1- user navigate to admin page then react components mounted and useAdmin custom react query hook is called
2- const { data: allUsers, isLoading, isError } = useAdmin() supposedly return users to display
3- const useAdmin = () => {
    return useQuery({
      queryKey: ["admin"], // key
      queryFn: () => fetchAllUsersForAdmin(), // http request returns response to useAdmin
    });
   };
4- with `axiosInstance.get("/admin",` http request, server execute the admin route that calls admin api end controller
5- admin controller calls service provider to fetch all data with `const allUsers = await getAllUsers();`
6- getAllUsers makes the database query and send data back to controller
7- controller send data to back to useAdmin with success code `res.status(200).json({ users: allUsers });`
8- http request's return assign to response and fetchAllUsersForAdmin function of useAdmin, return
   reponse.data.users  * users comes from the controller json title(7), it could be anthing
9- Finally data returns to admin page via useAdmin hook to be displayed
*/

/*  response.data:
response.data, it usually refers to the body of the HTTP response, specifically when using libraries 
like Axios. By organizing the response into different properties (like data, status, and headers)
*/
