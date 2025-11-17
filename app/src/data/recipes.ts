import fs from "node:fs";
import path from "node:path";
import type { RecipeMeta, RecipeTag } from "@/types/recipes";

const featuredImages = new Set([
  "rezept-bang-bang-chicken-13x18cm.png",
  "rezept-kung-pao-chicken-13x18cm.png",
  "rezept-dijon-dill-panko-salmon-13x18cm.png",
  "rezept-american-pancake-13x18cm.png",
]);

const keywordTagMap: [string, RecipeTag][] = [
  ["chicken", "chicken"],
  ["salmon", "salmon"],
  ["noodle", "noodles"],
  ["sauce", "sauce"],
  ["waffel", "waffle"],
  ["waffle", "waffle"],
  ["granola", "granola"],
  ["flapjack", "sweet"],
  ["cookie", "sweet"],
  ["porridge", "sweet"],
  ["bar", "snack"],
  ["steak", "protein"],
  ["burger", "protein"],
  ["shawarma", "protein"],
  ["soup", "basics"],
  ["marinad", "sauce"],
];

const prettifyTitle = (fileName: string) =>
  fileName
    .replace(/^rezept[-_]?/i, "")
    .replace(/-13x18cm|\.png|\.jpg|\.jpeg/gi, "")
    .replace(/[-_.]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const deriveTags = (fileName: string): RecipeTag[] => {
  const base = new Set<RecipeTag>();
  const normalized = fileName.toLowerCase();

  keywordTagMap.forEach(([keyword, tag]) => {
    if (normalized.includes(keyword)) {
      base.add(tag);
    }
  });

  if (normalized.includes("chicken") || normalized.includes("huhn")) {
    base.add("chicken");
  }

  if (normalized.includes("lachs") || normalized.includes("salmon")) {
    base.add("salmon");
  }

  if (!base.size) {
    base.add("basics");
  }

  return Array.from(base);
};

const recipesDir = path.join(process.cwd(), "public", "recipes");

export const getRecipes = (): RecipeMeta[] => {
  if (!fs.existsSync(recipesDir)) {
    return [];
  }

  return fs
    .readdirSync(recipesDir)
    .filter((file) => file.endsWith(".png") || file.endsWith(".jpg"))
    .map((file) => {
      const title = prettifyTitle(file);
      return {
        id: title.toLowerCase().replace(/\s+/g, "-"),
        title,
        image: `/recipes/${file}`,
        tags: deriveTags(file),
        featured: featuredImages.has(file),
        prepTime: "~15 min",
        moodNote: "Add your personal notes here soon.",
      } satisfies RecipeMeta;
    })
    .sort((a, b) => a.title.localeCompare(b.title));
};

