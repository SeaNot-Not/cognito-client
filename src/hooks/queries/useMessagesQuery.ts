import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { handleApiRequest } from "@/lib/handleApiRequest";
import { HttpResponse, CursorPaginationMeta } from "@/types/response.types";
import { MessageItem } from "@/types/message.types";

type MessagesResponse = HttpResponse<{
  items: MessageItem[];
  meta: CursorPaginationMeta;
}>;

const fetchMessages = (matchId: string, cursor?: string, limit: number = 20): Promise<MessagesResponse> => {
  const params = new URLSearchParams();
  if (cursor) params.set("cursor", cursor);
  if (limit) params.set("limit", String(limit));
  return handleApiRequest(() => api.get(`/messages/${matchId}?${params.toString()}`));
};

const useMessagesQuery = (matchId?: string) => {
  return useQuery({
    queryKey: ["messages", matchId],
    queryFn: () => fetchMessages(matchId as string),
    enabled: Boolean(matchId),
  });
};

export default useMessagesQuery;


