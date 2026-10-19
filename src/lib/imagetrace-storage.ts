const DATABASE_NAME = "imagetrace-local";
const DATABASE_VERSION = 1;
const IMAGE_STORE = "recent-images";
const MAX_RECENT_IMAGES = 6;

export type StoredTraceImage = {
  id: string;
  name: string;
  blob: Blob;
  savedAt: number;
};

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("This browser does not support local image storage."));
      return;
    }
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(IMAGE_STORE, { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Could not open local image storage."));
    request.onblocked = () => reject(new Error("Local image storage is busy in another tab. Close that tab and try again."));
  });
}

export async function saveTraceImage(image: StoredTraceImage) {
  const database = await openDatabase();
  return new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(IMAGE_STORE, "readwrite");
    const store = transaction.objectStore(IMAGE_STORE);
    store.put(image);
    const list = store.getAll();
    list.onsuccess = () => {
      const olderImages = (list.result as StoredTraceImage[])
        .filter((entry) => entry.id !== image.id)
        .sort((first, second) => second.savedAt - first.savedAt)
        .slice(MAX_RECENT_IMAGES - 1);
      olderImages.forEach((entry) => store.delete(entry.id));
    };
    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error ?? new Error("Could not save this image on your device."));
    };
    transaction.onabort = () => {
      database.close();
      reject(transaction.error ?? new Error("Saving this image was interrupted."));
    };
  });
}

export async function getRecentTraceImages(): Promise<StoredTraceImage[]> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(IMAGE_STORE, "readonly");
    const request = transaction.objectStore(IMAGE_STORE).getAll();
    request.onsuccess = () => {
      database.close();
      resolve((request.result as StoredTraceImage[]).sort((first, second) => second.savedAt - first.savedAt));
    };
    request.onerror = () => {
      database.close();
      reject(request.error ?? new Error("Could not load your recent images."));
    };
  });
}
