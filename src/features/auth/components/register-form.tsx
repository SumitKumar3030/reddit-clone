"use client";

import { useTransition } from "react";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "react-hot-toast";

import {
  registerSchema,
  RegisterSchemaType,
} from "@/features/auth/schemas/register-schema";

import { registerUser } from "@/actions/register";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

export function RegisterForm() {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: RegisterSchemaType) => {
    startTransition(async () => {
      const response = await registerUser(values);

      if (response.error) {
        toast.error(response.error);
        return;
      }

      toast.success(response.success || "Account created");

      router.push("/login");
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Username
            </label>

            <Input
              placeholder="Enter username"
              {...register("username")}
            />

            {errors.username && (
              <p className="text-sm text-red-500">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Email
            </label>

            <Input
              type="email"
              placeholder="Enter email"
              {...register("email")}
            />

            {errors.email && (
              <p className="text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Password
            </label>

            <Input
              type="password"
              placeholder="Enter password"
              {...register("password")}
            />

            {errors.password && (
              <p className="text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? "Creating..." : "Create Account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}