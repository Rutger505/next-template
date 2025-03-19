import { CreateTodo } from "@/app/_components/create-todo";
import { api } from "@/trpc/server";

export async function Todos() {
  const posts = await api.todo.getAll();

  return (
    <div className="w-full max-w-xs space-y-10">
      <CreateTodo />

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
