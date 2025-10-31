"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/hooks/stores/useAuthStore";
import useCurrentUser from "@/hooks/queries/useCurrentUser";
import Header from "@/components/header/Header";

interface PrivateLayoutProps {
  children: React.ReactNode;
}

export default function PrivateLayout({ children }: PrivateLayoutProps) {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn, setUserDetails, logout } = useAuthStore();

  // Fetch user (will only succeed if cookie is valid)
  const { data, isError, isLoading, isFetched } = useCurrentUser(true);

  // If user data is fetched successfully, update Zustand
  useEffect(() => {
    if (data?.data) {
      setIsLoggedIn(true);
      setUserDetails(data.data);
    }
  }, [data, setIsLoggedIn, setUserDetails]);

  useEffect(() => {
    if (isFetched && (isError || !data?.data)) {
      logout();
      router.replace("/login");
    }
  }, [isFetched, isError, data, logout, router]);

  // Handle loading
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  // Render only if logged in
  if (!isLoggedIn) return null;

  return (
    <div className="bg-background flex h-screen w-screen flex-col">
      <Header />
      <main className="w-full flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
