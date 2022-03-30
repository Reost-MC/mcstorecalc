import { openDB } from "idb";
import type { DBSchema } from "idb";

interface IgnoreListDBSchema extends DBSchema {
  ignoreItem: {
    key: string;
    value: boolean;
  };
}

const db = openDB<IgnoreListDBSchema>("app-data", 1, {
  upgrade(db) {
    db.createObjectStore("ignoreItem");
  },
});

const ignoreList = new Set<string>();

export const setIgnored = (key: string, value: boolean): void => {
  if (value) {
    ignoreList.add(key);
  } else {
    ignoreList.delete(key);
  }

  db.then((_db) => _db.put("ignoreItem", value, key));
};

export const getIgnored = (key: string): boolean => ignoreList.has(key);

db.then((_db) => {
  _db.getAllKeys("ignoreItem").then((keys) => {
    keys.forEach((key) => {
      _db.get("ignoreItem", key).then((value) => {
        if (value) {
          ignoreList.add(key);
        } else {
          ignoreList.delete(key);
        }
      });
    });
  });
});
