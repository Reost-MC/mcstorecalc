import {
  inputSectionEl,
  outputSectionEl,
  updateOutputButtonEl,
} from "./elements";
import { inputItemCard, outputItemCard } from "./itemCard";
import costs from "../costs.json";
import { getItemPrice } from "./itemPrices";

const baseItems = new Set<string>();

for (const key in costs) {
  const cost = costs[key as keyof typeof costs];
  for (const key in cost) {
    baseItems.add(key);
  }
}

for (const key of baseItems) {
  inputSectionEl.appendChild(inputItemCard(key));
}

const craftableItems = new Set<string>(
  Object.keys(costs).filter((key) => !baseItems.has(key))
);

const fillOutputSection = () => {
  for (const key of craftableItems) {
    const value = getItemPrice(key);
    if (value === undefined) {
      continue;
    }
    outputSectionEl.appendChild(outputItemCard(key));
  }
};

(globalThis as any).fillOutputSection = fillOutputSection;

updateOutputButtonEl.addEventListener("click", fillOutputSection);
