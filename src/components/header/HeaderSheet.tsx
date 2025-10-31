"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, LogOut, User, Sun, Moon, MessageCircle, Compass } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/hooks/stores/useAuthStore";
import useThemeStore from "@/hooks/stores/useThemeStore";
import {
  Sheet,
  SheetTitle,
  SheetDescription,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import SheetNavButton from "./SheetNavButton";
import useLogoutMutation from "@/hooks/mutations/useLogoutMutation";
import toast from "react-hot-toast";

const navLinks = [
  { label: "Chat", href: "/chat", Icon: MessageCircle },
  { label: "Discover", href: "/discover", Icon: Compass },
];

const HeaderSheet: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const { logout } = useAuthStore();
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const { mutate: logoutMutation, isPending } = useLogoutMutation();

  const [open, setOpen] = useState(false);
  const router = useRouter();

  const isUserLoggedIn = isLoggedIn && !!user;
  const userFullName = user?.name;
  const userProfilePicture = user?.profileImage;
  const userInitial = user?.name?.[0] || "?";

  const handleLogout = () => {
    logoutMutation(undefined, {
      onSuccess: () => {
        logout();
        toast.success("Logged out successfully!", { duration: 4000 });
        setTimeout(() => {
          router.replace("/login");
        }, 300);
      },
      onError: () => {
        logout();
        toast.error("Logout failed. Please try again.", { duration: 4000 });
        router.replace("/login");
      },
    });
  };

  const userButtons = isUserLoggedIn
    ? [
        { label: "Profile", Icon: User, onClick: () => router.push("/profile") },
        {
          label: isPending ? "Logging out..." : "Logout",
          Icon: LogOut,
          onClick: handleLogout,
        },
      ]
    : [{ label: "Login", Icon: User, onClick: () => router.push("/login") }];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTitle />
      <SheetDescription />

      <SheetTrigger asChild>
        <Button className="p-0! shadow-none transition-opacity hover:opacity-80 lg:hidden">
          <Menu className="size-10 text-white" />
        </Button>
      </SheetTrigger>

      <SheetContent className="max-w-xs! rounded-l-lg p-0!">
        <div className="flex h-full w-full flex-col">
          {isUserLoggedIn && (
            <div className="flex w-full flex-col items-center justify-center gap-5 border-b-2 py-5">
              <Avatar className="border-primary size-32 border-2">
                <AvatarImage src={userProfilePicture} />
                <AvatarFallback>{userInitial}</AvatarFallback>
              </Avatar>

              <span className="text-primary font-semibold">{userFullName}</span>
            </div>
          )}

          <div className="flex h-full w-full flex-col items-center justify-between">
            <div className="flex w-full flex-col items-center">
              {navLinks.map(({ label, href, Icon }) => (
                <SheetNavButton
                  key={label}
                  label={label}
                  href={href}
                  Icon={Icon}
                  setOpen={setOpen}
                />
              ))}
            </div>

            <div className="flex w-full flex-col items-center">
              {userButtons.map(({ label, Icon, onClick }) => (
                <SheetNavButton
                  key={label}
                  label={label}
                  Icon={Icon}
                  onClick={onClick}
                  setOpen={setOpen}
                />
              ))}

              <SheetNavButton
                label="Toggle Theme"
                Icon={theme === "light" ? Sun : Moon}
                onClick={toggleTheme}
                setOpen={setOpen}
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HeaderSheet;
