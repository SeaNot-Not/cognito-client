import { useInfiniteQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { handleApiRequest } from "@/lib/handleApiRequest";
import { CursorPaginationMeta, HttpResponse } from "@/types/response.types";

export interface DiscoverUser {
  _id: string;
  name: string;
  age?: number;
  bio?: string;
  profileImage?: string;
}

type DiscoverPage = HttpResponse<{
  items: DiscoverUser[];
  meta: CursorPaginationMeta;
}>;

const fetchDiscover = (cursor?: string, limit: number = 10): Promise<DiscoverPage> => {
  const params = new URLSearchParams();
  if (cursor) params.set("cursor", cursor);
  params.set("limit", String(limit));
  return handleApiRequest(() => api.get(`/users/discover?${params.toString()}`));
};

const useDiscoverUsersInfinite = () => {
  return useInfiniteQuery({
    queryKey: ["discover-users"],
    queryFn: ({ pageParam }) => fetchDiscover(pageParam as string | undefined),
    getNextPageParam: (lastPage) => {
      const meta = lastPage?.data?.meta;
      if (meta?.hasMore && meta?.nextCursor) return String(meta.nextCursor);
      return undefined;
    },
    initialPageParam: undefined as string | undefined,
  });
};

export default useDiscoverUsersInfinite;
