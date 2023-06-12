"use client";

import { useEffect, useRef, useState } from "react";
import ClipPathImage from "./clipPath";
import Image from "next/image";
import { ImageProps } from "./selection.types";

export default function Selection({
  item,
}: {
  item: { url: string; dbClipPath: Array<Number> };
}) {
  const image = useRef<HTMLImageElement>(null);
  const imageProps = useRef<ImageProps>({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    height: 0,
    width: 0,
  });
  const [showClipPath, setShowClipPath] = useState(false);

  useEffect(() => {
    if (image.current) {
      const { top, right, bottom, left, height, width } =
        image.current.getBoundingClientRect();

      imageProps.current = {
        top: Math.round(top),
        right: Math.round(right),
        bottom: Math.round(bottom + window.scrollY),
        left: Math.round(left),
        height: Math.round(height),
        width: Math.round(width),
      };
    }
  }, []);

  const onLoadComplete = () => {
    setShowClipPath(true);
  };

  return (
    <>
      <div style={{ height: "500px", width: "500px", position: "relative" }}>
        <Image
          onLoadingComplete={onLoadComplete}
          ref={image}
          src={item.url}
          className="opacity-70"
          fill={true}
          alt=""
        />
        {showClipPath && (
          <ClipPathImage imageProps={imageProps.current} item={item} />
        )}
      </div>
    </>
  );
}
