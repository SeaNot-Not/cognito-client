import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { handleApiRequest } from "@/lib/handleApiRequest";
import { HttpResponse } from "@/types/response.types";

const logoutFunction = (): Promise<HttpResponse<null>> => {
  return handleApiRequest(() => api.post("/auth/logout"));
};

const useLogoutMutation = () => {
  return useMutation<HttpResponse<null>, any, void>({
    mutationFn: logoutFunction,
  });
};

export default useLogoutMutation;
