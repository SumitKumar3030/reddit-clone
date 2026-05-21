"use client";

import { useTransition } from "react";

import { useRouter } from "next/navigation";

import {
  ChevronUp,
  ChevronDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { voteComment } from "@/actions/vote-comment";

type Props = {
  commentId: string;
  voteCount: number;
};

export function CommentVoteButtons({
  commentId,
  voteCount,
}: Props) {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  const handleVote = (
    type: "UP" | "DOWN"
  ) => {
    startTransition(async () => {
      await voteComment(commentId, type);

      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        size="icon"
        variant="outline"
        disabled={isPending}
        onClick={() => handleVote("UP")}
      >
        <ChevronUp className="size-4" />
      </Button>

      <span className="min-w-[30px] text-center text-sm font-medium">
        {voteCount}
      </span>

      <Button
        size="icon"
        variant="outline"
        disabled={isPending}
        onClick={() => handleVote("DOWN")}
      >
        <ChevronDown className="size-4" />
      </Button>
    </div>
  );
}