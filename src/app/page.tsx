import Link from "next/link";
import { getData } from "./_components/db";

export default async function Home() {
  const routes = await getData();

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      {routes.map((route) => (
        <Link href={`/edit/${route.slug}`}>{route.title}</Link>
      ))}
    </main>
  );
}
