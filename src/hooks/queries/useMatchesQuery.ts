import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { handleApiRequest } from "@/lib/handleApiRequest";
import { HttpResponse } from "@/types/response.types";
import { MatchItem } from "@/types/match.types";

const fetchMatches = (): Promise<HttpResponse<MatchItem[]>> => {
  return handleApiRequest(() => api.get("/matches"));
};

const useMatchesQuery = () => {
  return useQuery({
    queryKey: ["matches"],
    queryFn: fetchMatches,
  });
};

export default useMatchesQuery;


