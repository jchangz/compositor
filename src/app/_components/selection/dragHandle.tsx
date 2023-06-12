import React, { useRef, useEffect } from "react";
import { useDrag } from "@use-gesture/react";
import { useSprings, a } from "@react-spring/web";
import { ClipPathUpdate, ImageProps } from "./selection.types";

export default function DragHandle({
  showDragHandles,
  dragHandleData,
  drawClipPath,
  imageProps,
}: {
  showDragHandles: Boolean;
  dragHandleData: Array<Array<number>>;
  drawClipPath: ({
    path,
    config,
    immediate,
  }: {
    path: Array<Number>;
    config?: Object | undefined;
    immediate?: boolean | undefined;
  }) => void;
  imageProps: ImageProps;
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

  const calculateClipPath = (update?: ClipPathUpdate) => {
    const { height, width } = imageProps;
    // Deep copy otherwise handles adjustment will recursively add to itself
    const dragHandleCoordinates = JSON.parse(JSON.stringify(dragHandleData));
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

  useEffect(() => {
    if (dragHandleData.length && showDragHandles) {
      animateDragHandles.start((index) => ({
        x: dragHandleData[index][0] - dragHandleWidth / 2,
        y: dragHandleData[index][1] - dragHandleWidth / 2,
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
  }, [animateDragHandles, dragHandleData, showDragHandles]);

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
          dragHandleData[index][0] -
          dragHandleWidth / 2 +
          (index === originalIndex ? mx : 0),
        y:
          dragHandleData[index][1] -
          dragHandleWidth / 2 +
          (index === originalIndex ? my : 0),
        scale: 0.5,
      }));

      if (!active) {
        animateDragHandles.start(() => ({ scale: 1 }));
        dragHandleData[originalIndex][0] += mx;
        dragHandleData[originalIndex][1] += my;
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
