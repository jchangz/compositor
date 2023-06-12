"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";
import { useDrag } from "@use-gesture/react";
import { useSpring, a } from "@react-spring/web";
import DragHandle from "./dragHandle";
import Image from "next/image";
import { clamp } from "./helpers";
import { ClipPathUpdate, ImageProps } from "./selection.types";

export default function ClipPathImage({
  imageProps,
  item,
}: {
  imageProps: ImageProps;
  item: { url: string; dbClipPath: Array<Number> };
}) {
  const selectionBoundsRef = useRef<HTMLDivElement>(null);
  const [showDragHandles, setShowDragHandles] = useState(true);
  const handlesRef = useRef<Array<Array<number>>>(null);
  const [clipPathProps, animateClipPath] = useSpring(() => ({
    from: {
      path: Array(8).fill(50),
    },
    path: Array(8).fill(50),
  }));

  const calculateDragHandle = (
    ix: number,
    iy: number,
    x: number,
    y: number
  ) => {
    const { left, right, top, bottom } = imageProps;
    const selectionCoordinates = [
      [clamp(x, left, right) - left, ix - left],
      [clamp(y, top, bottom) - top, iy - top],
    ];
    const getHandles = (arr: Array<Array<number>>) => {
      if (arr.length === 1) return arr[0];
      const handles = [];
      const recursion = getHandles(arr.slice(1));
      for (let i = 0; i < recursion.length; i += 1) {
        for (let j = 0; j < arr[0].length; j += 1) {
          handles.push([].concat(arr[0][j], recursion[i]));
        }
      }
      return handles;
    };
    handlesRef.current = getHandles(selectionCoordinates);
  };

  const calculateClipPath = (update?: ClipPathUpdate) => {
    const { height, width } = imageProps;
    // Deep copy otherwise handles adjustment will recursively add to itself
    const dragHandleCoordinates = JSON.parse(
      JSON.stringify(handlesRef.current)
    );
    const clipPathCoordinates = [];

    if (update) {
      dragHandleCoordinates[update.index][0] += update.x;
      dragHandleCoordinates[update.index][1] += update.y;
    }
    for (let i = 0; i < dragHandleCoordinates.length; i += 1) {
      const x = Math.round((dragHandleCoordinates[i][0] / width) * 100);
      const y = Math.round((dragHandleCoordinates[i][1] / height) * 100);
      clipPathCoordinates.push(x, y);
    }

    return clipPathCoordinates;
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
    drawClipPath({
      path: item.dbClipPath || [0, 0, 0, 100, 100, 100, 100, 0],
      config: { mass: 1, tension: 170, friction: 26 },
    });
  }, [drawClipPath, item.dbClipPath]);

  const bindClipPath = useDrag(
    ({ active, first, initial: [ix, iy], xy: [x, y] }) => {
      if (first) setShowDragHandles(false);
      calculateDragHandle(ix, iy, x, y);
      drawClipPath({ path: calculateClipPath() });
      if (!active) {
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
        handlesRef={handlesRef}
        calculateClipPath={calculateClipPath}
        drawClipPath={drawClipPath}
      />
    </>
  );
}
