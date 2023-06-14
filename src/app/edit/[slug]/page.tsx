import { getData } from "@/app/_components/db";
import Selection from "@/app/_components/selection";

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [data] = await getData(slug);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full font-bold text-center">{data.title}</div>
      <div className="grid grid-cols-2 w-full max-w-7xl">
        {data.images.map(
          (img: { url: string; title: string; dbClipPath: Array<number> }) => (
            <div className="relative">
              <Selection item={img}></Selection>
            </div>
          )
        )}
      </div>
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
