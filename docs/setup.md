# Project Setup Plan

## 1. Vision & Scope
- Build a visually rich personal recipe gallery optimized for phone + desktop.
- Prioritize delightful UI/UX (dark-first, light-ready) over backend features.
- Support quick browsing via tags, featured spotlight ("Now Cooking"), and recipe detail overlays.

## 2. Tech Stack Decision
| Layer | Choice | Rationale |
| --- | --- | --- |
| Framework | Next.js (App Router) | Mature React ecosystem, first-class image optimization, optional SSR/ISR later, supports static export (`next build && next export`). |
| Styling | Tailwind CSS + custom design tokens | Rapid iteration, consistent spacing/typography, easy theming via CSS variables. |
| Animations | Framer Motion or AutoAnimate | Smooth transitions for filters/modals without heavy setup. |
| Data | Local JSON (recipes + tags) | Simple to edit, can evolve to headless CMS later. |

### Why Next.js over Astro?
- We plan interactive UI (filters, modal detail, future metadata editing). Next keeps a single React mental model and simplifies component state sharing compared to Astro's multi-framework approach.
- Built-in routing, image optimization, and deployment paths on Vercel align with future needs (auth, upload flows) without switching frameworks.
- If we later want server actions (e.g., tagging UI, uploads), staying in Next avoids migration.
- Astro is excellent for mostly-static marketing pages; our dashboard leans into client interactivity, so Next is the safer long-term bet.

### Static vs SSR
- Initial release: full static export. Recipes + metadata will be generated at build time from the local JSON + images folder.
- Future flexibility: enable incremental static regen or server actions when we add editing capabilities; using Next keeps that door open.

## 3. Theming & Tokens
- Define tokens in `src/tokens/design-tokens.ts` (or JSON) and mirror them into CSS variables under `:root` and theme scopes (`.theme-dark`, `.theme-light`).
- Tailwind `theme.extend` consumes the same token file for single source of truth.
- Dark theme default; theme toggle updates `data-theme` attribute for future light palette.

## 4. Data Modeling
- `data/recipes.json`: `{ id, title, image, tags[], featured, rating?, prepTime?, notes? }`.
- Derive tags initially from curated list; allow manual curation ("Now Cooking" uses `featured: true`).
- Keep optional metadata placeholders ready for later editing.

## 5. UI Architecture (App Router)
- `app/layout.tsx`: global providers, fonts, theme vars.
- `app/page.tsx`: fetch recipe list (static) and render sections.
- Components:
  - `HeroNowCooking`
  - `TagFilterRail`
  - `RecipeGrid` + `RecipeCard`
  - `RecipeModal`
  - `ThemeToggle`, `SearchBar`
- Utility hooks: `useTheme`, `useRecipeFilters`.

## 6. Roadmap
1. **Tooling**: Init Next.js (`create-next-app`), add Tailwind, Prettier/ESLint.
2. **Tokens/Theming**: implement shared token file + CSS variable bridge.
3. **Data Layer**: script to scan `/images` and bootstrap `recipes.json` with placeholder metadata.
4. **UI Skeleton**: layout shell, hero, filters, grid, modal (static data).
5. **Interactions**: filtering, search, modal animations, lazy loading images.
6. **Quality**: accessibility pass (keyboard nav, alt text), responsive polish, Lighthouse check.
7. **Deployment**: configure static export for personal hosting + Vercel preview.

## 7. Open Questions
- Naming conventions for tags (English vs German mix?).
- Need for offline support/PWA for phone usage?
- Future metadata editing workflow (local markdown vs admin UI?).
