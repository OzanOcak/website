import { useStore } from "@/stores/useAuthStore";
import axiosInstance from "@/utils/AxiosInterceptor";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

// Define the shape of the forgot password data
type ForgotPasswordData = {
  email: string;
};
type ForgotPasswordResponse = {
  token: string; //headers: Partial<AxiosResponseHeaders>;
  response: {
    message: string;
    userId: number; // Ensure this matches the type from your API
    username: string;
  };
};

// Function to handle forgot password
const forgotPassword = async (
  data: ForgotPasswordData
): Promise<ForgotPasswordResponse> => {
  // Request to forgot password API endpoint and assign HTTP response to response object
  const response = await axiosInstance.post("/forgot-password", data);

  // Check if the response status is not OK (200 is OK)
  if (response.status !== 200) {
    throw new Error(response.data.message || "Forgot password request failed");
  }
  //console.log("forgotPassword----> response", response.data);
  //console.log("forgotPassword----> response", response.headers);

  const authorizationHeader =
    response.headers["authorization"] || response.headers["Authorization"];
  const accessToken = authorizationHeader?.split(" ")[1];

  return { response: response.data, token: accessToken }; // Return the response data
};

// Custom hook for forgot password
export const useForgotPassword = () => {
  const router = useRouter(); // Initialize navigate

  return useMutation({
    mutationFn: forgotPassword, // The function to call for the mutation
    onSuccess: (data) => {
      useStore.getState().setId(data.response.userId);
      //localStorage.setItem("id", data.response.userId.toString());
      localStorage.setItem("xg8a", data.token);
      // Navigate to the OTP code page after successful request
      router.push("/verify-otp"); // this is for otp routes, e-link doesnt need redirection
    },
    onError: (error: Error) => {
      console.error("Forgot password error:", error.message);
    },
  });
};
