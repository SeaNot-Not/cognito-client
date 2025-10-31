import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/schemas/authSchema";
import { useRouter } from "next/navigation";
import useSignupMutation, { SignupCredentials } from "@/hooks/mutations/useSignupMutation";
import toast from "react-hot-toast";
import { HttpResponse } from "@/types/response.types";
import { User } from "../mutations/useLoginMutation";
import handleSupabaseUpload from "@/lib/handleSupabaseUpload";

export interface SignupFormValues extends SignupCredentials {
  selectedProfileImage: File | undefined;
}

const useSignupForm = () => {
  const router = useRouter();

  const { mutate, isPending } = useSignupMutation();

  const signupForm = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      age: 0,
      bio: "",
      selectedProfileImage: null,
    },
    mode: "onTouched",
    resolver: zodResolver(signupSchema),
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = signupForm;

  const onSubmit = async (data: SignupFormValues) => {
    const { email, name, password, age, bio, selectedProfileImage } = data;

    // default profile image
    let profileImage = "https://github.com/shadcn.png";

    try {
      // Upload to supabase bucket if there is a file
      if (selectedProfileImage instanceof File) {
        profileImage = await handleSupabaseUpload({
          file: selectedProfileImage,
          folder: "profile_pictures",
          allowedTypes: ["jpg", "jpeg", "png", "webp"],
          maxFileSize: 5 * 1024 * 1024, // 5MB
        });
      }

      mutate(
        { email, password, name, age, bio, profileImage },
        {
          onSuccess: (response: HttpResponse<User>) => {
            console.log(response);
            toast.success("Signup successful, please login!", { duration: 4000 });

            // delay redirection for smooth transition
            setTimeout(() => {
              router.push("/login");
            }, 300);

            reset();
          },
          onError: (error: any) => {
            console.error(error);
            toast.error(error?.message || "Signup Failed! Please try again.", { duration: 4000 });
          },
        },
      );
    } catch (error: any) {
      toast.error(error?.message || "Upload failed. Please try again.", { duration: 4000 });
    }
  };

  const isLoading = isPending || isSubmitting;

  return {
    register,
    signupForm,
    control,
    handleSubmit,
    onSubmit,
    isLoading,
  };
};

export default useSignupForm;
