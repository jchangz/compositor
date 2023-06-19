"use client";

import ClipPathPreview from "./clipPath";
import { RouteData } from "@/shared/interfaces/imageData.interface";

export default function Preview({ data }: { data: RouteData }) {
  const { images } = data;

  return (
    <div className="fixed w-[400px] right-0">
      {images.map((img) => (
        <div className="absolute w-[500px] aspect-[5/4]" key={img.id}>
          <ClipPathPreview item={img} />
        </div>
      ))}
    </div>
  );
}
