import { cn } from "@/lib/utils";
import logo from "../../public/logo.png";
import Image from "next/image";

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <div
      className={cn(
        "size-16 overflow-hidden rounded-full shadow-sm",
        className
      )}
    >
      <Image
        src={logo}
        alt="cognito-logo"
        className="object-cover"
        loading="eager"
      />
    </div>
  );
};

export default Logo;
