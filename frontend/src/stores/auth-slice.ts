import { Store } from "./useAuthStore";

export type AuthSlice = {
  accessToken: string;
  refreshTokenId: string; // Add refreshTokenId
  setToken: (accessToken: string) => void;
  clearToken: () => void;
  setRefreshTokenId: (refreshTokenId: string) => void; // Method to set refreshTokenId
};

// Auth slice creation
export const createAuthSlice = (
  set: (arg0: (state: Store) => void) => void // Ensure set accepts a function that updates Store
): AuthSlice => ({
  accessToken: "",
  refreshTokenId: "", // Initialize refreshTokenId
  setToken: (accessToken: string) => {
    set((state) => {
      state.accessToken = accessToken;
      localStorage.setItem("loginTimestamp", `${Date.now()}`); // Update the timestamp on token set
    });
  },
  clearToken: () => {
    set((state) => {
      state.id = 0;
      state.accessToken = "";
      state.refreshTokenId = "";
      state.name = "";
      state.role = "";
      state.email = "";
      state.profilePicture = "";
      state.userDeleted = false;

      // Clear likedBlogs directly
      {
        /* Object.keys(state.likedBlogs).forEach((blogId) => {
        state.likedBlogs[blogId] = false;
      });*/
      }

      localStorage.removeItem("loginTimestamp"); // for session
      sessionStorage.removeItem("codeVerifier"); // for pkce
      sessionStorage.removeItem("oauth_provider"); // google, facebook etc..
    });
  },
  setRefreshTokenId: (refreshTokenId: string) => {
    set((state) => {
      state.refreshTokenId = refreshTokenId; // Correctly typed state
    });
  },
});
