"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import useLikeUserMutation from "@/hooks/mutations/useLikeUserMutation";
import useSkipUserMutation from "@/hooks/mutations/useSkipUserMutation";
import useDiscoverUsersInfinite, { DiscoverUser } from "@/hooks/queries/useDiscoverUsersInfinite";
import { PanInfo } from "framer-motion";

// Types
type User = DiscoverUser;

interface SwipeCardProps {
  user: User;
  onSwipe: (direction: "left" | "right") => void;
}

function SwipeCard({ user, onSwipe }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-25, 0, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;

    if (Math.abs(info.offset.x) > threshold) {
      const direction = info.offset.x > 0 ? "right" : "left";
      onSwipe(direction);
    }
  };

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      initial={{ scale: 1, opacity: 1 }}
      exit={{
        x: x.get() > 0 ? 300 : -300,
        opacity: 0,
        transition: { duration: 0.3 },
      }}
    >
      <div className="flex h-full w-full items-center justify-center">
        <div className="bg-background w-full rounded-xl border p-6 shadow-lg">
          <div className="mb-4 flex w-full justify-center">
            <Avatar className="h-48 w-48">
              <AvatarImage
                src={user.profileImage || ""}
                draggable={false}
                className="pointer-events-none select-none"
              />
              <AvatarFallback className="text-4xl">
                {user.name ? user.name.charAt(0).toUpperCase() : "?"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="space-y-1 text-center">
            <h2 className="text-xl font-semibold">{user.name}</h2>
            {user.age ? <p className="text-muted-foreground">{user.age} years old</p> : null}
            {user.bio ? <p className="text-sm wrap-break-word">{user.bio}</p> : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CardSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="bg-background w-full animate-pulse rounded-xl border p-6 shadow-lg">
        <div className="mb-4 flex w-full justify-center">
          <div className="bg-muted h-48 w-48 rounded-full" />
        </div>
        <div className="space-y-2 text-center">
          <div className="bg-muted mx-auto h-6 w-32 rounded" />
          <div className="bg-muted mx-auto h-4 w-24 rounded" />
          <div className="bg-muted mx-auto h-4 w-48 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function DiscoverPage() {
  const queryClient = useQueryClient();

  const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage, refetch } =
    useDiscoverUsersInfinite();
  const pages = data?.pages ?? [];
  const initialQueue = pages.flatMap((p) => p?.data?.items ?? []);
  const [queue, setQueue] = useState<User[]>(initialQueue);
  const user = queue[0] || null;

  console.log("USERRRR", user);

  const { mutate: likeUser, isPending: liking } = useLikeUserMutation();
  const { mutate: skipUser, isPending: skipping } = useSkipUserMutation();

  const [lastDirection, setLastDirection] = useState<"left" | "right" | null>(null);

  // Sync queue when new pages arrive
  useEffect(() => {
    const newQueue = pages.flatMap((p) => p?.data?.items ?? []);
    if (newQueue.length > 0) {
      setQueue(newQueue);
    }
  }, [pages]);

  const onSwipe = (direction: "left" | "right") => {
    if (!user) return;

    setLastDirection(direction);

    const afterServer = () => {
      // Remove current user from queue
      setQueue((prev) => prev.slice(1));

      // If low on users, fetch next page
      if (queue.length <= 3 && hasNextPage) {
        fetchNextPage();
      }
    };

    if (direction === "right") {
      likeUser(user._id, {
        onSuccess: (res: any) => {
          // Optimistically update current user cache
          queryClient.setQueryData(["current-user"], (old: any) => {
            if (!old?.data) return old;
            return {
              ...old,
              data: {
                ...old.data,
                likes: [...(old.data.likes || []), user._id],
              },
            };
          });

          toast.success(`${user.name} liked successfully! ❤️`);
          if (res?.data?.newMatch) {
            toast.success("It's a match! 🎉");
          }
          afterServer();
        },
        onError: (err: any) => {
          toast.error(err?.message || "Failed to like");
          // Rollback on error - refetch current user
          queryClient.invalidateQueries({ queryKey: ["current-user"] });
        },
      });
    } else if (direction === "left") {
      skipUser(user._id, {
        onSuccess: () => {
          // Optimistically update current user cache
          queryClient.setQueryData(["current-user"], (old: any) => {
            if (!old?.data) return old;
            return {
              ...old,
              data: {
                ...old.data,
                skips: [...(old.data.skips || []), user._id],
              },
            };
          });

          toast.success(`${user.name} skipped successfully! 👋`);
          afterServer();
        },
        onError: (err: any) => {
          toast.error(err?.message || "Failed to skip");
          // Rollback on error - refetch current user
          queryClient.invalidateQueries({ queryKey: ["current-user"] });
        },
      });
    }
  };

  const isBusy = isFetching || liking || skipping || isFetchingNextPage;

  return (
    <section className="mx-auto flex min-h-full w-full max-w-md flex-col items-center justify-center p-4">
      <div className="relative h-[500px] w-full">
        {/* Card Container */}
        {user ? (
          <div className="absolute inset-0">
            <SwipeCard key={user._id} user={user} onSwipe={onSwipe} />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="rounded-xl border p-6 text-center">No users to display.</div>
          </div>
        )}
      </div>

      {/* Swipe feedback */}
      {lastDirection && (
        <div className="mt-4 text-center">
          <p className="text-muted-foreground text-lg">
            You swiped <span className="font-semibold">{lastDirection}</span>
          </p>
        </div>
      )}

      {/* Skeleton while fetching - now matches card design  */}
      {isBusy && (
        <div className="absolute inset-0 z-0">
          <CardSkeleton />
        </div>
      )}
    </section>
  );
}
