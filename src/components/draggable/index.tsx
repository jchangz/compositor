import { useRef, useEffect, useState } from "react";
import { useSprings, a } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import useWindowSize from "../selection/useWindowSize";
import Selection from "../selection";
import { clamp } from "lodash";
import {
  ImageDataArray,
  ImagePropsData,
} from "@/shared/interfaces/imageData.interface";

interface RowData {
  [id: number]: Array<number>;
}

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
    x: 0,
    y: 0,
    opacity: 0,
  }));
  // Ref for calculating the bounding rect of each child image element
  const containerRef = useRef<HTMLDivElement>(null);
  // Custom hook for monitoring window resize
  const windowSize = useWindowSize();

  const imageDimensions = useRef({
    width: 0,
    height: 0,
  });
  const maxCols = useRef(0);

  let order = images.map((...[, index]) => index);
  let currentIndexPosition = 0;
  let currentCol = 0;

  const updateImageProps = () => {
    if (containerRef.current) {
      const rowData: RowData = {};

      // Calculate the bounding rect for each image
      const imgElementArray = containerRef.current.children;
      const imagePropData = Array.from(imgElementArray).map((res, i) => {
        const { top, right, bottom, left, height, width } =
          res.firstElementChild?.getBoundingClientRect() || defaultImageProps();

        if (i === 0) {
          imageDimensions.current = {
            width: Math.round(width),
            height: Math.round(height),
          };
        }

        const topInteger = Math.round(top);
        if (!rowData[topInteger]) rowData[topInteger] = [];
        rowData[topInteger].push(height);

        return {
          top: topInteger,
          right: Math.round(right),
          bottom: Math.round(bottom + window.scrollY),
          left: Math.round(left),
          height: Math.round(height),
          width: Math.round(width),
        };
      });

      maxCols.current = Object.values(rowData)[0].length;

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

  const bind = useDrag(
    ({ args: [originalIndex], down, active, first, movement: [mx, my] }) => {
      if (first) {
        currentIndexPosition = order.indexOf(originalIndex);
        currentCol = currentIndexPosition % maxCols.current;
      }

      const newCol = Math.abs(
        clamp(
          Math.round(mx / imageDimensions.current.width + currentCol),
          0,
          maxCols.current - 1
        )
      );

      console.log(newCol);

      api.start((index) => ({
        x: down && index === originalIndex ? mx : 0,
        y: down && index === originalIndex ? my : 0,
      }));
    },
    {
      bounds: containerRef,
    }
  );

  return (
    <div
      className="grid grid-cols-2 gap-4 col-span-2 w-full"
      ref={containerRef}
    >
      {springs.map(({ opacity, x, y }, i) => (
        <a.div className="drag-item" key={i} style={{ opacity, x, y }}>
          <a.div className="relative aspect-[5/4]">
            <Selection
              image={images[i]}
              slug={slug}
              imageProps={imageProps[i]}
            />
          </a.div>
          <span {...bind(i)}>DRAG</span>
        </a.div>
      ))}
    </div>
  );
}
