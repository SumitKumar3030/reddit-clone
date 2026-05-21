"use client";

import Link from "next/link";

import { useSession, signOut } from "next-auth/react";

import { Home, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Navbar() {
  const { data: session } = useSession();

  return (
  <header className="border-b bg-background">
    <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
      <Link
        href="/"
        className="flex items-center gap-2 font-bold"
      >
        <Home className="size-5" />

        <span>Reddit Clone</span>
      </Link>

      <div className="flex items-center gap-3">
        {session?.user ? (
          <>
            <Link href="/create-community">
              <Button
                size="sm"
                variant="outline"
              >
                Create Community
              </Button>
            </Link>

            <Link href="/submit">
              <Button size="sm">
                <Plus className="mr-1 size-4" />

                Create Post
              </Button>
            </Link>

            <p className="text-sm font-medium">
              {session.user.name}
            </p>

            <Button
              size="sm"
              variant="outline"
              onClick={() => signOut()}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link href="/login">
              <Button
                size="sm"
                variant="outline"
              >
                Login
              </Button>
            </Link>

            <Link href="/register">
              <Button size="sm">
                Register
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  </header>
);
}
