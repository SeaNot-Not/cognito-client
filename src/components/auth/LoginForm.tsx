"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import useLoginForm from "@/hooks/forms/useLoginForm";

interface LoginFormProps {
  className?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ className, ...props }) => {
  const { loginForm, control, handleSubmit, isLoading, onSubmit } =
    useLoginForm();

  return (
    <Form {...loginForm}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-foreground text-2xl font-bold">Welcome Back!</p>
          <p className="text-muted-foreground text-sm">
            Login and start dating today!
          </p>
        </div>

        {/* Email Input */}
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="m@example.com"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Input */}
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className={cn("bg-primary w-full", {
            "opacity-50": isLoading,
          })}
        >
          {isLoading ? <LoaderCircle className="animate-spin" /> : "Login"}
        </Button>

        <p className="text-center text-sm">
          Don't have an account?{" "}
          <Link href="/signup" className="underline hover:opacity-80">
            Sign up
          </Link>
        </p>
      </form>
    </Form>
  );
};

export default LoginForm;
