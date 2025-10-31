import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { handleApiRequest } from "@/lib/handleApiRequest";
import { HttpResponse } from "@/types/response.types";

export interface CurrentUser {
  _id: string;
  name: string;
  email: string;
  age: number;
  bio?: string;
  profileImage?: string;
  likes?: string[]; // Array of user IDs
  skips?: string[]; // Array of user IDs
}

const fetchCurrentUser = (): Promise<HttpResponse<CurrentUser>> => {
  return handleApiRequest(() => api.get("/users/me"));
};

const useCurrentUser = (enabled: boolean = false) => {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: fetchCurrentUser,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes - adjust as needed
    retry: 1,
  });
};

export default useCurrentUser;
