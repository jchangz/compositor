import { ImageProps } from "./selection.types";

export const calculateDragHandlesFromClipPath = (
  clipPathArr: Number[],
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

export const clamp = (val: number, min: number, max: number) =>
  Math.min(Math.max(val, min), max);
