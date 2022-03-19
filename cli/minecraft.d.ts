type namespacedKey = `minecraft:${string}`;

type baseIngredient =
  | {
      type: namespacedKey;
      count?: number;
    }
  | {
      item: namespacedKey;
      count?: number;
    }
  | {
      tag: namespacedKey;
      count?: number;
    };

type ingredient = baseIngredient | Array<baseIngredient>;

type shapedRecipe = {
  type: "minecraft:crafting_shaped";
  group?: string;
  pattern: [string, string, string];
  key: {
    [key: string]: ingredient;
  };
  result: ingredient;
};

type shapelessRecipe = {
  type: "minecraft:crafting_shapeless";
  group?: string;
  ingredients: Array<ingredient>;
  result: ingredient;
};

type smeltingRecipe = {
  type: "minecraft:smelting";
  ingredient: ingredient;
  result: namespacedKey;
  experience: number;
  cookingtime: number;
};

type stonecuttingRecipe = {
  type: "minecraft:stonecutting";
  ingredient: ingredient;
  result: namespacedKey;
  count: number;
};

type campfireCookingRecipe = {
  type: "minecraft:campfire_cooking";
  ingredient: ingredient;
  result: namespacedKey;
  cookingtime: number;
};

type smokingRecipe = {
  type: "minecraft:smoking";
  ingredient: ingredient;
  result: namespacedKey;
  experience: number;
  cookingtime: number;
};

type blastingRecipe = {
  type: "minecraft:blasting";
  group?: string;
  ingredient: ingredient;
  result: namespacedKey;
  experience: number;
  cookingtime: number;
};

type smithingRecipe = {
  type: "minecraft:smithing";
  base: ingredient;
  addition: ingredient;
  result: ingredient;
};

type specialRecipe = {
  type:
    | "minecraft:crafting_special_bannerduplicate"
    | "minecraft:crafting_special_bookcloning"
    | "minecraft:crafting_special_fireworkrocket"
    | "minecraft:crafting_special_firework_star"
    | "minecraft:crafting_special_firework_star_fade"
    | "minecraft:crafting_special_mapcloning"
    | "minecraft:crafting_special_mapextending"
    | "minecraft:crafting_special_repairitem"
    | "minecraft:crafting_special_shielddecoration"
    | "minecraft:crafting_special_shulkerboxcoloring"
    | "minecraft:crafting_special_suspiciousstew"
    | "minecraft:crafting_special_tippedarrow";
};

type recipe =
  | shapedRecipe
  | shapelessRecipe
  | smeltingRecipe
  | stonecuttingRecipe
  | campfireCookingRecipe
  | smokingRecipe
  | blastingRecipe
  | smithingRecipe
  | specialRecipe;
