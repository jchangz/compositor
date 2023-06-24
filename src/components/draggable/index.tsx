import { useRef, useEffect, useState } from "react";
import { useSprings, a } from "@react-spring/web";
import useWindowSize from "../selection/useWindowSize";
import Selection from "../selection";
import _ from "lodash";
import {
  ImageDataArray,
  ImagePropsData,
} from "@/shared/interfaces/imageData.interface";

const defaultImageProps = () => {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    height: 0,
    width: 0,
  };
};

export default function Draggable({
  images,
  slug,
}: {
  images: ImageDataArray;
  slug: string;
}) {
  const [imageProps, setImageProps] = useState<Array<ImagePropsData>>([]);
  const [springs, api] = useSprings(images.length, () => ({
    opacity: 0,
  }));
  // Ref for calculating the bounding rect of each child image element
  const containerRef = useRef<HTMLDivElement>(null);
  // Custom hook for monitoring window resize
  const windowSize = useWindowSize();

  const updateImageProps = () => {
    if (containerRef.current) {
      const imgElementArray = containerRef.current.children;

      const imagePropData = Array.from(imgElementArray).map((res) => {
        const { top, right, bottom, left, height, width } =
          res.firstElementChild?.getBoundingClientRect() || defaultImageProps();
        return {
          top: Math.round(top),
          right: Math.round(right),
          bottom: Math.round(bottom + window.scrollY),
          left: Math.round(left),
          height: Math.round(height),
          width: Math.round(width),
        };
      });

      setImageProps(imagePropData);
    }
  };

  useEffect(() => {
    updateImageProps();
    api.start((index) => ({ opacity: 1, delay: index * 100 }));
  }, [api]);

  useEffect(() => {
    if (windowSize) updateImageProps();
  }, [windowSize]);

  return (
    <div
      className="grid grid-cols-2 gap-4 col-span-2 w-full"
      ref={containerRef}
    >
      {springs.map(({ opacity }, i) => (
        <a.div className="drag-item" key={i} style={{ opacity }}>
          <a.div className="relative aspect-[5/4]">
            <Selection
              image={images[i]}
              slug={slug}
              imageProps={imageProps[i]}
            />
          </a.div>
          <span>DRAG</span>
        </a.div>
      ))}
    </div>
  );
}
