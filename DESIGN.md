# Design System — BKC (Bharat Ka Ch**tiya)

## Product Context
- **What this is:** A direct-to-consumer printed-tee label whose product is Indian day-to-day language: soft-censored humour (Ch**tiya / चूtiya) and a state → region → slang atlas in one cart. Demo storefront; payments are not live.
- **Who it's for:** Young urban Indians, roughly 18–35, who talk in Hinglish and regional slang.
- **Space/industry:** Indian D2C graphic apparel. Peers: Bewakoof, The Souled Store, Beyoung.
- **Project type:** E-commerce storefront (marketing home + shop app). React 19, Vite 8, Tailwind CSS 4, 12 routes, deployed to GitHub Pages.

## The One Thing To Remember
**Luxury, but the joke lands.** A fashion house that happens to print gaalis. Every decision below serves that contrast: the interface stays quiet and expensive so the loud print is always the funniest, loudest thing on screen.

## Aesthetic Direction
- **Direction:** Luxury / Refined, dark. Modelled on the "Grammer" black-and-gold storefront reference supplied by the founder.
- **Decoration level:** Intentional. Faint film grain over warm black, 1px hairlines, a चू monogram seal. No gradient blobs, no rounded bubbles, no emoji in the interface.
- **Mood:** Couture-house calm around cheeky Hinglish. Engraved serif capitals, gold used sparingly, lots of black.

## Typography
| Role | Face | Setting |
|---|---|---|
| Display / hero | Cormorant Garamond 500 | Uppercase, +0.02em, line-height 1.02, `clamp(2.6rem, 1.4rem + 4.4vw, 5rem)` |
| Section headings | Cormorant Garamond 600 | Uppercase, +0.05em, `clamp(1.75rem, 1.15rem + 2vw, 2.75rem)` |
| Devanagari lockup | Rozha One 400 | Only for चू in the lockup and seal |
| Body | Jost 400 | 16px / 1.65 |
| UI labels, nav, buttons | Jost 500 | Uppercase, +0.16em to +0.24em, 11–13px |
| Prices | Jost 500 | `font-variant-numeric: tabular-nums` |
| **Print faces (garments only)** | Anton, Bebas Neue, Rozha One, Permanent Marker, Playfair Display, Space Mono, Space Grotesk | Rendered inside tee SVGs. **Never used in the interface.** |

- **Loading:** one Google Fonts `css2` link in `index.html` with `display=swap`. Every stack has a system fallback.
- **Scale (rem):** 0.5625 tagline · 0.6875 micro · 0.75 eyebrow · 0.8125 label · 0.9375 card name · 1 body · 1.25 lede · 1.75 card title · 2.75 section · 5 display.

## Color
- **Approach:** Restrained. One accent (gold) on warm neutrals. Colour is rare, so gold always means "act here" or "this matters".
- Tokens live in `src/index.css` under `@theme` and generate Tailwind utilities (`bg-night`, `text-gold`, `border-line`…).

| Token | Hex | Use |
|---|---|---|
| `night` | `#0B0A08` | Page background |
| `surface` | `#14120F` | Bands, drawer, sheets |
| `tile` | `#1D1A15` | Product studio tiles |
| `line` | `#3A3227` | Decorative hairlines only |
| `control` | `#7A7263` | Input and control borders |
| `bone` | `#F2ECE0` | Primary text |
| `muted` | `#A89F8E` | Secondary text, placeholders |
| `faint` | `#7A7263` | Decorative separators, disabled labels, large text only |
| `gold` | `#C9A24A` | Accent, primary buttons, gold text |
| `gold-hi` | `#E0BE72` | Button hover |
| `gold-deep` | `#9C7A2E` | Button pressed |
| `success` / `warning` / `error` / `info` | `#74B38E` / `#D9A441` / `#E0675C` / `#8FA8C8` | Status text |

**Measured WCAG contrast (2026-09-10):**

| Pair | Ratio | Needs |
|---|---|---|
| bone on night | 16.82:1 | 4.5 |
| bone on tile | 14.74:1 | 4.5 |
| muted on night | 7.55:1 | 4.5 |
| muted on surface | 7.14:1 | 4.5 |
| gold on night | 8.25:1 | 4.5 |
| gold on surface | 7.79:1 | 4.5 |
| night on gold (primary button) | 8.25:1 | 4.5 |
| night on gold-hi (hover) | 11.10:1 | 4.5 |
| night on gold-deep (pressed) | 4.94:1 | 4.5 |
| control on night (input borders) | 4.16:1 | 3 |
| success / warning / error / info on night | 8.09 / 8.80 / 5.90 / 8.11 | 4.5 |
| line on night | 1.57:1 | decorative, exempt |

