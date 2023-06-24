import { getData } from "@/app/_components/db";
import Providers from "@/components/provider";
import EditLayout from "./_layout";

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [data] = await getData(slug);

  return (
    <main className="p-4">
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
