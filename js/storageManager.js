/**
 * x.GEN — Storage Manager (IndexedDB)
 * Phase 2: Data Layer
 */

let db = null;
const DB_NAME = 'xgen-db';
const DB_VERSION = 1;

export async function initDB() {
  if (db) return db;
  db = await new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const database = e.target.result;
      if (!database.objectStoreNames.contains('images')) {
        const s = database.createObjectStore('images', { keyPath: 'nonce' });
        s.createIndex('ts', 'ts', { unique: false });
      }
      if (!database.objectStoreNames.contains('dummies')) {
        const s = database.createObjectStore('dummies', { keyPath: 'id' });
        s.createIndex('name', 'name', { unique: false });
        s.createIndex('type', 'type', { unique: false });
      }
      if (!database.objectStoreNames.contains('referencePhotos')) {
        database.createObjectStore('referencePhotos', { keyPath: 'id' });
      }
    };
    req.onsuccess  = (e) => resolve(e.target.result);
    req.onerror    = (e) => reject(e.target.error);
  });
  return db;
}

export const storage = {
  async put(storeName, item) {
    const database = await initDB();
    return new Promise((resolve, reject) => {
      const tx    = database.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req   = store.put(item);
      req.onsuccess = () => resolve(req.result);
      req.onerror   = () => reject(req.error);
    });
  },

  async get(storeName, key) {
    const database = await initDB();
    return new Promise((resolve, reject) => {
      const tx    = database.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req   = store.get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror   = () => reject(req.error);
    });
  },

  async getAll(storeName) {
    const database = await initDB();
    return new Promise((resolve, reject) => {
      const tx    = database.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req   = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror   = () => reject(req.error);
    });
  },

  async delete(storeName, key) {
    const database = await initDB();
    return new Promise((resolve, reject) => {
      const tx    = database.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req   = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror   = () => reject(req.error);
    });
  },

  async count(storeName) {
    const database = await initDB();
    return new Promise((resolve, reject) => {
      const tx    = database.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req   = store.count();
      req.onsuccess = () => resolve(req.result);
      req.onerror   = () => reject(req.error);
    });
  },
};

initDB();
