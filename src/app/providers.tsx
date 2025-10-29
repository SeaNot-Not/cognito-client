// providers.js
"use client"; // Mark as a Client Component

import QueryProvider from "@/components/QueryProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface ProviderProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProviderProps) {
  return (
    <ThemeProvider>
      <QueryProvider>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryProvider>
    </ThemeProvider>
  );
}
