# BKC — Bharat Ka Chootiya

Printed tees for everyone in India. Demo storefront: React + Vite + Tailwind + Framer Motion + procedural SVG garments.

**Live (after Pages enable):** https://lilkunal.github.io/Bkc/

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173/Bkc/`).

## Scripts

| Command | What |
|---|---|
| `npm run dev` | Local server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run deploy` | Build + push `dist` to `gh-pages` |

## What’s inside

- **138 designs** · 20 colours · 4 fits (oversized / regular / crop / kids)
- Audiences: men, women, unisex, kids, pride
- Occasions across the Indian calendar including **voting** and **peaceful protest** (non-partisan)
- Shop filters in the URL · mobile filter sheet · sticky PDP ATC · cart in `localStorage`
- Journal, market teardown, lookbook, case study, about
- Idiom product **अल्लाह की गाय** = bhola-bhala / harmless person (glossary on PDP + journal)

## Content policy

No targeting of caste, religion, region or individuals. Civic tees argue for turnout and peaceful assembly — never for a party or outcome.

## Stack

Vite, React 19, TypeScript, Tailwind CSS v4, React Router, Framer Motion. Garments rendered by `src/lib/tee.ts` (shared SVG filter defs).

## Deploy notes

Vite `base` is `/Bkc/` for GitHub Pages project site. `dist/404.html` mirrors `index.html` so client routes work on refresh.
