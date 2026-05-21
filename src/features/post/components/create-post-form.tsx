"use client";

import { useEffect, useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "react-hot-toast";

import {
  createPostSchema,
  CreatePostSchemaType,
} from "@/features/post/schemas/create-post-schema";

import { createPost } from "@/actions/create-post";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

type Community = {
  id: string;
  name: string;
};

export function CreatePostForm() {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  const [communities, setCommunities] =
    useState<Community[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePostSchemaType>({
    resolver: zodResolver(createPostSchema),

    defaultValues: {
      title: "",
      content: "",
      communityId: "",
    },
  });

  useEffect(() => {
    async function fetchCommunities() {
      const response = await fetch("/api/community");

      const data = await response.json();

      setCommunities(data);
    }

    fetchCommunities();
  }, []);

  const onSubmit = (
    values: CreatePostSchemaType
  ) => {
    startTransition(async () => {
      const response = await createPost(values);

      if (response.error) {
        toast.error(response.error);
        return;
      }

      toast.success(
        response.success || "Post created"
      );

      router.push(`/r/${response.slug}`);
    });
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create Post</CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Community
            </label>

            <select
              {...register("communityId")}
              className="w-full rounded-md border p-2"
            >
              <option value="">
                Select Community
              </option>

              {communities.map((community) => (
                <option
                  key={community.id}
                  value={community.id}
                >
                  {community.name}
                </option>
              ))}
            </select>

            {errors.communityId && (
              <p className="text-sm text-red-500">
                {errors.communityId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Title
            </label>

            <Input
              placeholder="Post title"
              {...register("title")}
            />

            {errors.title && (
              <p className="text-sm text-red-500">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Content
            </label>

            <textarea
              {...register("content")}
              placeholder="Write something..."
              className="min-h-[150px] w-full rounded-md border p-3"
            />

            {errors.content && (
              <p className="text-sm text-red-500">
                {errors.content.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
          >
            {isPending
              ? "Creating..."
              : "Create Post"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}