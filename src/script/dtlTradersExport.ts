import { capitalize } from "@frank-mayer/magic";
import { stringify } from "yaml";
import type { item, page } from "./dtlTraders";
import { multiplicators } from "./elements";

const createItem = (id: number, key: string, price: number): item => ({
  id,
  type: "tradable",
  item: {
    "==": "org.bukkit.inventory.ItemStack",
    v: Math.random() * 100000000000000000,
    type: key.split(":")[1].toUpperCase(),
  },
  "show-lore": true,
  "show-description": true,
  description: [],
  Discount: {
    "discount-enabled": false,
    "discount-percentage": 0,
    "show-discount-price": false,
    "discount-price": 0,
    "show-discount-start": false,
    "discount-start": "17/03/2022 18:34:40",
    "show-discount-duration": false,
    "discount-duration": 0,
    "show-discount-end": false,
    "discount-end": "17/03/2022 18:34:40",
  },
  "show-price": true,
  "trade-price": Number(price.toFixed(2)),
  "custom-input-enabled": true,
  "stack-sale-enabled": true,
  "show-trade-limit": false,
  "trade-limit": -1,
  "show-limit-time": false,
  "limit-reset-seconds": -1,
  "show-broadcast-message": false,
  "broadcast-message": "",
  "drop-item-on-full-inventory": false,
  "sell-all-when-not-enough-items": false,
  "custom-display-text-enabled": false,
  "custom-display-text": [],
  permission: "",
  "logging-enabled": true,
  "close-after-purchase": false,
});

export const dtlTradersExport = (
  itemPrices: ReadonlyMap<string, number>,
  title = "Schmied Herold"
) => {
  const pages = {} as { [key: `page-${number}`]: page };

  const pageSize = 54;
  let pageCounter = 0;
  let itemCounter = 0;

  for (const [key, price] of itemPrices) {
    const pageTitle = `page-${pageCounter}`;
    const page = (pages[pageTitle] ?? {}) as page;

    page["page-name"] ??= pageTitle;
    page["page-permission"] ??= "";
    page.size ??= pageSize;

    (page["sell-items"] ??= {})["item-" + itemCounter] = createItem(
      itemCounter * (pageCounter + 1),
      key,
      price * Number(multiplicators.sell)
    );
    (page["buy-items"] ??= {})["item-" + itemCounter] = createItem(
      itemCounter * (pageCounter + 1),
      key,
      price * Number(multiplicators.buy)
    );

    pages[pageTitle] = page;

    if (itemCounter >= pageSize) {
      itemCounter = 0;
      pageCounter++;
    } else {
      itemCounter++;
    }
  }

  const data = {
    title: capitalize(title),
    command: "none",
    permission: "none",
    "default-shop": "buy",
    "buy-shop-enabled": true,
    "sell-shop-enabled": true,
    "trade-shop-enabled": true,
    "logging-enabled": true,
    "close-after-purchase": false,
    "confirmation-window-enabled": false,
    pages,
  };
  const output = {} as { [key: string]: object };
  output[title.toLowerCase()] = data;
  return stringify(output);
};
