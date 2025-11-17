import type { StateStorage } from "zustand/middleware";

const memoryStorage = new Map<string, string>();

function getClientStorage() {
  return typeof window !== "undefined" ? window.localStorage : null;
}

export const customStorage: StateStorage = {
  getItem: (name) => {
    const storage = getClientStorage();
    return storage ? storage.getItem(name) : memoryStorage.get(name) ?? null;
  },
  setItem: (name, value) => {
    const storage = getClientStorage();
    if (storage) {
      storage.setItem(name, value);
      return;
    }

    memoryStorage.set(name, value);
  },
  removeItem: (name) => {
    const storage = getClientStorage();
    if (storage) {
      storage.removeItem(name);
      return;
    }

    memoryStorage.delete(name);
  },
};
