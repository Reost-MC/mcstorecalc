import { exportButtonEl, inputSectionEl, outputSectionEl } from "./elements";
import { inputItemCard, outputItemCard } from "./itemCard";
import costs from "../costs.json";
import { getItemPrice, getItemPrices } from "./itemPrices";
import { dtlTradersExport } from "./dtlTradersExport";

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

const fillOutputSection = ((globalThis as any).fillOutputSection = () => {
  for (const key of craftableItems) {
    const value = getItemPrice(key);
    if (value === undefined) {
      continue;
    }
    outputSectionEl.appendChild(outputItemCard(key));
  }
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
