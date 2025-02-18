import { useStore } from "./useAuthStore";

export type ClientSlice = {
  lastPath: string; // Keep only lastPath
  setPath: (lastPath: string) => void; // Update lastPath
  userDeleted: boolean; // admin user changed
  setUserDeleted: (userDeleted: boolean) => void;

  // New state for liked blogs
  likedBlogs: Record<string, boolean>; // Store liked blogs as { "blog-1": true, "blog-2": true }
  likeBlog: (blogId: string) => void; // Like a blog post
  unlikeBlog: (blogId: string) => void; // Unlike a blog post
  isBlogLiked: (blogId: string) => boolean; // Check if a blog is liked
};

// Define the shape of the state
type State = {
  lastPath: string;
  userDeleted: boolean;
  likedBlogs: Record<string, boolean>;
};

// User slice creation
export const createClientSlice = (
  set: (updater: (state: State) => State) => void
): ClientSlice => ({
  lastPath: "/", // Default value for lastPath
  setPath: (lastPath: string) => set((state) => ({ ...state, lastPath })),
  userDeleted: false,
  setUserDeleted: (userDeleted: boolean) =>
    set((state) => ({ ...state, userDeleted })),

  // New state and actions for liked blogs
  likedBlogs: {}, // Initialize as an empty object
  likeBlog: (blogId: string) => {
    set((state) => ({
      ...state, // Spread the existing state
      likedBlogs: {
        ...state.likedBlogs,
        [blogId]: true, // Add the blog ID as a key with value true
      },
    }));
  },
  unlikeBlog: (blogId: string) => {
    set((state) => {
      const updatedLikedBlogs = { ...state.likedBlogs };
      delete updatedLikedBlogs[blogId]; // Remove the blog ID from the likedBlogs object
      return { ...state, likedBlogs: updatedLikedBlogs }; // Return the entire state with updated likedBlogs
    });
  },
  isBlogLiked: (blogId: string) => {
    return useStore.getState().likedBlogs[blogId] === true; // Check if the blog is liked
  },
});
