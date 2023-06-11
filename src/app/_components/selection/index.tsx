"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { useDrag } from "@use-gesture/react";
import { useSpring, a } from "@react-spring/web";
import ClipPath from "./clipPath";
import DragHandle from "./dragHandle";

export default function Selection({
  item,
}: {
  item: { url: string; dbClipPath: Array<Number> };
}) {
  const selectionBoundsRef = useRef<HTMLDivElement>(null);
  const [showDragHandles, setShowDragHandles] = useState(true);
  const { handlesRef, calculateDragHandle, calculateClipPath } = ClipPath(
    selectionBoundsRef,
    item
  );

  const [clipPathProps, animateClipPath] = useSpring(() => ({
    from: {
      path: Array(8).fill(50),
    },
    path: Array(8).fill(50),
  }));

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
      path: item.dbClipPath || [100, 100, 100, 100, 100, 100, 100, 100],
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
            backgroundImage: `url(${item.url})`,
          }}
        />
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
