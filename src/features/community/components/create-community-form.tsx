"use client";

import { useTransition } from "react";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "react-hot-toast";

import {
  createCommunitySchema,
  CreateCommunitySchemaType,
} from "@/features/community/schemas/create-community-schema";

import { createCommunity } from "@/actions/create-community";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

export function CreateCommunityForm() {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCommunitySchemaType>({
    resolver: zodResolver(createCommunitySchema),

    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (
    values: CreateCommunitySchemaType
  ) => {
    startTransition(async () => {
      const response = await createCommunity(values);

      if (response.error) {
        toast.error(response.error);
        return;
      }

      toast.success(
        response.success || "Community created"
      );

      router.push(`/r/${values.name.toLowerCase()}`);
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create Community</CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Community Name
            </label>

            <Input
              placeholder="e.g. programming"
              {...register("name")}
            />

            {errors.name && (
              <p className="text-sm text-red-500">
                {errors.name.message}
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
              : "Create Community"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}