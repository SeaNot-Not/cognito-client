import * as React from "react";
import { Eye, EyeClosed } from "lucide-react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const isPasswordInput = type === "password";

  return (
    <div className="relative w-full">
      <input
        type={isPasswordInput && showPassword ? "text" : type}
        className={cn(
          "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        {...props}
      />

      {isPasswordInput && (
        <button
          type="button"
          onClick={handleTogglePassword}
          className="text-muted-foreground hover:text-primary absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer transition"
        >
          {showPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
        </button>
      )}
    </div>
  );
}

Input.displayName = "Input";

export { Input };
