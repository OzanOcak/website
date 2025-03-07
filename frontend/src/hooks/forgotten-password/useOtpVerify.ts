import axiosInstance from "@/utils/AxiosInterceptor";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface VerifyOtpResponse {
  message: string;
  userId: string;
  otps?: boolean; // Optional flag for OTP verification success
}

export const verifyOtp = async (otp: string): Promise<VerifyOtpResponse> => {
  // console.log("Verifying OTP:", otp);

  // Retrieve the access token from local storage
  const accessToken = localStorage.getItem("xg8a");
  // console.log("access-token", accessToken);

  try {
    console.log("Sending request to verify OTP...");
    const response = await axiosInstance.post(
      "/verify-otp",
      { otp },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Include the access token in headers
        },
      }
    );
    // console.log("Received response from verify OTP request:", response);

    if (response.status !== 200) {
      console.log("Error verifying OTP:", response.data.message);
      throw new Error(response.data.message || "OTP verification failed");
    }

    console.log("OTP verification successful:", response.data);
    return response.data as VerifyOtpResponse;
  } catch (error: unknown) {
    console.error("Error verifying OTP:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "OTP verification failed");
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const useOtpVerify = () => {
  const router = useRouter();
  return useMutation<VerifyOtpResponse, Error, string>({
    mutationFn: verifyOtp,
    onSuccess: (data) => {
      console.log("success");
      localStorage.setItem("userId", data.userId);
      localStorage.removeItem("timeLeft");
      router.push("/update-password?otps=true"); // sending within req body isn't possible ***
    },
    onError: (error: Error) => {
      console.error("OTP verification error:", error.message);
      localStorage.removeItem("xg8a");
      localStorage.removeItem("timeLeft");
      router.push("/login");
      alert(error.message); // Show an error message
    },
  });
};
