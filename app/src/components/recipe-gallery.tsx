"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Image from "next/image";
import type { RecipeMeta, RecipeTag, TagFilter } from "@/types/recipes";
import { tagFilters } from "@/data/tags";
import { RecipeCard } from "./recipe-card";

type FilterOption = TagFilter | { id: "all"; label: string; accent: string };

const filters: FilterOption[] = [{ id: "all", label: "All recipes", accent: "var(--color-muted)" }, ...tagFilters];

export const RecipeGallery = ({ recipes }: { recipes: RecipeMeta[] }) => {
  const [activeTag, setActiveTag] = useState<RecipeTag | "all">("all");
  const [query, setQuery] = useState("");
  const [activeRecipe, setActiveRecipe] = useState<RecipeMeta | null>(null);

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesTag = activeTag === "all" || recipe.tags.includes(activeTag);
      const matchesQuery = !query || recipe.title.toLowerCase().includes(query.toLowerCase()) || recipe.moodNote.toLowerCase().includes(query.toLowerCase());

      return matchesTag && matchesQuery;
    });
  }, [recipes, activeTag, query]);

  useEffect(() => {
    if (!activeRecipe) {
      document.body.style.overflow = "";
      return;
    }

    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveRecipe(null);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [activeRecipe]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 pb-16">
      <section className="rounded-3xl border border-white/10 bg-card/80 p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end">
          <div className="flex-1 space-y-3">
            <p className="text-sm uppercase tracking-[0.35em] text-text-secondary">Recipe Hub</p>
            <h1 className="max-w-2xl text-3xl font-semibold leading-tight text-text-primary sm:text-4xl">Your curated recipe wall.</h1>
            <p className="text-base text-text-secondary">Browse the cards, tap to open A5 sheets when you need the full view.</p>
          </div>
          <div className="w-full max-w-md">
            <label className="text-sm text-text-secondary">Quick search</label>
            <div className="relative mt-2">
              <input
                type="search"
                placeholder="Search titles or notes..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full rounded-pill border border-white/10 bg-surface/70 px-12 py-3 text-sm text-text-primary placeholder:text-text-secondary/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-text-secondary/80">⌕</span>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveTag(filter.id === "all" ? "all" : filter.id)}
              style={activeTag === filter.id ? ({ "--glow": filter.accent } as CSSProperties) : undefined}
              className={[
                "inline-flex items-center gap-2 rounded-pill border px-4 py-2 text-sm transition",
                activeTag === filter.id
                  ? "border-accent/40 bg-accent/15 text-text-primary shadow-[0_0_30px_var(--glow,_rgba(255,255,255,0))]"
                  : "border-white/10 bg-surface/60 text-text-secondary hover:border-white/30",
              ].join(" ")}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-text-secondary">
          {filteredRecipes.length} recipes · {recipes.length} total
        </p>
        <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 justify-items-center">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} onOpen={setActiveRecipe} />
          ))}
        </div>
      </section>

      {activeRecipe && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setActiveRecipe(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
        >
          <div
            className="flex w-auto flex-col gap-4 rounded-[8px] border border-white/20 bg-surface/95 p-4 shadow-2xl backdrop-blur-xl"
            onClick={(event) => event.stopPropagation()}
            style={{
              maxHeight: "calc(100vh - 2rem)",
              maxWidth: "calc(100vw - 2rem)",
            }}
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between gap-4">
              <h2 id="lightbox-title" className="text-base font-semibold text-text-primary">
                {activeRecipe.title}
              </h2>
              <button
                type="button"
                onClick={() => setActiveRecipe(null)}
                className="shrink-0 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-text-primary transition hover:border-white/40 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-accent/50"
                aria-label="Close lightbox"
              >
                Close
              </button>
            </div>

            {/* Image */}
            <div
              className="relative overflow-hidden rounded-[8px] border border-white/25 bg-canvas"
              style={{
                aspectRatio: "148 / 210",
                height: "min(calc(100vh - 8rem), calc((100vw - 4rem) * 210 / 148))",
                width: "auto",
              }}
            >
              <Image src={activeRecipe.image} alt={activeRecipe.title} fill sizes="95vw" className="object-cover" priority />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
