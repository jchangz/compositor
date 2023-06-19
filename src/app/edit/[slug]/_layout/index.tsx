"use client";

import Selection from "@/components/selection";
import Preview from "@/components/preview";
import { RouteData, ImageData } from "@/shared/interfaces/imageData.interface";

export default function EditLayout({ data }: { data: RouteData }) {
  const { images } = data;

  return (
    <div className="grid grid-cols-2 w-full max-w-7xl">
      <>
        <>
          {images.map((img: ImageData) => (
            <div className="relative" key={img.url}>
              <Selection image={img}></Selection>
            </div>
          ))}
        </>
        <Preview data={data} />
      </>
    </div>
  );
}
