import { RecipeGallery } from "@/components/recipe-gallery";
import { getRecipes } from "@/data/recipes";

export default function Home() {
  const recipes = getRecipes();

  return (
    <div className="relative min-h-screen bg-canvas">
      {/* <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,120,71,0.08),_transparent_60%)]" /> */}
      <div className="pointer-events-none absolute inset-0" />
      <main className="relative px-4 py-10 sm:px-8 lg:px-12">
        <RecipeGallery recipes={recipes} />
      </main>
    </div>
  );
}
