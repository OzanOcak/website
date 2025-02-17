import { useStore } from "@/stores/useAuthStore";
import { User } from "@/types";
import axiosInstance from "@/utils/AxiosInterceptor";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

type Users = User & {
  email: string; // Add the email property
};

// Function to fetch all users for admin
const fetchAllUsersForAdmin = async (
  page: number,
  limit: number,
  searchQuery: string,
  searchCriteria: string
): Promise<{ users: Users[]; total: number }> => {
  const { accessToken } = useStore.getState(); // Get the access token from Zustand store
  // const accessToken = localStorage.getItem("accessToken");
  // console.log(accessToken);

  if (!accessToken) {
    throw new Error("No access token found: profile");
  }

  const response = await axiosInstance.get("/admin", {
    params: { page, limit, searchQuery, searchCriteria }, // Pass page and limit as query parameters
    headers: {
      Authorization: `Bearer ${accessToken}`, // Include the token
    },
  });
  // console.log("All Users:fetched -------------->", response.data.users);
  return response.data; // return users and total count
};

// Custom hook for fetching all users
const useAdmin = (
  page: number,
  limit: number,
  searchQuery: string,
  searchCriteria: string
  //enabled: boolean
) => {
  return useQuery({
    queryKey: ["admin", page, limit, searchQuery, searchCriteria],
    queryFn: () => {
      return fetchAllUsersForAdmin(page, limit, searchQuery, searchCriteria); // no {} no return
    }, // Include page and limit in the query key
    staleTime: 10 * 60 * 1000, // Keep data fresh for 1 hour
    refetchOnReconnect: false, // Disable refetch on reconnect
    placeholderData: keepPreviousData, //enabled ? keepPreviousData : { users: [], total: 0 },
    // enabled,
    // staleTime: 5 * 60 * 1000,
    // refetchOnWindowFocus: true, // Refetch when the window is focused after deleting user
  });
};

export { useAdmin };

/*
refetchOnWindowFocus, it should ideally refetch the query when the window regains focus. However, if 
you're navigating back to the AdminPage immediately after deleting a user, the focus event might not 
trigger a refetch as expected. */
