import { getData } from "@/app/_components/db";
import Providers from "@/components/provider";
import EditLayout from "./_layout";

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [data] = await getData(slug);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Providers>
        <EditLayout data={data} />
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
