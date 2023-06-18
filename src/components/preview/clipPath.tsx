import { useEffect, useCallback } from "react";
import { useSpring, a } from "@react-spring/web";
import Image from "next/image";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { RootState } from "@/store";

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default function ClipPathPreview({
  item,
}: {
  item: { url: string; dbClipPath: Array<Number> };
}) {
  const clipPathState = useAppSelector((state) => state.clipPath);
  const { data } = clipPathState;

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
    if (data[item.url]) {
      drawClipPath({
        path: data[item.url],
        config: { mass: 1, tension: 170, friction: 26 },
      });
    }
  }, [data, drawClipPath, item.url]);

  return (
    <>
      <div className="absolute w-full h-full top-0 left-0 bg-cover">
        <a.div
          className="absolute w-full h-full top-0 left-0 pointer-events-none bg-cover"
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
    </>
  );
}