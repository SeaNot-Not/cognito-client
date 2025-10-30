import { useMutation } from "@tanstack/react-query";
import { handleApiRequest } from "@/lib/handleApiRequest";
import api from "@/lib/api";
import { User } from "./useLoginMutation";
import { HttpResponse } from "@/types/response.types";

export interface SignupCredentials {
  email: string;
  password: string;
  name: string;
  age: number;
  bio?: string;
  profileImage?: string;
}

const signupFunction = async (credentials: SignupCredentials): Promise<HttpResponse<User>> => {
  return handleApiRequest(() => api.post("/auth/signup", credentials));
};

const useSignupMutation = () => {
  return useMutation({
    mutationFn: signupFunction,
  });
};

export default useSignupMutation;
