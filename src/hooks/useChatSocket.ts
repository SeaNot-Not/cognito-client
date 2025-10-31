"use client";

import { useEffect, useMemo, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { MessageItem } from "@/types/message.types";

interface UseChatSocketOptions {
  matchId?: string;
  onReceive?: (message: MessageItem) => void;
}

const SOCKET_URL =
  process.env.NEXT_PUBLIC_NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_URL_PROD
    : process.env.NEXT_PUBLIC_API_URL_DEV;

let singletonSocket: Socket | null = null;

export default function useChatSocket({ matchId, onReceive }: UseChatSocketOptions) {
  const socket = useMemo(() => {
    if (!SOCKET_URL) return null;
    if (!singletonSocket) {
      singletonSocket = io(SOCKET_URL, { withCredentials: true });
    }
    return singletonSocket;
  }, []);

  // track the last joined room so we can leave it when matchId changes
  const lastRoomRef = useRef<string | null>(null);

  useEffect(() => {
    if (!socket) return;

    // leave previous room if different
    if (lastRoomRef.current && lastRoomRef.current !== matchId) {
      socket.emit("leave_match_room", lastRoomRef.current);
    }

    if (matchId) {
      socket.emit("join_match_room", matchId);
      lastRoomRef.current = matchId;
    }

    const handler = (payload: { success: boolean; data?: MessageItem }) => {
      if (payload?.success && payload?.data && onReceive) onReceive(payload.data);
    };

    socket.on("receive_message", handler);

    return () => {
      socket.off("receive_message", handler);
      // when component unmounts, leave the last joined room
      if (lastRoomRef.current) {
        socket.emit("leave_match_room", lastRoomRef.current);
        lastRoomRef.current = null;
      }
    };
  }, [socket, matchId, onReceive]);

  const sendMessage = (data: { matchId: string; senderId: string; text: string }) => {
    if (!socket) return;
    socket.emit("send_message", data);
  };

  return { socket, sendMessage } as const;
}
