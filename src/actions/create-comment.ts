"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";

import { prisma } from "@/lib/prisma";

import {
  createCommentSchema,
  CreateCommentSchemaType,
} from "@/features/comment/schemas/create-comment-schema";

export async function createComment(
  values: CreateCommentSchemaType,
  postId: string
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      error: "Unauthorized",
    };
  }

  const validatedFields =
    createCommentSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid comment",
    };
  }

  await prisma.comment.create({
    data: {
      content: validatedFields.data.content,
      postId,
      authorId: session.user.id,
    },
  });

  return {
    success: "Comment added",
  };
}