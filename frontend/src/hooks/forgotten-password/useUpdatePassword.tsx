import axiosInstance from "@/utils/AxiosInterceptor";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

// Function to update a user's password
const updateUserPassword = async (
  userId: string,
  newPassword: string,
  confirmPassword: string,
  otps: boolean
): Promise<void> => {
  // Retrieve the access token from local storage
  const accessToken = localStorage.getItem("xg8a");
  console.log("access-token", accessToken);

  try {
    console.log("Sending request to verify OTP!!!");
    const response = await axiosInstance.patch(
      `/users/${userId}/password`, //?code=${code}`, // for email-link, also need email parameters
      { userId, newPassword, confirmPassword, otps }, // Include confirmPassword in the request
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Include the access token in headers
        },
      }
    );
    console.log("Received response from verify OTP request:", response);

    if (response.status !== 200) {
      console.log("Error verifying OTP:", response.data.message);
      throw new Error(response.data.message || "OTP verification failed");
    }
  } catch (error: unknown) {
    console.error("Error verifying OTP:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "OTP verification failed");
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

// Custom hook for updating a user password
export const useUpdateUserPassword = () => {
  const router = useRouter();
  return useMutation<
    void,
    Error,
    {
      userId: string;
      newPassword: string;
      confirmPassword: string;
      otps: boolean;
    }
  >({
    mutationFn: ({ userId, newPassword, confirmPassword, otps }) =>
      updateUserPassword(userId, newPassword, confirmPassword, otps), // code for email-link
    onSuccess: () => {
      console.log("success");
      localStorage.removeItem("xg8a");
      localStorage.removeItem("userId");
      router.push("/login"); // Redirect to update password page on success
    },
    onError: (error: Error) => {
      console.error("OTP verification error:", error.message);
      alert(error.message); // Show an error message
    },
  });
};
