import { useStore } from "@/stores/useAuthStore";
import axios from "axios";
//import { jwtDecode } from "jwt-decode";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true, // Allows credentials (cookies) to be sent
  headers: {
    "Content-Type": "application/json", // Default header for JSON
  },
});

// Add a request interceptor to add the access token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = useStore.getState().accessToken; // Get the current access token
    //const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`; // Add token to headers
    }
    return config; // Return the modified config for the request
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    // Access the Authorization header from the response
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    //console.log("Original Request:", originalRequest);

    // Check for 401 Unauthorized
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Ignore 401 errors from the /login endpoint
      if (originalRequest.url.includes("/login")) {
        return Promise.reject(error); // Let the error propagate for login requests
      }
      console.warn("* 401 interceptor..." + error);
      try {
        // Attempt to refresh the access token
        const refreshTokenId = useStore.getState().refreshTokenId;
        //const refreshTokenId = localStorage.getItem("refreshTokenId");
        //console.log("refreshTokenId: ", refreshTokenId);

        // Attempt to refresh the access token
        const refreshResponse = await axiosInstance.post(
          "/refresh",
          {},
          {
            headers: {
              "refresh-token-id": refreshTokenId, // Add refresh token ID to headers
            },
          }
        );

        // If successful, extract new access token from the response header
        const newAccessToken =
          refreshResponse.headers["authorization"]?.split(" ")[1];

        if (newAccessToken) {
          useStore.getState().setToken(newAccessToken);
          //localStorage.setItem("accessToken", newAccessToken);

          //const payload = jwtDecode(newAccessToken);
          //console.log("jwt decode", payload);
          // Set the new access token in the original request's headers
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          // Check for new refresh token in the response body
          const newRefreshTokenId = refreshResponse.data?.refreshTokenId;
          if (newRefreshTokenId) {
            useStore.getState().setRefreshTokenId(newRefreshTokenId); // Update refresh token in Zustand
            //localStorage.setItem("refreshTokenId", newRefreshTokenId);
          }

          // Retry the original request with the new token
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error("Failed to refresh access token:", refreshError);
        // Optionally handle redirect to login or logout if refresh fails
      }
    }

    // If we reach here, either the error was not a 401, or refresh failed
    return Promise.reject(error);
  }
);

export default axiosInstance;
