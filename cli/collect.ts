/// <reference path="./minecraft.d.ts" />

import { parse } from "https://deno.land/std@0.130.0/flags/mod.ts";
import * as path from "https://deno.land/std@0.130.0/path/mod.ts";
const args = parse(Deno.args);

// Get source location
const location = args.loc ?? "./recipes";
if (!Deno.statSync(location).isDirectory) {
  console.error("Not a directory", location);
  Deno.exit(1);
}

// Get all files in the given directory
const files = Deno.readDirSync(location);

/**
 * Parse a recipe JSON-file
 * @param json JSON string of a recipe
 * @returns Parsed recipe object
 */
const parseRecipe = (json: string): recipe => {
  const recipeObj = JSON.parse(json);
  if (!recipeObj.type) {
    console.error("No type", json);
    Deno.exit(1);
  }

  return recipeObj;
};

/** Array of all given recipes */
const allRecipes = new Array<recipe>();
for await (const file of files) {
  if (!file.isFile || !file.name.endsWith(".json")) {
    continue;
  }

  const filePath = path.join(location, file.name);

  const data = parseRecipe(await Deno.readTextFile(filePath));
  allRecipes.push(data);
}

const allItemIds = new Set<string>();

/**
 * Parse a ingredient and get the containing item IDs
 * @param ingredient Ingredient to parse
 * @returns Parsed ingredient IDs
 */
const getIdFromIngredient = (
  ingredient: ingredient | string
): Array<string> => {
  if (typeof ingredient === "string") {
    return [ingredient];
  } else if ("item" in ingredient) {
    allItemIds.add(ingredient.item);
    return [ingredient.item];
  } else if ("type" in ingredient) {
    allItemIds.add(ingredient.type);
    return [ingredient.type];
  } else if ("tag" in ingredient) {
    allItemIds.add(ingredient.tag);
    return [ingredient.tag];
  } else if (Array.isArray(ingredient)) {
    return ingredient.map((x) => getIdFromIngredient(x)[0]);
  } else {
    throw new Error("Unknown ingredient");
  }
};

const allCosts = new Map<string, Map<string, number>>();

/**
 * Find out the cost of a recipe based on base ingredients
 * @param recipe Recipe to resolve the cost of
 */
const costResolver = (
  recipe: recipe,
  subSteps = new Set<string>(),
  rec = 1
): Map<string, number> => {
  const cost = new Map<string, number>();

  if (!("result" in recipe)) {
    console.error("No result", recipe);
    return cost;
  }

  const resultCount =
    typeof recipe.result === "object" && "count" in recipe.result
      ? recipe.result.count!
      : 1;

  const resultIds = getIdFromIngredient(recipe.result);

  for (const resultId of resultIds) {
    subSteps.add(resultId);
  }

  const resolveSubCost = (id: string, count = 1): void => {
    if (allCosts.has(id)) {
      const subCost = allCosts.get(id)!;
      for (const [subId, subCount] of subCost) {
        const newCount = subCount * count;
        if (cost.has(subId)) {
          cost.set(subId, cost.get(subId)! + newCount);
        } else {
          cost.set(subId, newCount);
        }
      }
      return;
    }

    const subRecipe = allRecipes.find(
      (x) => "result" in x && getIdFromIngredient(x.result).includes(id)
    ) as undefined | (recipe & { result: ingredient | string });

    if (subRecipe && rec < 10) {
      const subRecipeIds = getIdFromIngredient(subRecipe.result);
      for (const subId of subRecipeIds) {
        if (subSteps.has(subId)) {
          console.debug(`Recursion detected: ${id}`);
          if (cost.has(id)) {
            cost.set(id, cost.get(id)! + count);
          } else {
            cost.set(id, count);
          }
          return;
        }
      }

      subSteps.add(id);
      for (const subRecipeKV of costResolver(subRecipe, subSteps, rec + 1)) {
        if (cost.has(subRecipeKV[0])) {
          cost.set(
            subRecipeKV[0],
            cost.get(subRecipeKV[0])! + subRecipeKV[1] * count
          );
        } else {
          cost.set(subRecipeKV[0], subRecipeKV[1] * count);
        }
      }
    } else {
      if (cost.has(id)) {
        cost.set(id, cost.get(id)! + count);
      } else {
        cost.set(id, count);
      }
    }
  };

  switch (recipe.type) {
    case "minecraft:crafting_shaped":
      for (const key in recipe.key) {
        const count = recipe.pattern
          .map((x) => x.split(key).length - 1)
          .reduce((a, b) => a + b);
        const ingredient = recipe.key[key];

        resolveSubCost(getIdFromIngredient(ingredient)[0], count);
      }
      break;

    case "minecraft:crafting_shapeless":
      for (const ingredient of recipe.ingredients) {
        resolveSubCost(getIdFromIngredient(ingredient)[0]);
      }
      break;

    case "minecraft:smelting":
      resolveSubCost(getIdFromIngredient(recipe.ingredient)[0]);
      break;

    default:
      console.error("Unknown recipe type", recipe.type);
  }

  for (const [id, count] of cost) {
    cost.set(id, count / resultCount);
  }

  return cost;
};

// Calculate the cost of all recipes
for (const recipe of allRecipes) {
  if ("result" in recipe) {
    for (const id of getIdFromIngredient(recipe.result)) {
      if (!allCosts.has(id)) {
        allItemIds.add(id);
        const costMap = costResolver(recipe);
        if (costMap.size > 0) {
          allCosts.set(id, costResolver(recipe));
        }
      }
    }
  } else {
    console.debug("Recipe has no result", recipe);
  }
}

// Export the result
const exportJsonCostObj: { [key: string]: { [item: string]: number } } = {};
for (const cost of allCosts) {
  exportJsonCostObj[cost[0]] = Object.fromEntries(cost[1]);
}
Deno.writeTextFileSync(
  "../src/costs.json",
  JSON.stringify(exportJsonCostObj, null, 2)
);
