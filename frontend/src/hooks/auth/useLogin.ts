import { useStore } from "@/stores/useAuthStore";
import axiosInstance from "@/utils/AxiosInterceptor";
import { redirectUser } from "@/utils/routing";
import { useMutation } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

// Define the shape of the login data
type LoginData = {
  email: string;
  password: string;
};

// Function to handle user login
const loginUser = async (data: LoginData): Promise<void> => {
  // Use axiosInstance to make the POST request
  const response = await axiosInstance.post("/login", data, {
    withCredentials: true, // Allows credentials (cookies) to be sent
  });
  // console.log("Response headers:", response.headers);// Debugging: log the full response headers

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
    useStore.getState().setRole(payload.role); // Set the user role in Zustand store
    useStore.getState().setEmail(data.email); // Set the username in Zustand store
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
      useStore.getState().setRefreshTokenId(refreshTokenId);
      //localStorage.setItem("refreshTokenId", refreshTokenId);
      // console.log("Refresh token ID stored:", refreshTokenId);
    } catch (error) {
      console.error("Error storing refresh token ID:", error);
    }
  } else {
    throw new Error("Refresh token ID not received");
  }
};

// Custom hook for login
export const useLogin = (
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const router = useRouter();
  const role = useStore((state) => state.role);

  return useMutation({
    mutationFn: loginUser, // The function to call for the mutation
    onSuccess: () => {
      // console.log("Login successful, refresh token ID stored");
      // const { role } = useStore.getState(); // Get the role from Zustand store
      // const role = localStorage.getItem("role") as string; // not null
      router.push(redirectUser(role)); // Redirect based on user role
    },
    onError: (error: Error) => {
      console.error("Login failed:", error.message);
      setErrorMessage("Incorrect Credentials, Please Try again ..."); // Set the error message
    },
  });
};
