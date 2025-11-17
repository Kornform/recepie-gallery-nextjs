import type { RecipeMeta } from "@/types/recipes";
import recipesData from "./recipes.json";

export const getRecipes = (): RecipeMeta[] => {
  return recipesData as RecipeMeta[];
};

