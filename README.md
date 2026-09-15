# BKC — Bharat Ka Ch**tiya

A complete e-commerce template for printed apparel: six switchable themes, spreadsheet-driven catalogue and reviews, a full bag-to-order flow, and a 3D home page. Built as a portfolio piece: the demo store takes no payments.

**Live demo:** https://lilkunal.github.io/Bkc/ · try any theme with `?theme=garnet`, `sandstone`, `monsoon`, `frost` or `ember`

## Use it as a template

Swapping in another store is a matter of files, not code:

| What | Where | Guide |
|---|---|---|
| Products | `catalog/products.csv` | [catalog/README.md](catalog/README.md): every column, with examples |
| Reviews | `catalog/reviews.csv` | [catalog/README.md](catalog/README.md#reviews-sheet): per product, per category or store-wide |
| Theme | `src/store.config.ts` → `theme` | Six themes in `src/themes.ts`; add your own palette and fonts there |
| Home page sections | `src/content/home.ts` | Switch sections on or off, reorder them, edit their copy |
| Shipping, coupons, GST, fees | `src/store.config.ts` | Free-shipping threshold, express and gift-wrap fees, coupon codes, tax slabs |
| Garment photos | `public/mockups/blank-tee.jpg`, `blank-shirt.jpg` | [public/mockups/README.md](public/mockups/README.md) |
| Look and feel rules | [DESIGN.md](DESIGN.md) | Colours, type, spacing, motion, components |
| Link-preview image | `public/og-image.png` | `python scripts/make-share-image.py --title … --tagline …` |

A typical swap:

```bash
npm run check:products -- path/to/new-sheet.csv   # problems listed by row number
cp path/to/new-sheet.csv catalog/products.csv
python scripts/prepare-mockups.py                  # only when the blank garment photos change
npm run dev                                        # look
npm run deploy                                     # publish
```

## Run locally

```bash
npm install
npm run dev
```

Opens at `http://127.0.0.1:5174/Bkc/`.

## Scripts

| Command | What |
|---|---|
| `npm run dev` | Local server |
| `npm run check:products` | Validate the product and review sheets (runs automatically before every build) |
| `npm run build` | Production build to `dist/` |
| `npm run test:shop` | Playwright tests: sheets, shop, themes, search, coupons, reviews, full checkout |
| `npm run lint` | oxlint |
| `npm run deploy` | Build, write a page per route (titles, link previews, product structured data, sitemap) and push `dist` to `gh-pages` |

## What’s inside

**Shopping**
- 194 products from the sheet (186 T-shirts, 8 shirts) · 20 colours · 7 fits · 31 sample reviews
- Predictive search (press `/`): products with thumbnails and prices, categories, recent and popular searches, full keyboard support
- Shop with URL filters (garment, price band, fit, category, occasion, wearer, state, colour), sorts, and "load more"
- Desktop mega menu; product cards with hover colourway, wishlist heart, quick view and a cursor spotlight
- Product page: fit, colour, size, quantity; full-screen zoom; share; pincode delivery check; "wear it with" bundle; size guide, care, delivery and returns; searchable reviews; recently viewed

**Buying**
- Bag page and drawer with free-shipping progress, coupon codes (`BKC10`, `FIRST150`, `FREESHIP` in the demo), GST included in prices, "move to wishlist" and "complete the look"
- Four-step checkout (contact, delivery, payment, review) with express delivery, gift wrap, cash-on-delivery fee and saved details
- Order confirmation, order history on an account page, and simulated order tracking
- Wishlist, bag, orders and theme all kept in the browser; no account or backend needed

**Look and motion**
- Six themes (Midnight Gold, Garnet, Sandstone, Monsoon, Frost, Ember), each with its own palette, fonts, corners and hero backdrop, switchable live from a floating picker; tokens copy out as CSS
- three.js on the home page: satin-and-dust hero backdrop and a drag-to-spin 3D collection ring, both in theme colours
- Generated SVG backgrounds (dunes, peaks, blobs, embers) behind heroes, collection cards and bands
- Motion components: word-by-word title reveals, magnetic buttons, rolling counters, animated totals, border trails, sliding tabs and step transitions
- Home page built from a config file: hero, collection cards, 3D ring, tabbed products, quote, slang atlas, review carousel, product strip, journal, trust bar

**Quality**
- WCAG AA contrast in every theme, one `h1` per page, focus-trapped dialogs, Pause controls on everything that moves on its own, reduced-motion support throughout
- Real 404 page; every route served as its own HTML file so direct links work on GitHub Pages

## Built with ideas and code from

- [ibelick/motion-primitives](https://github.com/ibelick/motion-primitives) (MIT): motion components in `src/components/motion/`, adapted; licence and changes in [its README](src/components/motion/README.md)
- [scrolltide.co](https://www.scrolltide.co/): the six theme moods were chosen from its public template previews (Rann Mahal, Obsidia, Dune, Verdant, Glacier, Cinder). Its templates are paid and none of their prompts or code are used; palettes, fonts and code here are original
- [juxtopposed/realtimecolors](https://github.com/juxtopposed/realtimecolors) (CC BY-NC-ND): the idea of previewing a palette live on a real site and exporting tokens. No code used
- [codeawy/haikei](https://github.com/codeawy/haikei): the idea of generated SVG backgrounds. No code used
- [gethugothemes/influencer-hugo](https://github.com/gethugothemes/influencer-hugo) (MIT): home sections switched on and off from one data file, pull quote, testimonial slider
- [Govind783/react-e-commerce-](https://github.com/Govind783/react-e-commerce-) and [vivekkakadiya/Organica](https://github.com/vivekkakadiya/Organica): mega menu, hover image swap, price bands, review search, product marquee, wishlist, quick view (ideas only; no licence)

## Content policy

No targeting of caste, religion, region or individuals. Civic tees argue for turnout and peaceful assembly, never for a party or outcome.

## Stack

Vite 8, React 19, TypeScript, Tailwind CSS v4, React Router 7, Framer Motion, three.js (lazy-loaded). Photo mockups are built with canvas in `src/lib/mockup.ts`; 3D scenes live in `src/three/`; themes in `src/themes.ts` and `src/styles/theme.css`.

## Deploy notes

Vite `base` is `/Bkc/` for this GitHub Pages project site. For another repo, change `base` in `vite.config.ts` and `siteUrl` in `src/store.config.ts`. GitHub Pages is fine for a demo, but its terms don't allow running a real online shop on it; a live store needs other hosting, a payment gateway and real order handling.
