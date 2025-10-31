import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { handleApiRequest } from "@/lib/handleApiRequest";
import { HttpResponse } from "@/types/response.types";

export interface UpdateUserDto {
  name?: string;
  age?: number;
  bio?: string;
  profileImage?: string;
}

const updateFn = (dto: UpdateUserDto): Promise<HttpResponse<any>> => {
  return handleApiRequest(() => api.patch("/users/me", dto));
};

export default function useUpdateUserMutation() {
  return useMutation<HttpResponse<any>, any, UpdateUserDto>({ mutationFn: updateFn });
}
