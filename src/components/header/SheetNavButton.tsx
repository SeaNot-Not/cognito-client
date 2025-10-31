"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Props {
  label: string;
  href?: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  onClick?: () => void;
  setOpen: (open: boolean) => void;
}

const SheetNavButton: React.FC<Props> = ({ label, href, Icon, onClick, setOpen }) => {
  return href ? (
    <Link href={href} className="w-full">
      <Button
        variant="ghost"
        className="hover:text-primary w-full rounded-lg py-10 transition-colors"
        onClick={() => setOpen(false)}
      >
        <Icon className="size-5" />
        <span>{label}</span>
      </Button>
    </Link>
  ) : (
    <Button
      onClick={() => {
        onClick && onClick();
        setOpen(false);
      }}
      variant="ghost"
      className="hover:text-primary w-full rounded-lg py-10 transition-colors"
    >
      <Icon className="size-5" />
      <span>{label}</span>
    </Button>
  );
};

export default SheetNavButton;
