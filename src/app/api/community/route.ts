import { prisma } from "@/lib/prisma";

export async function GET() {
  const communities =
    await prisma.community.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

  return Response.json(communities);
}