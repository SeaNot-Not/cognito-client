import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { handleApiRequest } from "@/lib/handleApiRequest";
import { HttpResponse } from "@/types/response.types";

type SkipResponse = HttpResponse<{ skipped: boolean }>;

const skipFn = (targetId: string): Promise<SkipResponse> => {
  return handleApiRequest(() => api.post(`/matches/skip/${targetId}`));
};

const useSkipUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: skipFn,
    onSuccess: () => {
      // Invalidate current user to refetch with updated skips array
      queryClient.invalidateQueries({ queryKey: ["current-user"] });

      // Invalidate discover to get fresh filtered results
      queryClient.invalidateQueries({ queryKey: ["discover-users"] });
    },
  });
};

export default useSkipUserMutation;
