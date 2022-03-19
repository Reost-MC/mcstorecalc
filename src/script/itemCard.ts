import { addDisposableEventListener } from "@frank-mayer/magic";
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

  valueInputEl.addEventListener("change", () => {
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

  const valueLabelEl = document.createElement("label");
  valueLabelEl.innerText = "Price: ";

  const valueOutputEl = document.createElement("span");
  valueOutputEl.classList.add("value");
  valueOutputEl.innerText = getItemPrice(key).toFixed(2) || "N/A";

  valueLabelEl.appendChild(valueOutputEl);
  el.appendChild(valueLabelEl);

  return el;
};
