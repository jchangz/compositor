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
        <>
          <div className="grid grid-cols-2 w-full max-w-7xl">
            {images.map((img: ImageData) => (
              <div className="relative" key={img.id}>
                <Selection image={img} slug={slug}></Selection>
              </div>
            ))}
          </div>
          <Preview data={data} />
        </>
      ) : (
        <p>Loading</p>
      )}
    </>
  );
}
