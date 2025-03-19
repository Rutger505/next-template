import { PostCreate } from "@/app/_components/post-create";
import { PostList } from "@/app/_components/post-list";

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

        <div className={"flex flex-col gap-7"}>
          <PostCreate />

          <PostList />
        </div>
      </main>
    </div>
  );
}
