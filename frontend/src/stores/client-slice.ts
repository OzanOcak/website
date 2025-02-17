export type ClientSlice = {
  lastPath: string; // Keep only lastPath
  setPath: (lastPath: string) => void; // Update lastPath
  userDeleted: boolean; // admin user changed
  setUserDeleted: (userDeleted: boolean) => void;
};

// User slice creation
export const createClientSlice = (
  set: (arg0: { lastPath?: string; userDeleted?: boolean }) => void
): ClientSlice => ({
  lastPath: "/", // Default value for lastPath
  setPath: (lastPath: string) => set({ lastPath }),
  userDeleted: false,
  setUserDeleted: (userDeleted: boolean) => set({ userDeleted }),
});
