import { openDB } from "idb";
import { RouteData } from "@/shared/interfaces/imageData.interface";

export async function initializeIDB(data: RouteData) {
  if (!("indexedDB" in window)) {
    console.log("This browser doesn't support IndexedDB");
    return;
  }

  const db = await window.indexedDB
    .databases()
    .then((res) => res.map((database) => database.name));

  if (!db.includes("compositor")) {
    // Create the compositor indexedDB
    openDB("compositor", 1, {
      upgrade(db) {
        db.createObjectStore("clipPath");
      },
    });
  }

  return false;
}

export async function getClipPathFromIDB(id: string) {
  const db1 = await openDB("compositor", 1);
  const clipPath = await db1.get("clipPath", id);
  db1.close();
  return clipPath;
}

export async function saveClipPathToIDB(clipPath: Array<number>, id: string) {
  const db1 = await openDB("compositor", 1);
  db1.put("clipPath", clipPath, id);
  db1.close();
}
