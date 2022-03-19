type yamlDateTime =
  `${number}/${number}/${number} ${number}:${number}:${number}`;

export type item = {
  id: number;
  type: "tradable";
  item: {
    "==": string;
    v: number;
    type: string;
  };
  "show-lore": boolean;
  "show-description": boolean;
  description: Array<string>;
  Discount: {
    "discount-enabled": boolean;
    "discount-percentage": number;
    "show-discount-price": boolean;
    "discount-price": number;
    "show-discount-start": boolean;
    "discount-start": yamlDateTime;
    "show-discount-duration": boolean;
    "discount-duration": number;
    "show-discount-end": boolean;
    "discount-end": yamlDateTime;
  };
  "show-price": boolean;
  "trade-price": number;
  "custom-input-enabled": boolean;
  "stack-sale-enabled": boolean;
  "show-trade-limit": boolean;
  "trade-limit": number;
  "show-limit-time": boolean;
  "limit-reset-seconds": number;
  "show-broadcast-message": boolean;
  "broadcast-message": string;
  "drop-item-on-full-inventory": boolean;
  "sell-all-when-not-enough-items": boolean;
  "custom-display-text-enabled": boolean;
  "custom-display-text": Array<string>;
  permission: string;
  "logging-enabled": boolean;
  "close-after-purchase": boolean;
};

export type page = {
  size: 54 | 45;
  "page-name": string;
  "page-permission": string;
  "buy-items": { [key: `item-${number}`]: item };
  "sell-items": { [key: `item-${number}`]: item };
};
