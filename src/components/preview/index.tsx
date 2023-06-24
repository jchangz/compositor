"use client";

import ClipPathPreview from "./clipPath";
import { RouteData } from "@/shared/interfaces/imageData.interface";

export default function Preview({ data }: { data: RouteData }) {
  const { images } = data;

  return (
    <>
      {images.map((img) => (
        <div className="absolute w-full aspect-[5/4]" key={img.id}>
          <ClipPathPreview item={img} />
        </div>
      ))}
    </>
  );
}
