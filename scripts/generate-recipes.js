const fs = require('fs');
const path = require('path');

const recipesDir = path.join(__dirname, '..', 'public', 'recipes');
const outputFile = path.join(__dirname, '..', 'src', 'data', 'recipes.json');

const featuredImages = new Set([
  "rezept-bang-bang-chicken-13x18cm.png",
  "rezept-kung-pao-chicken-13x18cm.png",
  "rezept-dijon-dill-panko-salmon-13x18cm.png",
  "rezept-american-pancake-13x18cm.png",
]);

const keywordTagMap = [
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

const prettifyTitle = (fileName) =>
  fileName
    .replace(/^rezept[-_]?/i, "")
    .replace(/-13x18cm|\.png|\.jpg|\.jpeg/gi, "")
    .replace(/[-_.]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const deriveTags = (fileName) => {
  const base = new Set();
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

// Generate recipes data
if (!fs.existsSync(recipesDir)) {
  console.error(`Error: Recipes directory not found at ${recipesDir}`);
  process.exit(1);
}

const recipes = fs
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
    };
  })
  .sort((a, b) => a.title.localeCompare(b.title));

// Ensure output directory exists
const outputDir = path.dirname(outputFile);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write to JSON file
fs.writeFileSync(outputFile, JSON.stringify(recipes, null, 2));

console.log(`✅ Generated ${recipes.length} recipes → ${outputFile}`);
