import { getData } from "@/app/_components/db";
import Grid from "@/app/_image/grid";

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [data] = await getData(slug);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full font-bold text-center">{data.title}</div>
      <Grid data={data} />
    </main>
  );
}

export async function generateStaticParams() {
  const routes = await getData();

  return routes.map((route) => ({
    slug: route.slug,
  }));
}

export const dynamicParams = false;
