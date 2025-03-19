"use client";

import { api } from "@/trpc/react";
import { useState } from "react";

export function CreateTodo() {
  const [description, setDescription] = useState("");
  const createPost = api.todo.create.useMutation({
    onSuccess: async () => {
      setDescription("");
    },
  });

  return (
    <div>
      <h2 className="text-2xl font-bold">Create a todo</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          createPost.mutate({ name: description });
        }}
        className="flex"
      >
        <input
          type="text"
          placeholder="Title"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-l-full px-4 py-2 text-black"
        />
        <button
          type="submit"
          className="rounded-r-full bg-white/10 px-5 py-3 font-semibold transition hover:bg-white/20"
          disabled={createPost.isPending}
        >
          {createPost.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
