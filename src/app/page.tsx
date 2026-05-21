import Link from "next/link";

import { prisma } from "@/lib/prisma";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { VoteButtons } from "@/features/votes/components/vote-buttons";

export default async function HomePage() {
  const communities = await prisma.community.findMany({
    orderBy: {
      createdAt: "desc",
    },

    include: {
      posts: true,
    },
  });

  const posts = await prisma.post.findMany({
    include: {
      author: true,
      community: true,
      comments: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 p-4 md:grid-cols-3">
      {/* LEFT SIDEBAR */}
      <div className="space-y-4 md:sticky md:top-20 md:self-start">
        <Card>
          <CardContent className="space-y-4 p-5">
            <div>
              <h2 className="text-2xl font-bold">
                Communities
              </h2>

              <p className="text-sm text-muted-foreground">
                Browse all communities
              </p>
            </div>

            <Link href="/create-community">
              <Button className="w-full">
                Create Community
              </Button>
            </Link>

            <div className="space-y-3">
              {communities.map((community) => (
                <Link
                  key={community.id}
                  href={`/r/${community.slug}`}
                >
                  <div className="cursor-pointer rounded-lg border p-3 transition hover:bg-muted/40">
                    <h3 className="font-semibold">
                      r/{community.name}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      {community.posts.length} posts
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* POSTS FEED */}
      <div className="space-y-4 md:col-span-2">
        <Card>
          <CardContent className="p-6">
            <h1 className="text-3xl font-bold">
              Home Feed
            </h1>

            <p className="text-muted-foreground">
              Latest posts from communities
            </p>
          </CardContent>
        </Card>

        {/* POSTS */}
        {posts.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center text-muted-foreground">
              No posts yet
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card
              key={post.id}
              className="transition hover:bg-muted/40 hover:shadow-md"
            >
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>
                      Posted by u/{post.author.username}
                    </span>

                    <span>•</span>

                    <span>
                      r/{post.community.name}
                    </span>
                  </div>

                  <VoteButtons
                    postId={post.id}
                    voteCount={post.voteCount}
                  />
                </div>

                <Link
                  href={`/r/${post.community.slug}/post/${post.id}`}
                  className="block cursor-pointer space-y-4"
                >
                  <h2 className="text-2xl font-bold">
                    {post.title}
                  </h2>

                  <p className="line-clamp-3 text-muted-foreground">
                    {post.content}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      {post.comments.length} comments
                    </span>

                    <span>
                      {post.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
  );
}