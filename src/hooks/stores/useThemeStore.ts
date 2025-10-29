import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeStore {
  theme: Theme;
  initializeTheme: () => void;
  toggleTheme: () => void;
}

const useThemeStore = create<ThemeStore>((set) => ({
  theme: "light",

  initializeTheme: () => {
    if (typeof window === "undefined") return;

    const getSystemTheme: Theme = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches
      ? "dark"
      : "light";
    const storedTheme = localStorage.getItem("vite-ui-theme") as Theme | null;
    const initialTheme: Theme = storedTheme || getSystemTheme;

    set({ theme: initialTheme });
  },

  toggleTheme: () =>
    set((state) => {
      const newTheme: Theme = state.theme === "light" ? "dark" : "light";

      if (typeof window !== "undefined") {
        localStorage.setItem("cognito-ui-theme", newTheme);
      }

      return { theme: newTheme };
    }),
}));

export default useThemeStore;
