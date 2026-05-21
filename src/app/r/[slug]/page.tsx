import Link from "next/link";

import { prisma } from "@/lib/prisma";

import { Card, CardContent } from "@/components/ui/card";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CommunityPage({
  params,
}: Props) {
  const { slug } = await params;

  const community =
    await prisma.community.findUnique({
      where: {
        slug,
      },

      include: {
        posts: {
          include: {
            author: true,
          },

          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

  if (!community) {
    return (
      <main className="mx-auto max-w-4xl p-4">
        <h1 className="text-2xl font-bold">
          Community not found
        </h1>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-4">
      <div className="rounded-lg border bg-card p-6">
        <h1 className="text-3xl font-bold">
          r/{community.name}
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          {community.posts.length} posts
        </p>
      </div>

      <div className="space-y-4">
        {community.posts.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No posts yet
            </CardContent>
          </Card>
        ) : (
          community.posts.map((post) => (
            <Link
              key={post.id}
              href={`/r/${community.slug}/post/${post.id}`}
            >
              <Card className="transition hover:bg-muted/40">
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>
                      Posted by u/{post.author.username}
                    </span>
                  </div>

                  <h2 className="text-xl font-semibold">
                    {post.title}
                  </h2>

                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {post.content}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      {post.voteCount} votes
                    </span>

                    <span>
                      {post.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}