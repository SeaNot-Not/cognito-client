"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const HeaderNavLinks: React.FC = () => {
  const pathname = usePathname();

  const links = [
    { name: "Chat", href: "/chat" },
    { name: "Discover", href: "/discover" },
  ];

  return (
    <nav className="hidden items-center gap-10 lg:flex">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`text-base text-white transition-opacity hover:opacity-80 ${
              isActive ? "font-bold" : "font-medium"
            }`}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
};

export default HeaderNavLinks;
