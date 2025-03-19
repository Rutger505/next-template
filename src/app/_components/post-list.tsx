import { api } from "@/trpc/server";

export async function PostList() {
  const posts = await api.post.getAll();

  return (
    <div>
      <h2 className="text-2xl font-bold">Posts</h2>
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
