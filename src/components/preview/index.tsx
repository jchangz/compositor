"use client";

import Image from "next/image";
import ClipPathPreview from "./clipPath";

export default function Preview({ data }) {
  return (
    <>
      <div className="fixed w-[400px] right-0">
        {data.images.map(
          (img: { url: string; title: string; dbClipPath: Array<number> }) => (
            <div className="absolute w-[500px] aspect-[5/4]" key={img.url}>
              <Image
                src={img.url}
                className="opacity-0"
                fill={true}
                sizes="50vw"
                alt=""
              />
              <ClipPathPreview item={img} />
            </div>
          )
        )}
      </div>
    </>
  );
}
