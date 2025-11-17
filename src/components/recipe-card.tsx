import type { KeyboardEvent } from "react";
import Image from "next/image";
import type { RecipeMeta, RecipeTag } from "@/types/recipes";
import { tagDictionary } from "@/data/tags";

const tagLabel = (tag: RecipeTag) => tagDictionary[tag].label;

type Props = {
  recipe: RecipeMeta;
  onOpen?: (recipe: RecipeMeta) => void;
};

export const RecipeCard = ({ recipe, onOpen }: Props) => {
  const handleClick = () => onOpen?.(recipe);

  const handleKey = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen?.(recipe);
    }
  };

  return (
    <article
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onClick={handleClick}
      onKeyDown={handleKey}
      className="group relative flex w-full max-w-[220px] flex-col overflow-hidden rounded-[12px] border border-white/10 bg-card/70 transition duration-200 hover:bg-cardAlt/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <div className="relative w-full overflow-hidden border-b border-white/5 bg-surface/40 p-2">
        <div className="relative aspect-[148/210] w-full overflow-hidden rounded-[8px] bg-surface/80">
          <Image src={recipe.image} alt={recipe.title} fill sizes="220px" className="object-cover" />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 px-3 pb-3 pt-3">
        <h3 className="truncate text-sm font-semibold text-text-primary">{recipe.title}</h3>
        <div className="flex flex-wrap gap-1">
          {recipe.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="inline-flex items-center rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-text-secondary">
              {tagLabel(tag)}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
};
