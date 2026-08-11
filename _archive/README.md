# BKC — Bharat Ka Chootiya

A complete storefront for a fictional Indian printed-tee label. Static HTML/CSS/JS,
no build step, no dependencies, no image assets — **every t-shirt on the site is
generated SVG at runtime.**

Open `index.html` in a browser. That's it.

> For query-string routing (`shop.html?cat=animals`, `product.html?id=…`,
> `post.html?slug=…`) open the files directly in a browser or serve the folder.
> Some embedded preview panes strip `?…` from `file://` URLs.
>
> ```bash
> npx serve "E:/Code claude/New folder/bkc"
> ```

---

## Pages

| File | What it is |
|---|---|
| `index.html` | Home. Hero tee with a live typeface switcher, category rail, fit comparison, audience doors, bestsellers, occasion grid, animals/insects band, new drops, journal teaser |
| `shop.html` | Full catalogue. Cross-filter by fit × category × occasion × wearer × colour, plus live search and sort. Filters persist to the URL |
| `product.html` | PDP. Switch garment colour and silhouette live, size picker per fit, add to bag, specs, related products |
| `collections.html` | Ten curated capsules + all sixteen categories |
| `occasions.html` | The Indian occasion calendar, month by month, with the civic (voting/protest) policy stated up front |
| `blog.html` / `post.html` | The Journal — eight long-form posts with category filtering |
| `market.html` | Market analysis: sizing, competitor teardown, unit economics, print tech, SWOT, strategy, sources |
| `about.html` | Brand story, logo system, palette, type stack, production, full size charts, care, shipping, bulk pricing, contact |

## Source

```
css/tokens.css       design tokens — riso palette, type scale, spacing, motion
css/base.css         reset, typography, layout primitives, reveal animations
css/components.css   header, buttons, ticker/marquee, cards, drawer, footer
css/pages.css        hero, shop, PDP, occasions, blog, market, about layouts
js/data.js           137 products, 16 categories, 24 occasions, 10 collections, 20 colours
js/tee.js            procedural SVG t-shirt renderer (4 silhouettes, 6 backdrops)
js/blog-data.js      8 journal posts
js/app.js            shell injection, cart, animations, hero engine, shop + PDP controllers
```

`app.js` injects the header, footer and cart drawer into every page, so the HTML
files only contain their own content. Page-specific code goes in a
`BKC.initPage = function () { … }` block at the bottom of each page; `app.js`
calls it after the shell is built.

## The t-shirt renderer

`BKC.renderTee({ fit, teeHex, printHex, glyph, lines, font, backdrop })` returns an
SVG string. Four silhouettes share one `0 0 400 470` viewBox so cards stay aligned:

- `oversized` — 240 GSM, dropped shoulder, boxy, widest print area
- `regular` — 180 GSM classic
- `crop` — 200 GSM boxy crop
- `kids` — smaller proportions

Print text auto-shrinks to fit the print area, so long slogans never spill off the
garment. Garment colour drives ink colour automatically via a luminance check.

## Catalogue

137 designs across:

- **Fits** — 64 oversized, 53 regular, crop, kids (10)
- **Audiences** — men, women, unisex, kids (10), pride (10)
- **Subjects** — 18 animal/cow designs, 13 insect designs, plus humour, food, work,
  regional, cricket, travel, music, typography
- **Occasions** — 23 mapped to the Indian calendar: Diwali, Holi, Eid, Onam, Pongal,
  Navratri, Durga Puja, Ganesh Chaturthi, Raksha Bandhan, Janmashtami, Chhath,
  Republic Day, Independence Day, Christmas, New Year, shaadi season, board exams,
  monsoon, cricket season, Valentine's, regional new years — **and polling day and
  peaceful protest**

## Civic content policy

The voting and protest ranges are deliberately non-partisan. No party names, colours
or symbols; no national flag on fabric. Designs argue for the mechanism — turn up,
ask questions, read the constitution, do it peacefully — never for an outcome. This
is stated on `occasions.html` and explained in the journal post
`post.html?slug=protest-tee-without-a-side`.

## Animation

All motion is hand-rolled — no GSAP, no Framer, no CDN.

- `IntersectionObserver` scroll reveals with staggered delays (`data-reveal`, `data-stagger`)
- Per-character headline rise (`data-split`)
- Infinite CSS marquees, auto-duplicated in JS for a seamless loop
- Hero tee float + riso blob drift
- Hero typeface cycles every 2.4s, or on tap
- `rAF`-throttled parallax (`data-parallax="0.15"`)
- Hide-on-scroll-down header, hard-shadow button lifts, card hover tilt
- Live garment recolour and silhouette swap on the PDP
- Animated bar charts on the market report

Everything respects `prefers-reduced-motion: reduce`.

## Cart

`localStorage` under `bkc_cart_v1`, as `[{ key, id, size, variant, qty, addedAt }]`
where `addedAt` is ISO-8601 UTC. Checkout is a stub — this is a demo storefront and
takes no payment.

## Verified

Tested in-browser: all 9 page templates render, header/footer/drawer inject, filters
narrow correctly (137 → 18 on animals), colour and fit switching repaint the tee,
add-to-bag blocks without a size, blog filtering works, post routing resolves by slug.
No console errors. No horizontal overflow at 375px or 1280px; mobile nav opens and closes.

Market figures are third-party analyst estimates compiled August 2026 and are listed
with sources at the bottom of `market.html`. Unit economics are illustrative.
