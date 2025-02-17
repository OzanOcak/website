import { useStore } from "@/stores/useAuthStore";
import axiosInstance from "@/utils/AxiosInterceptor";
import { redirectUser } from "@/utils/routing";
import { useMutation } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

// Define the shape of the login data
type LoginData = {
  username: string;
};

// Function to handle user login
const loginOauthUser = async (data: LoginData): Promise<void> => {
  const provider = sessionStorage.getItem("oauth_provider"); // Retrieve the provider from sessionStorage  // Use axiosInstance to make the POST request

  if (!provider) {
    throw new Error("Provider not found in session storage");
  }
  const response = await axiosInstance.post("/oauth/ologin", data, {
    withCredentials: true, // Allows credentials (cookies) to be sent, if cookie secure:true, it will add automatically
    params: { provider },
  });
  // console.log("Response headers:", response.headers);// Debugging: log the full response headers
  // console.log(response);

  // Check if the response status is not OK (2xx)
  if (response.status !== 200) {
    throw new Error(response.data.message || "Login failed");
  }

  // Access the Authorization header for the access token
  const authorizationHeader =
    response.headers["authorization"] || response.headers["Authorization"];
  const accessToken = authorizationHeader?.split(" ")[1];

  //console.log("Access token from login:", accessToken);
  if (accessToken) {
    // Decode the access token to get user information
    const payload = jwtDecode(accessToken) as { id: string; role: string };
    useStore.getState().setToken(accessToken);
    useStore.getState().setId(Number(payload.id));
    useStore.getState().setRole(payload.role);
    useStore.getState().setName(data.username);
    // for checking session is still valid
  } else {
    throw new Error("Access token not received");
  }

  // Get the refresh token ID from the request headers
  const refreshTokenId =
    response.headers["refresh-token-id"] ||
    response.headers["Refresh-Token-ID"];
  if (refreshTokenId) {
    // Store the refresh token ID in local storage
    try {
      //localStorage.setItem("refreshTokenId", refreshTokenId);
      useStore.getState().setRefreshTokenId(refreshTokenId);
      // console.log("Refresh token ID stored:", refreshTokenId);
    } catch (error) {
      console.error("Error storing refresh token ID:", error);
    }
  } else {
    throw new Error("Refresh token ID not received");
  }
};

// Custom hook for login
export const useOauthLogin = (
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const router = useRouter();
  //const role = useStore((state) => state.role);
  //console.log("role :", role); // "" didnt fetch role yet

  return useMutation({
    mutationFn: loginOauthUser, // The function to call for the mutation
    onSuccess: () => {
      // console.log("Login successful, refresh token ID stored");
      //const role = localStorage.getItem("role") as string; // not null
      const role = useStore.getState().role;
      //console.log(redirectUser(role));

      router.push(redirectUser(role)); // Redirect based on user role
    },
    onError: (error: Error) => {
      console.error("Login failed:", error.message);
      setErrorMessage("Incorrect Credentials, Please Try again ..."); // Set the error message
      router.push("/login");
    },
  });
};

/*
  const role = useStore((state) => state.role); can only be called a React fuction returning jsx, 
  cannot be called within mutation too

  so within mutation we need to access zustand store directly with 
  const role = useStore.getState().role;

  the page calls useOauthLogin first, then the cusotm component returns mutation
  mutationFn: loginOauthUser, // makes the http call and fetch the data so accessing role before
  mtationFn return empty string


*/
