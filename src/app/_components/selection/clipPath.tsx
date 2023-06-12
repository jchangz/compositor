"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";
import { useDrag } from "@use-gesture/react";
import { useSpring, a } from "@react-spring/web";
import DragHandle from "./dragHandle";
import Image from "next/image";
import { clamp } from "./helpers";
import { ImageProps } from "./selection.types";
import { calculateDragHandlesFromClipPath } from "./helpers";

export default function ClipPathImage({
  imageProps,
  item,
}: {
  imageProps: ImageProps;
  item: { url: string; dbClipPath: Array<Number> };
}) {
  const selectionBoundsRef = useRef<HTMLDivElement>(null);
  const [showDragHandles, setShowDragHandles] = useState(true);
  const [dragHandleData, setDragHandleData] = useState<Array<Array<number>>>(
    []
  );
  const [clipPathProps, animateClipPath] = useSpring(() => ({
    from: {
      path: Array(8).fill(50),
    },
    path: Array(8).fill(50),
  }));

  const calculateClipPath = (ix: number, iy: number, x: number, y: number) => {
    const { left, right, top, bottom, height, width } = imageProps;
    const widthCalc = (w: number) => Math.round((w / width) * 100);
    const heightCalc = (h: number) => Math.round((h / height) * 100);

    const selectionCoordinates = [
      widthCalc(clamp(x, left, right) - left),
      heightCalc(clamp(y, top, bottom) - top),
      widthCalc(ix - left),
      heightCalc(clamp(y, top, bottom) - top),
      widthCalc(clamp(x, left, right) - left),
      heightCalc(iy - top),
      widthCalc(ix - left),
      heightCalc(iy - top),
    ];

    return selectionCoordinates;
  };

  const drawClipPath = useCallback(
    ({
      path,
      config,
      immediate,
    }: {
      path: Array<Number>;
      config?: Object;
      immediate?: boolean;
    }) => {
      animateClipPath.start(() => ({
        path,
        config: config || { mass: 1, tension: 270, friction: 25 },
        immediate: immediate || false,
      }));
    },
    [animateClipPath]
  );

  useEffect(() => {
    const initialClipPath = item.dbClipPath || [0, 0, 100, 0, 0, 100, 100, 0];
    drawClipPath({
      path: initialClipPath,
      config: { mass: 1, tension: 170, friction: 26 },
    });
    setDragHandleData(
      calculateDragHandlesFromClipPath(initialClipPath, imageProps)
    );
  }, [drawClipPath, item.dbClipPath, imageProps]);

  const bindClipPath = useDrag(
    ({ active, first, initial: [ix, iy], xy: [x, y] }) => {
      if (first) setShowDragHandles(false);
      console.log(ix, iy);
      const newPath = calculateClipPath(
        ix,
        iy + window.scrollY,
        x,
        y + window.scrollY
      );
      drawClipPath({ path: newPath });
      if (!active) {
        // Calculate the drag handles after selection is over
        setDragHandleData(
          calculateDragHandlesFromClipPath(newPath, imageProps)
        );
        setShowDragHandles(true);
      }
    },
    {
      bounds: selectionBoundsRef,
      preventDefault: true,
    }
  );

  return (
    <>
      <div
        {...bindClipPath()}
        className="absolute w-full h-full top-0 left-0 bg-cover"
      >
        <a.div
          className="absolute w-full h-full top-0 left-0 pointer-events-none bg-cover"
          ref={selectionBoundsRef}
          style={{
            clipPath: clipPathProps.path.to(
              (p1, p2, p3, p4, p5, p6, p7, p8) =>
                `polygon(${p1}% ${p2}%, ${p3}% ${p4}%, ${p7}% ${p8}%, ${p5}% ${p6}%)`
            ),
          }}
        >
          <Image src={item.url} fill={true} alt="" />
        </a.div>
      </div>
      <DragHandle
        showDragHandles={showDragHandles}
        dragHandleData={dragHandleData}
        imageProps={imageProps}
        drawClipPath={drawClipPath}
      />
    </>
  );
}
