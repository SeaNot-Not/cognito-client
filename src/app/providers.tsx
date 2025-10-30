"use client";

import QueryProvider from "@/components/QueryProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

interface ProviderProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProviderProps) {
  return (
    <ThemeProvider>
      <Toaster />
      <QueryProvider>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryProvider>
    </ThemeProvider>
  );
}
