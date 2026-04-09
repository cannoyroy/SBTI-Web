# SBTI Web

SBTI Web is a Vite + React implementation of an entertainment-style mental-state personality test site for shareable, meme-aware self-observation.

It focuses on:

- data-driven personality expansion
- visualized low-poly character rendering
- 7-point Likert quiz flow
- result matching with Top 3 similar personalities
- share-card image export

## Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- React Router
- html2canvas

## Features

- 36-question quiz with 7-level answer scale
- 6 mental-state dimensions with dual-sided visual bars
- 31 launch personalities
- data-driven personality definitions and visual recipes
- personality atlas page
- personality detail page
- downloadable result card

## Local Development

```bash
pnpm install
pnpm dev
```

Production build:

```bash
pnpm build
```

Preview build output:

```bash
pnpm preview
```

## Project Structure

```text
src/
  components/   UI building blocks and SVG character renderer
  lib/          quiz data, personality data, recipes, matching logic
  pages/        route-level pages
  state/        quiz state context
```

## Personality Expansion

The project is structured so that adding a new personality usually only requires:

1. adding a new personality profile in `src/lib/personalities.ts`
2. adding or reusing a character recipe in `src/lib/recipes.ts`
3. optionally refining question balance if distribution tuning is needed

No result page or routing changes should be required for normal additions.

## Deployment

This project can be deployed directly to Vercel as a standard Vite app.

Recommended Vercel settings:

- Framework Preset: `Vite`
- Install Command: `pnpm install`
- Build Command: `pnpm build`
- Output Directory: `dist`

## Notes

- `reference_materials/` is intentionally ignored by Git.
- This project is for entertainment and product exploration, not psychological diagnosis.


