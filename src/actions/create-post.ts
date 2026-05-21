"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";

import { prisma } from "@/lib/prisma";

import {
  createPostSchema,
  CreatePostSchemaType,
} from "@/features/post/schemas/create-post-schema";

export async function createPost(
  values: CreatePostSchemaType
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      error: "Unauthorized",
    };
  }

  const validatedFields =
    createPostSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
    };
  }

  const { title, content, communityId } =
    validatedFields.data;

  const post = await prisma.post.create({
    data: {
      title,
      content,
      communityId,
      authorId: session.user.id,
    },

    include: {
      community: true,
    },
  });

  return {
    success: "Post created",
    slug: post.community.slug,
  };
}