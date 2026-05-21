"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";

import { prisma } from "@/lib/prisma";

type VoteType = "UP" | "DOWN";

export async function votePost(
  postId: string,
  type: VoteType
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      error: "Unauthorized",
    };
  }

  const existingVote = await prisma.vote.findUnique({
    where: {
      userId_postId: {
        userId: session.user.id,
        postId,
      },
    },
  });

  if (existingVote) {
    if (existingVote.type === type) {
      await prisma.vote.delete({
        where: {
          id: existingVote.id,
        },
      });

      await prisma.post.update({
        where: {
          id: postId,
        },

        data: {
          voteCount:
            type === "UP"
              ? { decrement: 1 }
              : { increment: 1 },
        },
      });

      return {
        success: "Vote removed",
      };
    }

    await prisma.vote.update({
      where: {
        id: existingVote.id,
      },

      data: {
        type,
      },
    });

    await prisma.post.update({
      where: {
        id: postId,
      },

      data: {
        voteCount:
          type === "UP"
            ? { increment: 2 }
            : { decrement: 2 },
      },
    });

    return {
      success: "Vote updated",
    };
  }

  await prisma.vote.create({
    data: {
      type,
      userId: session.user.id,
      postId,
    },
  });

  await prisma.post.update({
    where: {
      id: postId,
    },

    data: {
      voteCount:
        type === "UP"
          ? { increment: 1 }
          : { decrement: 1 },
    },
  });

  return {
    success: "Vote added",
  };
}