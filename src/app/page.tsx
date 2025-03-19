import { PostCreate } from "@/app/_components/post-create";
import { PostList } from "@/app/_components/post-list";
import { sendDiscordMessage } from "@/lib/discord";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <main className={"flex flex-col items-center justify-center gap-10"}>
        <div className={"flex flex-col items-center space-y-2.5"}>
          <h1 className="text-4xl font-bold">Hi There!</h1>
          <h2 className={"text-1xl max-w-md text-center font-bold"}>
            This is a demo blog app with database integration and discord
            messages for showing usage of these tools
          </h2>
        </div>

        <form
          className="flex flex-col items-center gap-4 sm:flex-row"
          action={async () => {
            "use server";

            await sendDiscordMessage(
              "Hi there! This is a test message from Next.js",
            );
          }}
        >
          <button
            type="submit"
            className="h-12 rounded-full bg-foreground px-4 text-sm text-background transition-colors hover:opacity-90"
          >
            Send a message to Discord
          </button>
        </form>

        <div className={"flex flex-col gap-7"}>
          <PostCreate />

          <PostList />
        </div>
      </main>
    </div>
  );
}
