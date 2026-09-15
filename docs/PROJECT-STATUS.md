# BKC — Project status

**Updated:** 2026-09-15  
**Repo:** https://github.com/lilkunal/Bkc  
**Live:** https://lilkunal.github.io/Bkc/ (the last two passes are not deployed yet)

## What this is

A portfolio e-commerce **template**: products and reviews come from spreadsheets, the home page is a config file, six themes switch live, garment images are photo mockups built in the browser, and store settings live in one file. Demo store, no real payments.

## Waiting on

- Two blank garment photos: `public/mockups/blank-tee.jpg` and `public/mockups/blank-shirt.jpg` (plain white, front view, plain background; see `public/mockups/README.md`). Then run `python scripts/prepare-mockups.py` and tune the print boxes in `public/mockups/mockups.json`. Until then, products show the drawn garments.
- A decision on committing and deploying the 2026-09-11, 09-12 and 09-15 passes (all uncommitted).

## Done this pass (2026-09-15): themes and full store flow

- Six themes in `src/themes.ts` (Midnight Gold, Garnet, Sandstone, Monsoon, Frost, Ember) with live picker, `?theme=` links, CSS token export, pre-paint script in `index.html`
- Generated SVG backgrounds (`src/lib/backgrounds.ts`, `ShapeBackdrop`); 3D scenes take theme colours
- motion-primitives components adapted into `src/components/motion/` (MIT)
- Bag page, coupons, GST-inclusive totals, free-shipping progress; four-step checkout with express, gift wrap and COD fee
- Account page with order history, simulated tracking at `/track/:ref`, predictive search dialog, toasts, recently viewed, "wear it with" bundles, pincode delivery check, share, load more
- 14 Playwright tests passing

## Earlier passes

- **2026-09-12:** three.js hero and 3D ring; reviews sheet; wishlist, quick view, mega menu, price bands, lightbox
- **2026-09-11:** template pass: catalogue in `catalog/products.csv`, shirts, photo mockup system, store settings, policies, demo checkout, per-route SEO pages
- **2026-09-10:** dark-luxury redesign documented in `DESIGN.md`; deep links served with HTTP 200

## Local

```bash
npm run dev
# http://127.0.0.1:5174/Bkc/?theme=sandstone
# http://127.0.0.1:5174/Bkc/cart
# http://127.0.0.1:5174/Bkc/account
```
