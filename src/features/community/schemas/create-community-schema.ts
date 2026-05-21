import { z } from "zod";

export const createCommunitySchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(21, "Name must be less than 21 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Only letters, numbers and underscore allowed"
    ),
});

export type CreateCommunitySchemaType =
  z.infer<typeof createCommunitySchema>;