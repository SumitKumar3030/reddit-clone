import { z } from "zod";

export const createPostSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(300),

  content: z
    .string()
    .min(1, "Content is required"),

  communityId: z
    .string()
    .min(1, "Select a community"),
});

export type CreatePostSchemaType =
  z.infer<typeof createPostSchema>;