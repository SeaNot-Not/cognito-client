import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/authSchema";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import useLoginMutation, { LoginCredentials, User } from "@/hooks/mutations/useLoginMutation";
import useAuthStore from "../stores/useAuthStore";
import { HttpResponse } from "@/types/response.types";

export interface LoginFormValues extends LoginCredentials {}

const useLoginForm = () => {
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const { mutate, isPending } = useLoginMutation();

  const loginForm = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
    resolver: zodResolver(loginSchema),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = loginForm;

  const onSubmit = async (data: LoginFormValues) => {
    mutate(data, {
      onSuccess: (response: HttpResponse<User>) => {
        // store user in auth store
        const user = response?.data;
        login(user);

        toast.success("Login successful!", { duration: 5000 });

        // delay redirection for smooth transition
        setTimeout(() => {
          router.push("/discover");
        }, 3000);

        reset();
      },
      onError: (error: HttpResponse) => {
        toast.error(error?.message || "Login failed!", {
          duration: 5000,
        });
      },
    });
  };

  const isLoading = isPending || isSubmitting;

  return {
    loginForm,
    control,
    handleSubmit,
    isLoading,
    onSubmit,
  };
};

export default useLoginForm;
