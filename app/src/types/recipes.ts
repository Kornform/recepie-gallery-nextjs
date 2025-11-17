export type RecipeTag =
  | "protein"
  | "sweet"
  | "snack"
  | "sauce"
  | "bake"
  | "noodles"
  | "basics"
  | "salmon"
  | "chicken"
  | "waffle"
  | "granola";

export type TagFilter = {
  id: RecipeTag;
  label: string;
  accent: string;
};

export type RecipeMeta = {
  id: string;
  title: string;
  image: string;
  tags: RecipeTag[];
  featured: boolean;
  prepTime: string;
  moodNote: string;
};

