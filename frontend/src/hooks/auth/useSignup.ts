import axiosInstance from "@/utils/AxiosInterceptor";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

// Define the shape of the signup data
type SignupResponse = {
  token: string; //headers: Partial<AxiosResponseHeaders>;
  response: {
    message: string;
  };
};

type SignupDataType = { email: string; password: string };

// Function to handle registration
const signupUser = async (data: SignupDataType): Promise<SignupResponse> => {
  // request to signup api end point and assign http response to response object
  const response = await axiosInstance.post("/signup", data);

  // Check if the response status is not OK (201 is created)
  if (response.status !== 201) {
    throw new Error(response.data.message || "Registration failed");
  }
  const authorizationHeader =
    response.headers["authorization"] || response.headers["Authorization"];
  const accessToken = authorizationHeader?.split(" ")[1];

  return { response: response.data, token: accessToken }; // Return the response data};
};
// Custom hook for registration
export const useSignup = () => {
  const router = useRouter(); // Initialize navigate

  return useMutation({
    mutationFn: signupUser, // The function to call for the mutation
    onSuccess: (data) => {
      console.log("data", data);
      console.log("User registered successfully!");
      localStorage.setItem("xg8a", data.token);
      router.push("/verify-otp-registration");
    },
    onError: (error: Error) => {
      console.error("Registration error:", error.message);
    },
  });
};
