import { addDisposableEventListener } from "@frank-mayer/magic";
import { multiplicators } from "./elements";
import { getIgnored, setIgnored } from "./ignoreList";
import {
  getBaseItemPriceFromDB,
  getItemPrice,
  removeBaseItemPrice,
  setBaseItemPrice,
} from "./itemPrices";

const itemCard = (id: string) => {
  const el = document.createElement("div");
  el.classList.add("item-card");
  el.dataset.key = id;

  const titleEl = document.createElement("span");
  titleEl.classList.add("title");
  titleEl.textContent = id;
  el.appendChild(titleEl);

  return el;
};

export const inputItemCard = (key: string) => {
  const el = itemCard(key);
  el.classList.add("input");
  el.dataset.query = key.replace(/[\s_]/g, "").toLowerCase();

  const valueLabelEl = document.createElement("label");
  valueLabelEl.innerText = "Price: ";

  const valueInputEl = document.createElement("input");
  valueInputEl.classList.add("value");
  valueInputEl.type = "number";
  valueInputEl.min = "0";
  valueInputEl.step = "0.01";
  valueInputEl.placeholder = "N/A";
  getBaseItemPriceFromDB(key).then((value) => {
    if (value !== undefined) {
      valueInputEl.value = value.toFixed(2);
    }
  });

  addDisposableEventListener(valueInputEl, "change", () => {
    const value = Number(valueInputEl.value);
    if (isNaN(value) || value < 0 || valueInputEl.value.trim() === "") {
      valueInputEl.value = "";
      removeBaseItemPrice(key);
      return;
    }
    const rounded = value.toFixed(2);
    if (rounded !== valueInputEl.value) {
      setBaseItemPrice(key, (valueInputEl.value = rounded));
      return;
    }

    setBaseItemPrice(key, value);
  });

  valueLabelEl.appendChild(valueInputEl);
  el.appendChild(valueLabelEl);

  return el;
};

export const outputItemCard = (key: string) => {
  const el = itemCard(key);
  el.classList.add("output");

  const enabledLabelEl = document.createElement("label");
  enabledLabelEl.innerText = "Generate output";
  const enabledEl = document.createElement("input");
  enabledEl.type = "checkbox";
  enabledEl.checked = !getIgnored(key);
  addDisposableEventListener(enabledEl, "change", () => {
    setIgnored(key, !enabledEl.checked);
  });
  enabledLabelEl.appendChild(enabledEl);
  el.appendChild(enabledLabelEl);

  const valueLabelEl = document.createElement("label");
  valueLabelEl.innerText = "Price: ";

  const valueOutputEl = document.createElement("span");
  valueOutputEl.classList.add("value");
  valueOutputEl.innerText = getItemPrice(key).toFixed(2) || "N/A";

  const valueOutputSellEl = document.createElement("span");
  valueOutputSellEl.classList.add("value");
  valueOutputSellEl.classList.add("sell");
  valueOutputSellEl.innerText =
    (getItemPrice(key) * Number(multiplicators.sell)).toFixed(2) || "N/A";

  const valueOutputBuyEl = document.createElement("span");
  valueOutputBuyEl.classList.add("value");
  valueOutputBuyEl.classList.add("buy");
  valueOutputBuyEl.innerText =
    (getItemPrice(key) * Number(multiplicators.buy)).toFixed(2) || "N/A";

  valueLabelEl.appendChild(valueOutputEl);
  valueLabelEl.appendChild(valueOutputSellEl);
  valueLabelEl.appendChild(valueOutputBuyEl);
  el.appendChild(valueLabelEl);

  return el;
};
