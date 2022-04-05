import {
  exportButtonEl,
  inputSectionEl,
  outputSectionEl,
  searchInputElement,
} from "./elements";
import { inputItemCard, outputItemCard } from "./itemCard";
import costs from "../costs.json";
import { getItemPrice, getItemPrices } from "./itemPrices";
import { dtlTradersExport } from "./dtlTradersExport";
import { retriggerableDelay } from "@frank-mayer/magic";

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

(globalThis as any).fillOutputSection = () => {
  for (const key of craftableItems) {
    const value = getItemPrice(key);
    if (value === undefined) {
      continue;
    }
    outputSectionEl.appendChild(outputItemCard(key));
  }
};

searchInputElement.addEventListener("input", () => {
  retriggerableDelay(() => {
    const query = searchInputElement.value.replace(/[\s_]/g, "").toLowerCase();
    const queryableItems = document.querySelectorAll("*[data-query]");
    for (const el of queryableItems) {
      if ((el as HTMLElement).dataset.query.includes(query)) {
        el.classList.remove("hidden");
      } else {
        el.classList.add("hidden");
      }
    }
  }, 250);
});

const exportYaml = ((globalThis as any).exportYaml = () => {
  const yaml = dtlTradersExport(getItemPrices());
  console.debug(yaml);
  const outputWindow = window.open("about:blank", "_blank");
  const temp = document.createElement("pre");
  temp.innerText = yaml;
  outputWindow.document.write(temp.outerHTML);
});

exportButtonEl.addEventListener("click", exportYaml);
