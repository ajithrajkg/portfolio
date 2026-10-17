import type { BirthProfile, PanchangamRecord } from "./types";

const DATABASE_NAME = "personal-panchangam";
const DATABASE_VERSION = 1;
const RECORDS_STORE = "daily-records";
const PROFILE_KEY = "personal-panchangam-profile-v1";
const CACHE_DAYS = 92;

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(RECORDS_STORE)) {
        const store = database.createObjectStore(RECORDS_STORE, { keyPath: "key" });
        store.createIndex("date", "date");
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Could not open local Panchangam storage."));
  });
}

function recordKey(record: PanchangamRecord): string {
  return `${record.date}:${record.place.id}`;
}

export const LocalPanchangamStore = {
  loadProfile(): BirthProfile | null {
    const value = localStorage.getItem(PROFILE_KEY);
    return value ? (JSON.parse(value) as BirthProfile) : null;
  },

  saveProfile(profile: BirthProfile): void {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  },

  async getRecord(date: string, placeId: string): Promise<PanchangamRecord | null> {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const request = database
        .transaction(RECORDS_STORE, "readonly")
        .objectStore(RECORDS_STORE)
        .get(`${date}:${placeId}`);
      request.onsuccess = () => {
        const stored = request.result as (PanchangamRecord & { key: string }) | undefined;
        resolve(stored ?? null);
      };
      request.onerror = () => reject(request.error ?? new Error("Could not read cached Panchangam data."));
    });
  },

  async saveRecords(records: PanchangamRecord[], today: string): Promise<void> {
    const database = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(RECORDS_STORE, "readwrite");
      const store = transaction.objectStore(RECORDS_STORE);
      const oldest = today;
      const newest = addDays(today, CACHE_DAYS - 1);

      for (const record of records) {
        store.put({ ...record, key: recordKey(record) });
      }

      const cursorRequest = store.openCursor();
      cursorRequest.onsuccess = () => {
        const cursor = cursorRequest.result;
        if (!cursor) return;
        const record = cursor.value as PanchangamRecord & { key: string };
        if (record.date < oldest || record.date > newest) cursor.delete();
        cursor.continue();
      };
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error ?? new Error("Could not save Panchangam data."));
      transaction.onabort = () => reject(transaction.error ?? new Error("Saving Panchangam data was interrupted."));
    });
  },

  async clear(): Promise<void> {
    localStorage.removeItem(PROFILE_KEY);
    const database = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(RECORDS_STORE, "readwrite");
      transaction.objectStore(RECORDS_STORE).clear();
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error ?? new Error("Could not clear local Panchangam data."));
      transaction.onabort = () => reject(transaction.error ?? new Error("Clearing local Panchangam data was interrupted."));
    });
  },
};

function addDays(date: string, days: number): string {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}
