import { retriggerableDelay } from "@frank-mayer/magic";
import { openDB } from "idb";
import type { DBSchema } from "idb";
import costs from "../costs.json";

const baseItemPrices = new Map<string, number>();

const itemPrices = new Map<string, number>();

export const getItemPrices = () => itemPrices as ReadonlyMap<string, number>;

const calculateItemPrices = () => {
  itemPrices.clear();
  for (const resultKey in costs) {
    try {
      const ingredients = costs[resultKey as keyof typeof costs];
      let price = 0;
      for (const ingredientKey in ingredients) {
        const baseItemPrice = baseItemPrices.get(ingredientKey);
        if (baseItemPrice === undefined) {
          throw `Missing base item price for ${ingredientKey}`;
        }
        price +=
          baseItemPrice *
          ingredients[ingredientKey as keyof typeof ingredients];
      }
      itemPrices.set(resultKey, price);
    } catch {}
  }
};

const dataChanged = () => {
  retriggerableDelay(() => {
    calculateItemPrices();
  }, 1000);
};

export const setBaseItemPrice = (key: string, price: number | string): void => {
  const value = typeof price === "string" ? Number(price) : price;
  baseItemPrices.set(key, value);
  db.then((_db) => _db.put("baseItemPrices", value, key));
  dataChanged();
};

export const removeBaseItemPrice = (key: string): void => {
  baseItemPrices.delete(key);
  db.then((_db) => _db.delete("baseItemPrices", key));
  dataChanged();
};

export const getItemPrice = (key: string): number | undefined =>
  itemPrices.get(key);

interface PricesDBSchema extends DBSchema {
  baseItemPrices: {
    key: string;
    value: number;
  };
}

const db = openDB<PricesDBSchema>("item-prices", 1, {
  upgrade(db) {
    db.createObjectStore("baseItemPrices");
  },
});

export const getBaseItemPriceFromDB = async (
  key: string
): Promise<number | undefined> => {
  try {
    const _db = await db;
    const value = await _db.get("baseItemPrices", key);
    if (value) {
      setBaseItemPrice(key, value);
      return value;
    } else {
      removeBaseItemPrice(key);
      return undefined;
    }
  } catch {
    removeBaseItemPrice(key);
    return undefined;
  } finally {
    retriggerableDelay(globalThis.fillOutputSection, 1000);
  }
};