Rules: never set small text in `faint` or `line`. Placeholders use `muted`.

- **Light mode:** the site ships dark only. A "Bone" alternate (bg `#F2ECE0`, text `#0B0A08`, gold-as-text `#7A5C1E`) passed the same checks in the preview and is reserved for print and lookbook use.

## Spacing
- **Base unit:** 8px (4px for fine adjustments).
- **Density:** Spacious on marketing sections (`py-16` to `py-24`), comfortable on the shop grid (`gap-x-4 gap-y-8`).
- **Scale:** 2xs 2 · xs 4 · sm 8 · md 16 · lg 24 · xl 32 · 2xl 48 · 3xl 64 · 4xl 96.

## Layout
- **Approach:** Hybrid. Grammer's strict grid for commerce (announcement bar, centred wordmark, category tiles, 4-across product rows, trust bar, club band, 5-column footer). Editorial moments only for the home hero and the slang atlas.
- **Container:** `.shell`, max-width 1440px, inline padding `clamp(1rem, 0.5rem + 2.5vw, 3rem)`.
- **Grid:** 2 columns on mobile, 3–4 at `lg`/`xl`. Variable-count grids use outer `border-l border-t` plus per-cell `border-b border-r`, so odd counts never leave coloured holes.
- **Border radius:** 0 everywhere. The only round shapes are the seal and the bag count dot.
- **Hit targets:** 44px minimum; 48px for primary buttons and size selectors.

## Motion
- **Approach:** Intentional and slow.
- **Easing:** `--ease-lux: cubic-bezier(0.2, 0.7, 0.2, 1)` (utility `ease-lux`).
- **Durations:** micro 150–250ms (colour), medium 350–500ms (underline draw, fades), long 600–700ms (image zoom).
- **Patterns:** cards fade up once on scroll · product tees zoom to 1.03× on hover and cross-fade to their second colourway · links draw a 1px underline · the hero garment floats, tilts towards the mouse and cycles print faces every 3.5s with a Pause control.
- **3D (three.js, `src/three/`):** a separate chunk loaded on Home only. *Hero backdrop:* dark satin with tight gold glints and drifting dust, rippling under the mouse; it sits right of the headline, behind `.hero-scrim`, so copy keeps its contrast. *Collection ring:* ten curved product cards on a cylinder with a faint floor reflection; drag or swipe to spin, it snaps card by card, advances every ~4s, and draws a thin gold frame on the front card. Both pause off screen and in background tabs, cap pixel ratio at 1.75, and fall back without WebGL (CSS glow; a normal product row).
- **Things that move on their own** (print faces, ring, review carousel, product strip) pause on hover or focus and always have a visible Pause control.
- **Reduced motion:** all transitions collapse to ~0, the font rotation stops, the hero silk renders one still frame, the ring jumps instead of spinning and never advances by itself, and the product strip becomes a plain horizontal scroller.

## Signature Rules (the three risks)
1. **The seal.** चू inside a double gold ring replaces the Grammer crown. Header, footer, favicon, About only. Never smaller than 32px; 46px in the header.
2. **The ornament.** The `**` from Ch**tiya is the brand ornament, capped at three placements: the wordmark tagline, the section divider on Home, and the atlas list bullets. Nowhere else.
3. **The gallery.** Tees are rendered SVGs on dark `tile` studio backgrounds with a soft spotlight (`.spot`). Loud print faces live only on garments.

## Components
- **Buttons:** `.btn-primary` (gold fill, night text), `.btn-secondary` (gold outline), `.btn-ghost`. Disabled = transparent, `line` border, `faint` label.
- **Inputs:** `.input` / `.select`, 48px, 1px `control` border, gold on focus, `error` border when invalid. Labels use `.field-label`.
- **Selectors:** `.chip-btn` (fit, print face), `.size-btn` (gold fill when pressed), `.swatch` (44px, gold outline when pressed). All expose `aria-pressed`.
- **Feedback:** no `alert()`. Inline `role="status"` messages in `success` / `error`.
- **Headings:** every page has exactly one `h1` (`SectionHead level={1}` or an explicit `h1`).
- **Dialogs:** quick view and the image lightbox render through a portal and use `useDialog` (focus moves in, Tab stays inside, Escape closes, page scroll locks, focus returns to the trigger).
- **Card actions:** `.card-action`, 40px squares on the tile's top-right: the wishlist heart (always) and quick view (on hover or focus, 640px and up). The badge keeps the top-left.
- **Carousels:** scroll-snap tracks with square prev/next `icon-btn`s; the collection ring uses the same arrows under its caption.
- **Mega menu:** desktop only, hangs full-width from the header; opens on hover (120ms intent delay) or the chevron button, closes on Escape, outside click, scroll or route change.

