import { bind } from "@frank-mayer/magic";

export const inputSectionEl = document.getElementById("input") as HTMLElement;
export const outputSectionEl = document.getElementById("output") as HTMLElement;
export const exportButtonEl = document.getElementById(
  "export"
) as HTMLButtonElement;
export const searchInputElement = document.getElementById(
  "search"
) as HTMLInputElement;

export const multiplicators = bind(
  bind(
    {},
    document.getElementById("multiply-sell") as HTMLInputElement,
    "sell"
  ),
  document.getElementById("multiply-buy") as HTMLInputElement,
  "buy"
);

(globalThis as any).multiplicators = multiplicators;
