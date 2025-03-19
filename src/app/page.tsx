import { PostCreate } from "@/app/_components/post-create";
import { PostList } from "@/app/_components/post-list";
import { auth, signIn, signOut } from "@/server/auth";

export default async function Home() {
  const session = await auth();

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
        {session ? (
          <div className={"flex flex-col items-center space-y-2.5"}>
            <span className={"text-center"}>
              Session: {JSON.stringify(session)}
            </span>
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button type="submit">Sign Out</button>
            </form>
          </div>
        ) : (
          <form
            action={async () => {
              "use server";
              await signIn();
            }}
          >
            <button type="submit">Sign In</button>
          </form>
        )}

        <div className={"flex flex-col gap-7"}>
          {session && <PostCreate />}

          <PostList session={session} />
        </div>
      </main>
    </div>
  );
}