## Content Honesty
- Reviews come from `catalog/reviews.csv`. In the demo they are sample content and say so (the Home carousel eyebrow and a note under the product rating summary). A live store must replace them with real reviews or leave the sheet empty. Product ratings are catalogue demo data.
- Payment methods are labelled "at launch"; checkout says nothing is charged.
- The lookbook photo is disclosed as a generated still.

## Imagery
- **Garment images:** `src/components/GarmentImage.tsx` shows the product photo from the sheet when there is one; otherwise it builds a photo mockup in the browser (`src/lib/mockup.ts`) by recolouring a blank garment photo and printing the design onto it, following the folds. Blank photos go in `public/mockups/blank-<type>.jpg`; `python scripts/prepare-mockups.py` turns them into maps. Garment types without a map fall back to the drawn tee.
- **Home hero:** the featured product as a photo mockup that tilts a few degrees towards the mouse (mouse only) and floats gently; every print face is pre-built so the rotation swaps instantly. Motion stops for reduced-motion users.
- **Lookbook photo:** `public/media/hero-kunal.webp` (1024×1536), crop anchor 42%. The model photo is not used in the home hero.
- **3D ring cards:** `src/three/garmentCard.ts` paints each product onto a `.spot`-style canvas card in the same order of preference (photo, photo mockup, drawn garment with its print).
- Product imagery: `src/lib/tee.ts` procedural SVG garments.

## Decisions Log
| Date | Decision | Rationale |
|---|---|---|
| 2026-09-10 | Initial design system created | /design-consultation. Founder picked the dark-luxury Grammer reference, "Luxury, but the joke lands", real store in the making, existing imagery only |
| 2026-09-10 | Cormorant Garamond + Jost + Rozha One | Engraved luxury capitals, Futura-lineage fashion sans, high-contrast Devanagari for चू |
| 2026-09-10 | Single gold accent `#C9A24A` on `#0B0A08` | Every text pair measured at WCAG AA or better |
| 2026-09-10 | Nav trimmed to Shop, States, Collections, Journal, About | Grammer-style header; Occasions, Lookbook, Market and Case study move to the mobile menu and footer |
| 2026-09-10 | Emoji removed from interface cards | They undercut the luxury frame; rendered tees and type do the work |
| 2026-09-10 | Home hero: 3D tee replaces the model photo | Founder request. The product is the hero, and reusing the shop silhouette keeps 2D and 3D identical |
| 2026-09-11 | Photo mockups replace drawn tees; 3D hero replaced by a tilting mockup | Founder wanted garments that look real. Blank garment photos are recoloured and printed in the browser; removing three.js also drops a 258 KB download |
| 2026-09-11 | Products come from `catalog/products.csv` | The store is a reusable template: swap the sheet, not the code |
| 2026-09-12 | three.js returns as ambience, not as the garment | Founder asked for 3D animation. The photo mockup stays the product hero; three.js adds the satin backdrop and a 3D collection ring, lazy-loaded on Home only, with Pause, reduced-motion and no-WebGL fallbacks |
| 2026-09-12 | Features taken from three reference repos | influencer-hugo (MIT): home sections as data with on/off switches, pull quote, testimonial slider, latest posts. react-e-commerce- and Organica (no licence, so ideas only): mega menu, hover colourway, price bands, review search with topic chips, product strip, wishlist, quick view, back to top |
| 2026-09-15 | Six themes instead of one fixed palette | Founder asked for Scrolltide-style themes. Moods picked from its public previews; palettes, fonts and code are original (its templates are paid). Tokens live in `src/themes.ts`; the Midnight Gold rules above describe the default theme. Every theme keeps AA contrast |
| 2026-09-15 | Corners and fonts vary by theme | `--radius`, `--radius-card` and `--display-weight` let Sandstone and Monsoon use pills and soft cards while Midnight stays square; "radius 0" now applies to Midnight and Garnet only |
| 2026-09-15 | Full store flow added | Bag page, coupons, GST-inclusive totals, four-step checkout, order history, simulated tracking, predictive search. All client-side for the demo |
| 2026-09-12 | Sample reviews allowed, labelled | Replaces "no invented reviews" for the portfolio demo. The labels stay while `STORE.demo` is on; `catalog/reviews.csv` is where a real store puts real reviews |
