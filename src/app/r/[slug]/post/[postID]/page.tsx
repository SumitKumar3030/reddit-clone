import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { CommentForm } from "@/features/comment/components/comment-form";
import { VoteButtons } from "@/features/votes/components/vote-buttons";
import { CommentVoteButtons } from "@/features/votes/components/comment-vote-buttons";

type Props = {
  params: Promise<{
    slug: string;
    postId: string;
  }>;
};

export default async function PostPage({ params }: Props) {
  const { slug, postId } = await params;

  const post = await prisma.post.findFirst({
    where: {
      id: postId,

      community: {
        slug,
      },
    },

    include: {
      author: true,
      community: true,
      comments: {
        include: {
          author: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-4">
      <Card>
        <CardContent className="space-y-5 p-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Posted by u/{post.author.username}</span>

            <span>•</span>

            <span>r/{post.community.name}</span>
          </div>

          <h1 className="text-3xl font-bold">{post.title}</h1>

          <p className="whitespace-pre-wrap text-base leading-7">
            {post.content}
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <VoteButtons postId={post.id} voteCount={post.voteCount} />

            <span>{post.comments.length} comments</span>

            <span>{post.createdAt.toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <CommentForm postId={post.id} />
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Comments</h2>

        {post.comments.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No comments yet
            </CardContent>
          </Card>
        ) : (
          post.comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="space-y-3 p-5">
                <div className="text-sm text-muted-foreground">
                  u/{comment.author.username}
                </div>

                <p className="whitespace-pre-wrap">{comment.content}</p>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {comment.createdAt.toLocaleDateString()}
                  </p>

                  <CommentVoteButtons
                    commentId={comment.id}
                    voteCount={comment.voteCount}
                  />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
  );
}
