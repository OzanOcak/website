export type UserSlice = {
  id: number;
  name: string;
  email: string;
  role: string;
  profilePicture: string;
  setId: (id: number) => void;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setRole: (role: string) => void;
  setProfilePicture: (profilePicture: string) => void;
};

// User slice creation
export const createUserSlice = (
  set: (arg0: {
    id?: number;
    name?: string;
    email?: string;
    role?: string;
    profilePicture?: string;
  }) => void
): UserSlice => ({
  id: 0,
  name: "",
  email: "",
  role: "user",
  profilePicture: "",
  setId: (id: number) => set({ id }),
  setName: (name: string) => set({ name }),
  setEmail: (email: string) => set({ email }),
  setRole: (role: string) => set({ role }),
  setProfilePicture: (profilePicture: string) => set({ profilePicture }),
});
