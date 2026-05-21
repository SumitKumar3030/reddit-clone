"use server";

import { authOptions } from "@/auth";

import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";

import {
  createCommunitySchema,
  CreateCommunitySchemaType,
} from "@/features/community/schemas/create-community-schema";

export async function createCommunity(
  values: CreateCommunitySchemaType
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      error: "Unauthorized",
    };
  }

  const validatedFields =
    createCommunitySchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
    };
  }

  const { name } = validatedFields.data;

  const existingCommunity =
    await prisma.community.findUnique({
      where: {
        slug: name.toLowerCase(),
      },
    });

  if (existingCommunity) {
    return {
      error: "Community already exists",
    };
  }

  await prisma.community.create({
    data: {
      name,
      slug: name.toLowerCase(),
      creatorId: session.user.id,
    },
  });

  return {
    success: "Community created",
  };
}