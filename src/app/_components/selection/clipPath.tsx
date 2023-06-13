"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";
import { useDrag } from "@use-gesture/react";
import { useSpring, a } from "@react-spring/web";
import Image from "next/image";
import DragHandle from "./dragHandle";
import { clamp, calculateDragHandlesFromClipPath } from "./helpers";
import { ImageProps } from "./selection.types";

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
  // Keep track of the scroll position of the window on first render
  const initialScrollY = useRef(0);
  const [clipPathProps, animateClipPath] = useSpring(() => ({
    from: {
      path: Array(8).fill(50),
    },
    path: Array(8).fill(50),
  }));

  const calculateClipPath = (ix: number, iy: number, x: number, y: number) => {
    const { left, right, top, height, width } = imageProps;
    const widthCalc = (w: number) => Math.round((w / width) * 100);
    const heightCalc = (h: number) => Math.round((h / height) * 100);

    const newScrollY = initialScrollY.current - window.scrollY;
    const newTop = top + newScrollY;

    const selectionCoordinates = [
      widthCalc(clamp(x, left, right) - left),
      clamp(heightCalc(y - newTop), 0, 100),
      widthCalc(ix - left),
      clamp(heightCalc(y - newTop), 0, 100),
      widthCalc(clamp(x, left, right) - left),
      heightCalc(iy - newTop),
      widthCalc(ix - left),
      heightCalc(iy - newTop),
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
    initialScrollY.current = window.scrollY;
  }, [drawClipPath, item.dbClipPath, imageProps]);

  const bindClipPath = useDrag(
    ({ active, first, initial: [ix, iy], xy: [x, y] }) => {
      if (first) setShowDragHandles(false);
      const newPath = calculateClipPath(ix, iy, x, y);
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
