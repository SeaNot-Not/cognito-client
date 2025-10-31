"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
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

  const [activeMatchId, setActiveMatchId] = useState<string | undefined>(undefined);

  // set first match when loaded - only on initial render
  useEffect(() => {
    if (!activeMatchId && matches && matches.length > 0) {
      setActiveMatchId(matches[0]._id);
    }
  }, [matches]); // removed activeMatchId dependency to avoid loops

  // Fetch messages for active match
  const { data: messagesResponse, refetch } = useMessagesQuery(activeMatchId);

  // Manage messages with matchId key to separate room messages
  const [messagesByMatch, setMessagesByMatch] = useState<Record<string, MessageItem[]>>({});

  const currentMessages = activeMatchId ? messagesByMatch[activeMatchId] || [] : [];

  // Reset messages for a room when switching and trigger fetch
  const handleMatchSelect = useCallback(
    (matchId: string) => {
      setActiveMatchId(matchId);
      // Only reset if we don't have messages for this room yet
      if (!messagesByMatch[matchId]) {
        setMessagesByMatch((prev) => ({ ...prev, [matchId]: [] }));
      }
    },
    [messagesByMatch],
  );

  // Update messages when we get response from server
  useEffect(() => {
    if (!activeMatchId || !messagesResponse?.data?.items) return;

    setMessagesByMatch((prev) => {
      const items = messagesResponse.data.items;
      // Create a map of existing messages for fast lookup
      const existing = new Set(prev[activeMatchId]?.map((m) => (m as any)._id) || []);

      // Filter out any messages not belonging to current match and dedupe
      const newMessages = items.filter(
        (m) => m.matchId === activeMatchId && !existing.has((m as any)._id),
      );

      // Merge with existing messages for this match
      const merged = [...(prev[activeMatchId] || []), ...newMessages];
      merged.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      return {
        ...prev,
        [activeMatchId]: merged,
      };
    });
  }, [activeMatchId, messagesResponse?.data?.items]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [currentMessages.length, scrollToBottom]);

  // chat socket
  const { sendMessage: socketSend } = useChatSocket({
    matchId: activeMatchId,
    onReceive: (m) => {
      if (!activeMatchId) return;
      setMessagesByMatch((prev) => {
        // Don't add if message is for a different room
        if (m.matchId !== activeMatchId) return prev;

        const currentRoomMessages = prev[activeMatchId] || [];
        // Don't add if we already have this message
        if (currentRoomMessages.some((msg) => msg._id === (m as any)._id)) {
          return prev;
        }

        const next = [...currentRoomMessages, m as MessageItem];
        next.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

        return {
          ...prev,
          [activeMatchId]: next,
        };
      });
    },
  });

  const [text, setText] = useState("");

  const handleSend = async () => {
    if (!text.trim() || !activeMatchId || !currentUser) return;
    socketSend({ matchId: activeMatchId, senderId: currentUser._id, text });
    setText("");
    // refetch after slight delay to ensure canonical state
    setTimeout(() => refetch(), 250);
  };

  // Centralized helper to get user info consistently
  const getUserInfo = useCallback((user: any) => {
    if (!user) return { name: "Unknown", avatar: "", initials: "?" };

    const userData = typeof user === "object" ? user : undefined;
    return {
      name: userData?.name || "Unknown",
      avatar: userData?.profileImage || "",
      initials: userData?.name ? userData.name.charAt(0).toUpperCase() : "?",
    };
  }, []);

  // Get other user in a match with proper type handling
  const getOtherUser = useCallback(
    (match: any) => {
      if (!currentUser || !match) return undefined;
      const a = match.userA;
      const b = match.userB;
      const aId = typeof a === "string" ? a : (a?._id as string | undefined);
      const bId = typeof b === "string" ? b : (b?._id as string | undefined);
      if (aId === currentUser._id) return typeof b === "object" ? b : undefined;
      if (bId === currentUser._id) return typeof a === "object" ? a : undefined;
      return typeof a === "object" ? a : undefined;
    },
    [currentUser],
  );

  // Get user info for current match
  const activeMatch = activeMatchId ? matches.find((m) => m._id === activeMatchId) : undefined;
  const activeOtherUser = activeMatch ? getOtherUser(activeMatch) : undefined;
  const activeUserInfo = getUserInfo(activeOtherUser);

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
    <div className="mx-auto flex h-[calc(100%-9rem)] w-full max-w-6xl flex-col gap-4 p-4 lg:h-full lg:flex-row">
      {/* Matches column */}
      <aside className="bg-background flex h-auto w-full flex-col rounded-md border lg:h-full lg:w-80">
        <div className="border-b p-3 font-semibold">Matches</div>
        <ul className="flex gap-3 overflow-x-auto px-3 py-2 lg:block lg:flex-1 lg:overflow-y-auto">
          {matches.map((m) => {
            const other = getOtherUser(m);
            const active = activeMatchId === m._id;
            return (
              <li
                key={m._id}
                onClick={() => handleMatchSelect(m._id)}
                className={`flex min-w-[140px] cursor-pointer items-center gap-3 rounded-md p-3 lg:min-w-full ${
                  active ? "bg-muted" : ""
                }`}
              >
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src={getUserInfo(other).avatar} />
                  <AvatarFallback>{getUserInfo(other).initials}</AvatarFallback>
                </Avatar>
                <div className="truncate">
                  <p className="truncate font-medium">{getUserInfo(other).name}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Chat column */}
      <section className="bg-background flex h-full flex-1 flex-col rounded-md border lg:h-full">
        <div className="border-b p-3">
          {activeMatchId && (
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activeUserInfo.avatar} />
                <AvatarFallback>{activeUserInfo.initials}</AvatarFallback>
              </Avatar>
              <p className="font-semibold">{activeUserInfo.name}</p>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4" style={{ scrollBehavior: "smooth" }}>
          <div className="space-y-3">
            {currentMessages.map((msg: MessageItem) => {
              const senderIdStr =
                typeof msg.senderId === "string" ? msg.senderId : (msg.senderId as any)?._id;
              const isMe = senderIdStr === currentUser?._id;

              // Get sender info using our centralized helper
              const senderInfo = isMe ? getUserInfo(currentUser) : getUserInfo(msg.senderId); // msg.senderId might be populated object

              const timestamp = msg.createdAt
                ? new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "";

              return (
                <div
                  key={msg._id}
                  className={`flex items-start gap-3 ${isMe ? "flex-row-reverse" : ""}`}
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={senderInfo.avatar} />
                    <AvatarFallback>{senderInfo.initials}</AvatarFallback>
                  </Avatar>
                  <div
                    className={`max-w-[70%] rounded-lg ${isMe ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"} p-3`}
                  >
                    <div className={`flex items-center gap-2 ${isMe ? "justify-end" : ""}`}>
                      <p className="text-sm font-medium">{senderInfo.name}</p>
                    </div>
                    <p className="wrap-break-words whitespace-pre-wrap">{msg.text}</p>
                    <p className={`mt-1 text-xs opacity-70 ${isMe ? "text-right" : ""}`}>
                      {timestamp}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
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
