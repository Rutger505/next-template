import { Post } from "@/app/_components/post";
import { api } from "@/trpc/server";
import { type Session } from "next-auth";

export async function PostList({ session }: { session: Session | null }) {
  const posts = await api.post.getAll();

  return (
    <div>
      <h2 className="text-2xl font-bold">Posts</h2>
      {posts.length ? (
        <ul className="flex flex-col gap-2">
          {posts.map((post) => (
            <Post key={post.id} post={post} session={session} />
          ))}
        </ul>
      ) : (
        <p>No posts yet.</p>
      )}
    </div>
  );
}
