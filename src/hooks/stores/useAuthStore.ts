import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CurrentUser } from "../queries/useCurrentUser";

interface AuthState {
  user: CurrentUser | null;
  isLoggedIn: boolean;
  setUserDetails: (user: CurrentUser | null) => void;
  setIsLoggedIn: (value: boolean) => void;
  logout: () => void;
}

const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      user: null,
      isLoggedIn: false,

      setUserDetails: (user) => set({ user }),
      setIsLoggedIn: (value) => set({ isLoggedIn: value }),
      logout: () => set({ user: null, isLoggedIn: false }),
    }),

    {
      name: "cognito-auth-storage",
    },
  ),
);

export default useAuthStore;
