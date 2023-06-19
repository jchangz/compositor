"use client";

import Selection from "../_components/selection";
import { RouteData, ImageData } from "@/shared/interfaces/imageData.interface";

export default function Grid({ data }: { data: RouteData }) {
  const { images } = data;

  return (
    <>
      {images.map((img: ImageData) => (
        <div className="relative" key={img.url}>
          <Selection image={img}></Selection>
        </div>
      ))}
    </>
  );
}
