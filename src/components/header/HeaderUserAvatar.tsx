"use client";

import Link from "next/link";
import useAuthStore from "@/hooks/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import AvatarWithDropdown from "./AvatarWithDropdown";

const HeaderUserAvatar: React.FC = () => {
  const user = useAuthStore((s) => s.user);

  const authLinks = [
    { label: "Login", href: "/login" },
    { label: "Signup", href: "/signup" },
  ];

  const userName = user?.name;
  const initial = user?.name?.charAt(0) || "?";
  const profileUrl = user?.profileImage;

  return (
    <div className="hidden items-center gap-8 sm:flex">
      {user ? (
        <AvatarWithDropdown
          userName={userName}
          userId={user?._id}
          profileUrl={profileUrl}
          initial={initial}
        />
      ) : (
        authLinks.map(({ label, href }) => (
          <Link key={label} href={href}>
            <Button className="text-primary bg-white font-semibold transition hover:bg-white hover:opacity-80">
              {label}
            </Button>
          </Link>
        ))
      )}
    </div>
  );
};

export default HeaderUserAvatar;
