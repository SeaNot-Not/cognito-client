import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  profilePicture?: string;
};

interface AuthStore {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const useAuthStore = create(
  persist<AuthStore>(
    (set) => ({
      user: null,
      isLoggedIn: false,

      login: (user) => set({ user, isLoggedIn: true }),
      logout: () => set({ user: null, isLoggedIn: false }),
    }),

    {
      name: "cognito-auth-storage",
    }
  )
);

export default useAuthStore;
