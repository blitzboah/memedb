import { openDB } from 'idb';

const dbName = 'memeDB';
const storeName = 'memes';

// Initialize the IndexedDB
const initDB = async () => {
  return openDB(dbName, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

export const saveMemeToIndexedDB = async (meme) => {
  const db = await initDB();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  const id = await store.put(meme);
  await tx.done;
  return id;
};

export const getMemeFromIndexedDB = async (id) => {
  const db = await initDB();
  const tx = db.transaction(storeName, 'readonly');
  const store = tx.objectStore(storeName);
  const meme = await store.get(Number(id));
  await tx.done;
  return meme;
};

export const deleteMemeFromIndexedDB = async (id) => {
  const db = await initDB();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  await store.delete(Number(id));
  await tx.done;
};

export const getAllMemesFromIndexedDB = async () => {
  const db = await initDB();
  const tx = db.transaction(storeName, 'readonly');
  const store = tx.objectStore(storeName);
  const memes = await store.getAll();
  await tx.done;
  return memes;
};

export const updateMemeInIndexedDB = async (meme) => {
  const db = await initDB();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  await store.put(meme);
  await tx.done;
};

export const clearAllMemesFromIndexedDB = async () => {
  const db = await initDB();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  await store.clear();
  await tx.done;
};
