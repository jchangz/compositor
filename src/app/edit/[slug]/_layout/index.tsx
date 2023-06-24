"use client";

import { useState, useEffect } from "react";
import { initializeIDB } from "@/database";
import Selection from "@/components/selection";
import Preview from "@/components/preview";
import { RouteData, ImageData } from "@/shared/interfaces/imageData.interface";

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
          <div className="grid grid-cols-2 gap-4 col-span-2 w-full">
            {images.map((img: ImageData) => (
              <div className="relative" key={img.id}>
                <Selection image={img} slug={slug}></Selection>
                <p>{img.title}</p>
              </div>
            ))}
          </div>
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
