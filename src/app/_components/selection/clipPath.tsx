import { useEffect, useRef } from "react";
import { ImageProps, ClipPathUpdate } from "./selection.types";

const calculateDragHandlesFromClipPath = (
  clipPathArr: Array<number>,
  imageProps: ImageProps
) => {
  // ClipPath is saved in percentage, and we convert into pixels for the handles positioning which is based on a transform in pixel values
  // If size of images changes, we can still get the correct relative pixel values
  const { height, width } = imageProps;
  const result = [];
  const arrcopy = [...clipPathArr];
  while (arrcopy.length > 0) {
    result.push(
      arrcopy.splice(0, 2).map((coordinateVal, i) => {
        const coordinatePercentage = coordinateVal / 100;
        if (i % 2 === 0) return Math.round(coordinatePercentage * width);
        return Math.round(coordinatePercentage * height);
      })
    );
  }
  return result;
};

const clamp = (val: number, min: number, max: number) =>
  Math.min(Math.max(val, min), max);

export default function ClipPath(selectionBoundsRef: RefObject<>, item) {
  const imageProps = useRef<ImageProps>({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    height: 0,
    width: 0,
  });
  const clipPathRef = useRef<Array<number>>();
  const handlesRef = useRef<Array<Array<number>>>();

  useEffect(() => {
    const { top, right, bottom, left, height, width } =
      selectionBoundsRef.current.getBoundingClientRect();

    imageProps.current = {
      top: Math.round(top),
      right: Math.round(right),
      bottom: Math.round(bottom + window.scrollY),
      left: Math.round(left),
      height: Math.round(height),
      width: Math.round(width),
    };
  }, [selectionBoundsRef]);

  useEffect(() => {
    if (item.dbClipPath) {
      handlesRef.current = calculateDragHandlesFromClipPath(
        item.dbClipPath,
        imageProps.current
      );
      clipPathRef.current = item.dbClipPath;
    }
  }, [item, clipPathRef, handlesRef]);

  /**
   *
   * @param update <ClipPathUpdate> Data for updating clip path handle
   * @returns Array<number> New clip path coordinates
   */
  const calculateClipPath = (update?: ClipPathUpdate) => {
    const { height, width } = imageProps.current;
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

    clipPathRef.current = clipPathCoordinates;
    return clipPathCoordinates;
  };

  const calculateDragHandle = (
    ix: number,
    iy: number,
    x: number,
    y: number
  ) => {
    const { left, right, top, bottom } = imageProps.current;
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

  return {
    handlesRef,
    calculateDragHandle,
    calculateClipPath,
  };
}
