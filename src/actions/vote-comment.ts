"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";

import { prisma } from "@/lib/prisma";

type VoteType = "UP" | "DOWN";

export async function voteComment(
  commentId: string,
  type: VoteType
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      error: "Unauthorized",
    };
  }

  const existingVote = await prisma.vote.findFirst({
    where: {
      commentId,
      userId: session.user.id,
    },
  });

  if (existingVote) {
    if (existingVote.type === type) {
      await prisma.vote.delete({
        where: {
          id: existingVote.id,
        },
      });

      await prisma.comment.update({
        where: {
          id: commentId,
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

    await prisma.comment.update({
      where: {
        id: commentId,
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
      commentId,
      userId: session.user.id,
    },
  });

  await prisma.comment.update({
    where: {
      id: commentId,
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