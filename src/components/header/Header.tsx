"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import HeaderSheet from "./HeaderSheet";
import HeaderUserAvatar from "./HeaderUserAvatar";
import HeaderNavLinks from "./HeaderNavLinks";
import ToggleThemeIconButton from "./ToggleThemeIconButton";

const Header: React.FC = () => {
  return (
    <header className="bg-primary flex h-20 w-full items-center justify-center">
      <div className="flex w-full max-w-[90vw] items-center justify-between">
        <Link href="/chat">
          <Logo />
        </Link>

        <div className="flex items-center">
          <div className="flex items-center gap-5 sm:gap-10">
            <HeaderNavLinks />
            <ToggleThemeIconButton className="hidden lg:block" />
            <HeaderUserAvatar />
          </div>

          <div className="ml-5 flex items-center justify-center">
            <HeaderSheet />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
