"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useThemeStore from "@/hooks/stores/useThemeStore";
import useAuthStore from "@/hooks/stores/useAuthStore";
import { LogOut, User, Moon, Sun } from "lucide-react";
import useLogoutMutation from "@/hooks/mutations/useLogoutMutation";
import toast from "react-hot-toast";

interface Props {
  userName?: string;
  userId?: string;
  profileUrl?: string;
  initial?: string;
}

const AvatarWithDropdown: React.FC<Props> = ({ userName, userId, profileUrl, initial }) => {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const { logout } = useAuthStore();
  const router = useRouter();

  const { mutate: logoutMutation } = useLogoutMutation();

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar className="flex size-16 cursor-pointer items-center justify-center border-2 border-white transition hover:opacity-80">
          <AvatarImage src={profileUrl} />
          <AvatarFallback className="text-primary text-sm font-semibold capitalize">
            {initial || "?"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        {userName ? (
          <DropdownMenuLabel className="text-primary text-center">{userName}</DropdownMenuLabel>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer">
            <User />
            <p>Profile</p>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
            <LogOut />
            <p>Logout</p>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
            {theme === "light" ? <Sun /> : <Moon />}
            <p>Toggle Theme</p>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AvatarWithDropdown;
