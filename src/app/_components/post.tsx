"use client";

import { sendDiscordMessage } from "@/lib/discord";
import { api } from "@/trpc/react";
import { type api as serverApi } from "@/trpc/server";
import { useState } from "react";

export function Post({
  post,
}: {
  post: Awaited<ReturnType<(typeof serverApi.post)["getAll"]>>[number];
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftPostName, setDraftPostName] = useState(post.name); // Local state for the edited value

  const updatePostMutation = api.post.update.useMutation();

  const handleSave = async () => {
    try {
      await updatePostMutation.mutateAsync({
        id: post.id,
        newName: draftPostName,
      });
      setIsEditing(false); // Switch back to view mode after successful save
    } catch (error) {
      // Optionally handle errors, e.g., display an error message
      console.error("Failed to update post:", error);
      await sendDiscordMessage("Failed to update post: " + error?.toString());
    }
  };

  return (
    <li className="rounded-lg bg-white/10 p-4">
      {isEditing ? (
        <div className={"flex justify-between gap-2"}>
          <input
            className={"rounded border-2 px-2 text-black"}
            type="text"
            value={draftPostName}
            onChange={(e) => setDraftPostName(e.target.value)}
          />
          <button onClick={handleSave} disabled={updatePostMutation.isPending}>
            {updatePostMutation.isPending ? "Saving..." : "Save"}
          </button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div className={"flex justify-between"}>
          {post.name}
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </div>
      )}
    </li>
  );
}
