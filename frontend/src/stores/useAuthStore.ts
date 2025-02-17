import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { subscribeWithSelector } from "zustand/middleware";
//import { createUserSlice, UserSlice } from "./user-slice";
import { AuthSlice, createAuthSlice } from "./auth-slice";
import { createUserSlice, UserSlice } from "./user-slice";
import { ClientSlice, createClientSlice } from "./client-slice";

export type Store = AuthSlice & ClientSlice & UserSlice;
//export type Store = AnalyticSlice;
// Store creation
export const useStore = create<Store>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set) => ({
          ...createUserSlice(set),
          ...createAuthSlice(set),
          ...createClientSlice(set),
        }))
      ),
      {
        name: "store",
        storage: createJSONStorage(() => localStorage), // sessionStorage, AsyncStorage, IndexedDB
      }
    )
  )
);

/*
ZUSTAND

While these are valid but can lead to stale data if the component re-renders and the state changes. 
It's better to use the hook approach to ensure you always have the latest state.

- useStore.getState().setPath(currentPath);

- const { accessToken } = useStore.getState();

These are the preferred method for accessing state in components because it leverages 
React's reactivity. It ensures that your component updates automatically when the state changes.

- const path = useStore((state) => state.lastPath);

- const setPath = useStore((state) => state.setPath);

  setPath(newPath)

This line uses the useStore hook with useShallow to subscribe to the lastPath state. The useShallow 
comparison allows for shallow equality checks, which can help prevent unnecessary re-renders if the 
state is an object or array. However, for simple values (like strings or numbers), the regular useStore 
is sufficient.

- const path = useStore(useShallow((state) => state.lastPath));

*/
