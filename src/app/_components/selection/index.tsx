import { useEffect, useRef, useState } from "react";
import useWindowSize from "../helpers/useWindowSize";
import ClipPathImage from "./clipPath";
import Image from "next/image";
import { ImageProps } from "./selection.types";

export default function Selection({
  item,
}: {
  item: { url: string; dbClipPath: Array<Number> };
}) {
  // Reference to the image where we can get the properties
  const image = useRef<HTMLImageElement>(null);
  // Keep the image properites in state to have the correct dimensions when we resize
  const [imageProps, setImageProps] = useState<ImageProps | null>(null);
  // Custom hook for monitoring window resize
  const windowSize = useWindowSize();

  const updateImageProps = () => {
    if (image.current) {
      const { top, right, bottom, left, height, width } =
        image.current.getBoundingClientRect();

      setImageProps({
        top: Math.round(top),
        right: Math.round(right),
        bottom: Math.round(bottom + window.scrollY),
        left: Math.round(left),
        height: Math.round(height),
        width: Math.round(width),
      });
    }
  };

  useEffect(() => {
    if (windowSize) updateImageProps();
  }, [windowSize]);

  return (
    <>
      <div className="relative aspect-[5/4]">
        <Image
          onLoadingComplete={updateImageProps}
          ref={image}
          src={item.url}
          className={imageProps ? "opacity-30" : "opacity-100"}
          fill={true}
          alt=""
        />
        {imageProps && <ClipPathImage imageProps={imageProps} item={item} />}
      </div>
    </>
  );
}
