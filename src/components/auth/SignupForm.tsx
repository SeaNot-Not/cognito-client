"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useSignupForm from "@/hooks/forms/useSignupForm";
import { Textarea } from "../ui/textarea";
import useConfirmDialog from "../useConfirmDialog";
import { SignupCredentials } from "@/hooks/mutations/useSignupMutation";
import useAuthStore from "@/hooks/stores/useAuthStore";
import { useEffect } from "react";

interface SignupFormProps {
  className?: string;
}

const SignupForm: React.FC<SignupFormProps> = ({ className, ...props }) => {
  const [profilePreviewUrl, setProfilePreviewUrl] = useState<string>("");
  const [selectedProfileImage, setSelectedProfileImage] = useState<File | undefined>();
  const { openDialog, ConfirmDialog } = useConfirmDialog();
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const router = useRouter();

  const { register, signupForm, control, handleSubmit, onSubmit, isLoading } = useSignupForm();

  const onConfirmSignup = async (data: SignupCredentials) => {
    const confirm = await openDialog("Confirm Signup", "Are you sure you want to signup?");

    if (!confirm || !data) return;

    onSubmit({ ...data, selectedProfileImage });
  };

  // Check if user is already logged in
  useEffect(() => {
    if (user && isLoggedIn) {
      router.push("/discover");
    }
  }, [user, isLoggedIn]);

  return (
    <Form {...signupForm}>
      <form
        onSubmit={handleSubmit(onConfirmSignup)}
        className={cn("flex w-full flex-col gap-10", className)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-2xl font-bold whitespace-nowrap">Welcome to Cognito Dating App!</p>
          <p className="text-muted-foreground text-sm whitespace-nowrap">
            Signup and Go from Incognito to Cognito!
          </p>
        </div>

        <div className="grid w-full gap-3 lg:grid-cols-3 lg:gap-5">
          <FormField
            control={control}
            name="selectedProfileImage"
            render={() => (
              <FormItem>
                <FormControl>
                  <div className="flex flex-col items-center gap-2">
                    <Avatar
                      className={`size-40 border-4 ${selectedProfileImage && "border-primary"}`}
                    >
                      <AvatarImage src={profilePreviewUrl || ""} alt="Profile" />
                      <AvatarFallback className="text-xl font-semibold">?</AvatarFallback>
                    </Avatar>

                    <Input
                      type="file"
                      accept="image/*"
                      id="file_upload"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedProfileImage(file);
                          setProfilePreviewUrl(URL.createObjectURL(file));
                        }
                      }}
                      disabled={isLoading}
                    />
                    <label
                      htmlFor="file_upload"
                      className="text-primary cursor-pointer text-sm hover:underline"
                    >
                      Upload Picture
                    </label>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-3">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Pedro Pandesal"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="age"
              render={({ field }) => (
                <FormItem className={className}>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={isLoading}
                      {...field}
                      {...register("age", { valueAsNumber: true })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea placeholder="I'm Pedro Pandesal..." {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-3">
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

            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••" disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••" disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1 lg:flex-row lg:justify-end lg:gap-3">
          <Button
            variant="outline"
            onClick={() => router.push("/login")}
            disabled={isLoading}
            className="hidden w-full lg:flex lg:max-w-3xs"
          >
            {isLoading ? <LoaderCircle className="animate-spin" /> : "Back to Login"}
          </Button>

          <Button type="submit" disabled={isLoading} className="bg-primary w-full lg:max-w-3xs">
            {isLoading ? <LoaderCircle className="animate-spin" /> : "Signup"}
          </Button>

          <p className="text-center text-sm lg:hidden">
            Already have an account?{" "}
            <Link href="/login" className="underline hover:opacity-80">
              Login
            </Link>
          </p>
        </div>

        {ConfirmDialog}
      </form>
    </Form>
  );
};

export default SignupForm;
