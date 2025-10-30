"use client";

import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { handleApiRequest } from "@/lib/handleApiRequest";
import { HttpResponse } from "@/types/response.types";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  profilePicture?: string;
}

const loginFunction = (
  credentials: LoginCredentials
): Promise<HttpResponse<User>> => {
  return handleApiRequest(() =>
    api.post<HttpResponse<User>>("/auth/login", credentials)
  );
};

const useLoginMutation = () => {
  return useMutation<HttpResponse<User>, any, LoginCredentials>({
    mutationFn: loginFunction,
  });
};

export default useLoginMutation;
