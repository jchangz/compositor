import { useState } from "react";
import ClipPathImage from "./clipPath";
import Image from "next/image";
import {
  ImageData,
  ImagePropsData,
} from "@/shared/interfaces/imageData.interface";

export default function Selection({
  image,
  slug,
  imageProps,
}: {
  image: ImageData;
  slug: string;
  imageProps: ImagePropsData;
}) {
  const { url } = image;
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <Image
        onLoadingComplete={() => setLoaded(true)}
        src={url}
        className="opacity-30"
        sizes="50vw"
        fill={true}
        alt=""
      />
      {loaded && (
        <ClipPathImage imageProps={imageProps} image={image} slug={slug} />
      )}
    </>
  );
}
