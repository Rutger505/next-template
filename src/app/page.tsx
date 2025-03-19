import { Posts } from "@/app/_components/posts";
import { sendDiscordMessage } from "@/lib/discord";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className={"space-y-10"}>
        <h1 className="text-center text-4xl font-bold">Hi!</h1>
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
            className="flex h-10 items-center justify-center gap-2 rounded-full border border-solid border-transparent bg-foreground px-4 text-sm text-background transition-colors hover:bg-[#383838] sm:h-12 sm:px-5 sm:text-base dark:hover:bg-[#ccc]"
          >
            Send a message to Discord
          </button>
        </form>

        <Posts />
      </main>
    </div>
  );
}
