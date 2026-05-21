"use client";

import { useTransition } from "react";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "react-hot-toast";

import {
  createCommentSchema,
  CreateCommentSchemaType,
} from "@/features/comment/schemas/create-comment-schema";

import { createComment } from "@/actions/create-comment";

import { Button } from "@/components/ui/button";

type Props = {
  postId: string;
};

export function CommentForm({
  postId,
}: Props) {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCommentSchemaType>({
    resolver: zodResolver(createCommentSchema),

    defaultValues: {
      content: "",
    },
  });

  const onSubmit = (
    values: CreateCommentSchemaType
  ) => {
    startTransition(async () => {
      const response = await createComment(
        values,
        postId
      );

      if (response.error) {
        toast.error(response.error);
        return;
      }

      toast.success(
        response.success || "Comment added"
      );

      reset();

      router.refresh();
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <textarea
        {...register("content")}
        placeholder="Write a comment..."
        className="min-h-[120px] w-full rounded-md border p-3"
      />

      {errors.content && (
        <p className="text-sm text-red-500">
          {errors.content.message}
        </p>
      )}

      <Button
        type="submit"
        disabled={isPending}
      >
        {isPending
          ? "Posting..."
          : "Add Comment"}
      </Button>
    </form>
  );
}