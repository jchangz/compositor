import React, { useRef, useEffect, RefObject } from "react";
import { useDrag } from "@use-gesture/react";
import { useSprings, a } from "@react-spring/web";

export default function DragHandle({
  calculateClipPath,
  handlesRef,
  drawClipPath,
  showDragHandles,
}: {
  calculateClipPath: React.FC;
  handlesRef: RefObject<Array<any>>;
  drawClipPath: React.FC;
  showDragHandles: Boolean;
}) {
  const dragHandleWidth = 26;
  const dragHandleBoundary = useRef<HTMLDivElement>(null);
  const [dragHandleProps, animateDragHandles] = useSprings(4, () => ({
    x: 0,
    y: 0,
    opacity: 0,
    scale: 0,
    config: { mass: 1, tension: 270, friction: 25 },
  }));

  useEffect(() => {
    if (handlesRef.current && showDragHandles) {
      animateDragHandles.start((index) => ({
        x: handlesRef.current![index][0] - dragHandleWidth / 2,
        y: handlesRef.current![index][1] - dragHandleWidth / 2,
        immediate: true,
      }));
      animateDragHandles.start((index) => ({
        opacity: 1,
        scale: 1,
        delay: index * 20,
      }));
    } else {
      animateDragHandles.start(() => ({
        opacity: 0,
      }));
    }
  }, [animateDragHandles, handlesRef, showDragHandles]);

  const bindDragHandle = useDrag(
    ({ args: [originalIndex], active, movement: [mx, my] }) => {
      const newPath = calculateClipPath({
        index: originalIndex,
        x: mx,
        y: my,
      });
      drawClipPath({ path: newPath });
      animateDragHandles.start((index) => ({
        x:
          handlesRef.current![index][0] -
          dragHandleWidth / 2 +
          (index === originalIndex ? mx : 0),
        y:
          handlesRef.current![index][1] -
          dragHandleWidth / 2 +
          (index === originalIndex ? my : 0),
        scale: 0.5,
      }));

      if (!active) {
        animateDragHandles.start(() => ({ scale: 1 }));
        handlesRef.current![originalIndex][0] += mx;
        handlesRef.current![originalIndex][1] += my;
      }
    },
    {
      bounds: dragHandleBoundary,
      preventDefault: true,
    }
  );
  return (
    <div className="handles">
      <div
        className="absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] pointer-events-none"
        ref={dragHandleBoundary}
        style={{
          width: `calc(100% + ${dragHandleWidth}px)`,
          height: `calc(100% + ${dragHandleWidth}px)`,
        }}
      />
      {dragHandleProps.map(({ opacity, x, y, scale }, i) => (
        <a.span
          {...bindDragHandle(i)}
          style={{
            x,
            y,
            scale,
            opacity,
            width: dragHandleWidth,
            height: dragHandleWidth,
          }}
          key={i}
        />
      ))}
    </div>
  );
}
