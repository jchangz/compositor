import { getData } from "@/app/_components/db";
import Providers from "@/components/provider";
import Grid from "@/app/_image/grid";
import Preview from "@/components/preview";

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [data] = await getData(slug);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Providers>
        <Grid data={data} />
        <Preview data={data} />
      </Providers>
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
