"use client";

import { useTransition } from "react";

import { useRouter } from "next/navigation";

import { ChevronUp, ChevronDown } from "lucide-react";

import { toast } from "react-hot-toast";

import { votePost } from "@/actions/vote-post";

import { Button } from "@/components/ui/button";

type Props = {
  postId: string;
  voteCount: number;
};

export function VoteButtons({
  postId,
  voteCount,
}: Props) {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  const handleVote = (
    type: "UP" | "DOWN"
  ) => {
    startTransition(async () => {
      const response = await votePost(
        postId,
        type
      );

      if (response.error) {
        toast.error(response.error);
        return;
      }

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