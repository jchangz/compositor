"use client";

import { useEffect, useState } from "react";
import { TypedUseSelectorHook, useSelector, useDispatch } from "react-redux";
import Preview from "@/components/preview";
import { RootState } from "@/store";
import { setClipPathBatch, ClipPathBatchPayload } from "@/store/clipPathSlice";
import { getClipPathBatchFromIDB } from "@/database";
import { RouteData } from "@/shared/interfaces/imageData.interface";

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default function HomeLayout({ data }: { data: RouteData }) {
  const { images, slug } = data;
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);
  const clipPathState = useAppSelector((state) => state.clipPath);
  const { data: clipPathStateData } = clipPathState;

  useEffect(() => {
    if (Object.keys(clipPathStateData).length) {
      // If provider contains data it means all clip paths have already been set from the selection component
      setReady(true);
    } else {
      // If we land on the homepage, there is no clip path data in the provider
      // Set default clip paths in payload object
      const payload: ClipPathBatchPayload = {};
      images.forEach((img) => {
        const { id, dbClipPath } = img;
        payload[id] = dbClipPath;
      });
      // If we have data saved in the indexed DB, add it to the payload
      getClipPathBatchFromIDB(slug).then((res) => {
        const resKeys = Object.keys(res);
        if (resKeys.length) {
          resKeys.forEach((key) => {
            payload[key] = res[key];
          });
        }
        dispatch(setClipPathBatch(payload));
      });
    }
  }, [dispatch, clipPathStateData, images, slug]);

  return ready && <Preview data={data} />;
}
