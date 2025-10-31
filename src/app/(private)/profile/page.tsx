"use client";

import { useState } from "react";
import useAuthStore from "@/hooks/stores/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Helper: Split text into paragraphs
const splitParagraphs = (text: string | undefined): string[] => {
  if (!text) return [];
  return text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
};

// Component: ParagraphList
const ParagraphList = ({ paragraphs, className }: { paragraphs: string[]; className?: string }) => {
  return paragraphs.map((paragraph, index, arr) => (
    <p key={index} className={cn(index === arr.length - 1 ? "" : "mb-2", className)}>
      {paragraph}
    </p>
  ));
};

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  const MAX_LENGTH = 300;
  const [isExpanded, setIsExpanded] = useState(false);

  const formattedBio = splitParagraphs(user?.bio);
  const fullText = formattedBio.join("\n");

  // Handle truncation logic
  let truncatedBio: string[] = [];
  if (fullText.length > MAX_LENGTH) {
    let charCount = 0;

    for (let para of formattedBio) {
      if (charCount + para.length > MAX_LENGTH) {
        const remaining = MAX_LENGTH - charCount;
        truncatedBio.push(para.slice(0, remaining) + "…");
        break;
      }
      truncatedBio.push(para);
      charCount += para.length;
    }
  }

  const displayParagraphs =
    fullText.length > MAX_LENGTH && !isExpanded ? truncatedBio : formattedBio;

  return (
    <main className="flex min-h-full w-full items-center justify-center p-10">
      <Card className="w-full max-w-lg border pb-0">
        <CardContent className="p-6">
          {/* Avatar */}
          <div className="mb-5 flex w-full justify-center">
            <Avatar className="border-primary size-48 border-4">
              <AvatarImage src={user?.profileImage || ""} />
              <AvatarFallback>{user?.name?.[0]?.toUpperCase() || "?"}</AvatarFallback>
            </Avatar>
          </div>

          {/* Info Fields */}
          <div className="space-y-2">
            <div>
              <p className="text-muted-foreground text-sm">Email:</p>
              <p className="font-medium break-all">{user?.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Name:</p>
              <p className="font-medium">{user?.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Age:</p>
              <p className="font-medium">{user?.age ?? "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Bio:</p>

              {user?.bio ? (
                <div className="text-sm leading-relaxed font-medium wrap-break-word">
                  <ParagraphList paragraphs={displayParagraphs} />

                  {fullText.length > MAX_LENGTH && (
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="text-primary mt-2 px-0 hover:underline"
                    >
                      {isExpanded ? "Show Less" : "Show More"}
                    </Button>
                  )}
                </div>
              ) : (
                <p className="text-lg font-medium">—</p>
              )}
            </div>
          </div>

          {/* Edit Button */}
          <div className="mt-5 flex justify-end">
            <Button className="w-full sm:w-auto" onClick={() => router.push("/edit-profile")}>
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
