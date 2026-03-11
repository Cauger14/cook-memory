import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Cook Memory</h1>
      <p className="mt-4 text-gray-600">
        Bienvenue {session.user.name} !
      </p>
    </main>
  );
}