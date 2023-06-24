"use client";

import { useState, useEffect } from "react";
import { initializeIDB } from "@/database";
import Preview from "@/components/preview";
import Draggable from "@/components/draggable";
import { RouteData } from "@/shared/interfaces/imageData.interface";

export default function EditLayout({ data }: { data: RouteData }) {
  const { images, slug } = data;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initializeIDB(data).then(() => setReady(true));
  }, [data]);

  return (
    <>
      {ready ? (
        <div className="grid grid-cols-3 gap-4 w-full max-w-[100rem]">
          <Draggable images={images} slug={slug} />
          <div className="relative grid col-span-1 w-full">
            <Preview data={data} />
          </div>
        </div>
      ) : (
        <p>Loading</p>
      )}
    </>
  );
}
