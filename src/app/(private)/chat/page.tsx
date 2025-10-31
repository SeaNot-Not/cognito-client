"use client";

import { useEffect, useMemo, useState } from "react";
import useMatchesQuery from "@/hooks/queries/useMatchesQuery";
import useMessagesQuery from "@/hooks/queries/useMessagesQuery";
import useAuthStore from "@/hooks/stores/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import useChatSocket from "@/hooks/useChatSocket";
import { MessageItem } from "@/types/message.types";

export default function ChatPage() {
  const currentUser = useAuthStore((s) => s.user);
  const { data: matchesResponse } = useMatchesQuery();
  const matches = matchesResponse?.data ?? [];

  const [activeMatchId, setActiveMatchId] = useState<string | undefined>(matches?.[0]?._id);

  // Ensure active match is set when matches load
  useEffect(() => {
    if (!activeMatchId && matches && matches.length > 0) {
      setActiveMatchId(matches[0]._id);
    }
  }, [matches, activeMatchId]);

  const { data: messagesResponse } = useMessagesQuery(activeMatchId);
  const initialMessages = messagesResponse?.data?.items ?? [];
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages);

  // Sync fetched messages when room changes or new data arrives
  useEffect(() => {
    setMessages(initialMessages);
  }, [activeMatchId, messagesResponse?.data?.items?.length]);

  const { sendMessage } = useChatSocket({
    matchId: activeMatchId,
    onReceive: (m) => setMessages((prev) => [...prev, m]),
  });

  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim() || !activeMatchId || !currentUser) return;
    sendMessage({ matchId: activeMatchId, senderId: currentUser._id, text });
    setText("");
  };

  const getOtherUser = (match: any) => {
    if (!currentUser) return undefined;
    const a = match.userA;
    const b = match.userB;
    const isA = typeof a === "object" && a?._id === currentUser._id;
    const isB = typeof b === "object" && b?._id === currentUser._id;
    if (isA) return b;
    if (isB) return a;
    return typeof a === "object" ? a : undefined;
  };

  if (!matches || matches.length === 0) {
    return (
      <div className="flex h-full min-h-[calc(100vh-56px)] items-center justify-center">
        <Button asChild>
          <Link href="/discover">Discover Users</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto grid h-[calc(100vh-56px)] w-full max-w-6xl grid-rows-[auto,1fr] gap-4 p-4 lg:grid-cols-[300px,1fr] lg:grid-rows-none">
      <aside className="overflow-y-auto rounded-md border">
        <div className="border-b p-3 font-semibold">Matches</div>
        <ul className="divide-y">
          {matches.map((m) => {
            const other = getOtherUser(m);
            return (
              <li
                key={m._id}
                className={`hover:bg-muted flex cursor-pointer items-center gap-3 p-3 ${
                  activeMatchId === m._id ? "bg-muted" : ""
                }`}
                onClick={() => setActiveMatchId(m._id)}
              >
                <Avatar>
                  <AvatarImage src={other?.profileImage || ""} />
                  <AvatarFallback>
                    {other?.name ? other.name.charAt(0).toUpperCase() : "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="truncate">
                  <p className="truncate font-medium">{other?.name || "Unknown"}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </aside>

      <section className="row-start-2 flex h-full flex-col rounded-md border lg:row-start-auto">
        <div className="border-b p-3">
          <p className="font-semibold">Chat</p>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUser?._id;
            const match = matches.find((m) => m._id === msg.matchId) || matches[0];
            const other = getOtherUser(match);
            const avatarSrc = isMe ? currentUser?.profileImage : other?.profileImage;
            const displayName = isMe ? currentUser?.name : other?.name;
            return (
              <div
                key={msg._id}
                className={`flex items-start gap-3 ${isMe ? "flex-row-reverse" : ""}`}
              >
                <Avatar>
                  <AvatarImage src={avatarSrc || ""} />
                  <AvatarFallback>
                    {displayName ? displayName.charAt(0).toUpperCase() : "?"}
                  </AvatarFallback>
                </Avatar>
                <div className={`max-w-[70%] rounded-lg border p-2 ${isMe ? "text-right" : ""}`}>
                  <p className="text-muted-foreground text-xs">{displayName}</p>
                  <p className="wrap-break-words whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="border-t p-3">
          <div className="flex gap-2">
            <Input
              placeholder="Type a message"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />
            <Button onClick={handleSend} disabled={!text.trim() || !activeMatchId}>
              Send
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
