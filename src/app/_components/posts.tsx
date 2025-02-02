"use client";

import { PostCreate } from "@/app/_components/post-create";
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";

export function Posts() {
  const { status } = useSession();

  const [posts] = api.post.getAll.useSuspenseQuery();

  return (
    <div className="w-full max-w-xs">
      {posts.length ? (
        <ul className="flex flex-col gap-2">
          {posts.map((post) => (
            <li key={post.id} className="rounded-lg bg-white/10 p-4">
              {post.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts yet.</p>
      )}
      {status === "authenticated" && <PostCreate />}
    </div>
  );
}
