import type { RecipeTag, TagFilter } from "@/types/recipes";

const tagPalette: Record<RecipeTag, TagFilter> = {
  protein: { id: "protein", label: "Protein", accent: "var(--color-accent)" },
  sweet: { id: "sweet", label: "Sweet", accent: "var(--color-accent-soft)" },
  snack: { id: "snack", label: "Snack", accent: "var(--color-highlight)" },
  sauce: { id: "sauce", label: "Sauce", accent: "var(--color-highlight)" },
  bake: { id: "bake", label: "Bake", accent: "var(--color-accent-muted)" },
  noodles: { id: "noodles", label: "Noodles", accent: "var(--color-accent)" },
  basics: { id: "basics", label: "Basics", accent: "var(--color-muted)" },
  salmon: { id: "salmon", label: "Salmon", accent: "var(--color-success)" },
  chicken: { id: "chicken", label: "Chicken", accent: "var(--color-warning)" },
  waffle: { id: "waffle", label: "Waffle", accent: "var(--color-accent-soft)" },
  granola: { id: "granola", label: "Granola", accent: "var(--color-accent)" },
};

export const tagFilters: TagFilter[] = Object.values(tagPalette);
export const tagDictionary: Record<RecipeTag, TagFilter> = tagPalette;

