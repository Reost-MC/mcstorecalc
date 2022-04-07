import { bind } from "@frank-mayer/magic";

export const inputSectionEl = document.getElementById("input") as HTMLElement;
export const outputSectionEl = document.getElementById("output") as HTMLElement;
export const exportButtonEl = document.getElementById(
  "export"
) as HTMLButtonElement;
export const searchInputElement = document.getElementById(
  "search"
) as HTMLInputElement;

export const multiplySellInputEl = document.getElementById(
  "multiply-sell"
) as HTMLInputElement;
export const multiplyBuyInputEl = document.getElementById(
  "multiply-buy"
) as HTMLInputElement;

export const multiplicators = bind(
  bind({}, multiplySellInputEl, "sell"),
  multiplyBuyInputEl,
  "buy"
);

(globalThis as any).multiplicators = multiplicators;
