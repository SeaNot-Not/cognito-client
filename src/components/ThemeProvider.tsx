"use client";

import { useEffect, ReactNode } from "react";
import useThemeStore from "@/hooks/stores/useThemeStore";

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useThemeStore((state) => state.theme);
  const initializeTheme = useThemeStore((state) => state.initializeTheme);

  // Initialize theme on mount
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return <>{children}</>;
}
