"use client";

import Selection from "../_components/selection";

export default function Grid({ data }: { data: { images: Array<any> } }) {
  return (
    <div className="grid grid-cols-2 w-full max-w-7xl">
      {data.images.map(
        (img: { url: string; title: string; dbClipPath: Array<number> }) => (
          <div className="relative" key={img.url}>
            <Selection item={img}></Selection>
          </div>
        )
      )}
    </div>
  );
}
