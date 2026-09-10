# BKC — Project status

**Updated:** 2026-09-10  
**Repo:** https://github.com/lilkunal/Bkc  
**Live:** https://lilkunal.github.io/Bkc/

## Differentiator

**Shop by where you speak** — state → region → day-to-day slang atlas in one cart. Soft-censor brand: Ch**tiya / चूtiya.

## Done this pass (2026-09-10): dark-luxury redesign

- Whole site restyled to the "Grammer" black + gold reference; system documented in `DESIGN.md` (WCAG AA contrast measured)
- Home hero: real-time 3D tee (three.js) with live print-face switching; flat SVG fallback
- Nav trimmed to Shop · States · Collections · Journal · About; full mobile menu; club signup + 5-column footer
- Fixes: no `alert()` pop-ups, scroll-to-top on navigation, one h1 per page, hero photo 2.2 MB PNG → 73 KB WebP, unused images removed
- `test:shop` updated for the new hero copy

## Previous pass (2026-08-11)

- States atlas page + shop filters (state/region)
- Uttarakhand Kumaon + Garhwal day-to-day prints + pan-India vernacular SKUs
- Soft-censor hero + Hinglish logo (चू + tiya)
- Chooser blogs: how to choose, soft-censor, slang atlas, oversized vs regular

## Local

```bash
npm run dev
# http://127.0.0.1:5174/Bkc/states
# http://127.0.0.1:5174/Bkc/shop?state=uttarakhand&region=kumaon
```
