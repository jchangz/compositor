import { useEffect, useRef, useState } from "react";
import useWindowSize from "../helpers/useWindowSize";
import ClipPathImage from "./clipPath";
import Image from "next/image";
import {
  ImageData,
  ImagePropsData,
} from "@/shared/interfaces/imageData.interface";

export default function Selection({ image }: { image: ImageData }) {
  const { url } = image;
  // Reference to the image where we can get the properties
  const imageRef = useRef<HTMLImageElement>(null);
  // Keep the image properites in state to have the correct dimensions when we resize
  const [imageProps, setImageProps] = useState<ImagePropsData | null>(null);
  // Custom hook for monitoring window resize
  const windowSize = useWindowSize();

  const updateImageProps = () => {
    if (imageRef.current) {
      const { top, right, bottom, left, height, width } =
        imageRef.current.getBoundingClientRect();

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
          ref={imageRef}
          src={url}
          className={imageProps ? "opacity-30" : "opacity-100"}
          sizes="50vw"
          fill={true}
          alt=""
        />
        {imageProps && <ClipPathImage imageProps={imageProps} image={image} />}
      </div>
    </>
  );
}
