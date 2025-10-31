import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { handleApiRequest } from "@/lib/handleApiRequest";
import { HttpResponse } from "@/types/response.types";

interface LikeResponse {
  newMatch?: boolean;
}

const likeFn = (targetId: string): Promise<HttpResponse<LikeResponse>> => {
  return handleApiRequest(() => api.post(`/matches/like/${targetId}`));
};

const useLikeUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: likeFn,
    onSuccess: () => {
      // Invalidate current user to refetch with updated likes array
      queryClient.invalidateQueries({ queryKey: ["current-user"] });

      // Invalidate discover to get fresh filtered results
      queryClient.invalidateQueries({ queryKey: ["discover-users"] });
    },
  });
};

export default useLikeUserMutation;
