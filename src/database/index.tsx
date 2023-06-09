import { openDB } from "idb";
import { RouteData } from "@/shared/interfaces/imageData.interface";
import { ClipPathBatchPayload } from "@/store/clipPathSlice";

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
        const clippathStore = db.createObjectStore("clipPath");
        clippathStore.createIndex("slug", "slug");
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

export async function getClipPathBatchFromIDB(slug: string) {
  const cursorData: ClipPathBatchPayload = {};
  const db1 = await openDB("compositor", 1);
  const store = db1.transaction("clipPath", "readonly").store.index("slug");

  let cursor = await store.openCursor();
  while (cursor) {
    const primaryKey = cursor.primaryKey.toString();
    const key = cursor.key;
    const clipPath = cursor.value.clipPath;

    if (key === slug) {
      cursorData[primaryKey] = clipPath;
    }
    cursor = await cursor.continue();
    if (!cursor) break;
  }
  db1.close();
  return cursorData;
}

export async function saveClipPathToIDB(
  slug: string,
  clipPath: Array<number>,
  id: string
) {
  const db1 = await openDB("compositor", 1);
  db1.put("clipPath", { slug: slug, clipPath: clipPath }, id);
  db1.close();
}
