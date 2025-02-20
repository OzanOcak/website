import { useStore } from "@/stores/useAuthStore";
import axiosInstance from "@/utils/AxiosInterceptor";
import { useQuery } from "@tanstack/react-query";

const fetchUserName = async () => {
  const accessToken = useStore.getState().accessToken; // Get the access token from Zustand store
  //const accessToken = localStorage.getItem("accessToken");

  // Check if accessToken exists
  if (!accessToken) {
    throw new Error("No access token found: profile");
  }

  try {
    const response = await axiosInstance.get("/profile", {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Include the token
      },
    });

    //console.log("API Response:", response.data.profile.profilePicture); // Log the entire response for debugging
    const pic = response.data.profile.profilePicture;
    if (pic) {
      useStore.getState().setProfilePicture(pic);
      //useStore.getState().setNavUsrP(true);
    }

    return response.data.profile; // Return the first item
  } catch (error) {
    console.error("Error fetching user name:", error);
    throw new Error("Failed to fetch user name.");
  }
};

export const useUserName = () => {
  // const accessToken = useStore((state) => state.accessToken); // Get accessToken from Zustand
  //const navUsrP = useStore((state) => state.navUsrP);
  return useQuery({
    queryKey: ["user"],
    queryFn: fetchUserName,
    //enabled: !navUsrP,
    //enabled: !!accessToken, // Only fetch if accessToken exists
    //staleTime: 5 * 60 * 1000, // The default is 0, meaning that data is considered stale immediately after it is fetched.
  });
};

/*
queryKey: ["user"] => This is a unique key for the query. It helps React Query identify and cache the 
data. The key can be a string or an array. In this case, it's an array with a single string "user"

queryFn: fetchUserName => This is the function that will be called to fetch the data. It should return 
a promise that resolves with the data you want to cache.

enabled: !!accessToken => The double negation (!!) converts the accessToken to a boolean. If accessToken
is truthy (exists), the query will run; if it's falsy (null or undefined), the query will not run.

staleTime: 5 * 60 * 1000 => This option would set the time that the  fetched data is  considered fresh. 
During this time, React Query would not refetch the data unless the query is invalidated.

catchTime: 5 * 60 * 1000 => This option would set the time that the  fetched data is  considered stale. 

refetchOnMount: false => This option controls whether the query should refetch data when the component 
mounts. Setting it to false means that if the data is already cached and fresh, it won't refetch when 
the component mounts.

retry: false => This option determines whether the query should automatically retry fetching data if it
fails. Setting it to false means that it will not retry on failure.
 */
