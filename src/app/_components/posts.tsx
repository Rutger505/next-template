import { PostCreate } from "@/app/_components/post-create";
import { api } from "@/trpc/server";

export async function Posts() {
  const posts = await api.post.getAll();

  return (
    <div className="w-full max-w-xs space-y-10">
      <PostCreate />

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
    </div>
  );
}
