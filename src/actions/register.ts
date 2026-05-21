"use server";

import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

import {
  registerSchema,
  RegisterSchemaType,
} from "@/features/auth/schemas/register-schema";

export async function registerUser(values: RegisterSchemaType) {
  try {
    const validatedFields = registerSchema.safeParse(values);

    if (!validatedFields.success) {
      return {
        error: "Invalid fields",
      };
    }

    const { username, email, password } = validatedFields.data;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email,
          },
          {
            username,
          },
        ],
      },
    });

    if (existingUser) {
      return {
        error: "User already exists",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    return {
      success: "User created successfully",
    };
  } catch {
    return {
      error: "Something went wrong",
    };
  }
}