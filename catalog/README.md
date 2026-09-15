# Product sheet

Every product in the store comes from **`products.csv`** in this folder. To load a different catalogue, replace that file and rebuild. No code changes needed.

## Swapping in a new catalogue

1. Fill in a spreadsheet using the columns below (Excel or Google Sheets both work).
2. Save it as **CSV UTF-8** (Excel: *File → Save As → CSV UTF-8*. Google Sheets: *File → Download → CSV*).
3. Check it before it goes live:
   ```bash
   npm run check:products -- path/to/your-sheet.csv
   ```
   Problems are listed by row number. **Errors** leave a row out of the store; **warnings** keep it with a fallback.
4. Replace `catalog/products.csv` with your file, then `npm run dev` to look, and `npm run deploy` to publish.

Comma, semicolon and tab-separated files are all accepted. Column names are case-insensitive, and common alternatives work (`Color`, `MRP`, `Image URL`, `Title`).

## Columns

Only **name** and **price** are required. Leave anything else blank to use the default.

| Column | Example | Notes |
|---|---|---|
| `id` | `BKC-1001` | Permanent product id, used in links. Keep it stable. Auto-assigned if blank. |
| `name` | `Maggi Is A Meal` | **Required.** |
| `type` | `tee` | Garment type: `tee` or `shirt` (default `tee`). New types go in `src/data/garments.ts`. |
| `category` | `foodie\|humour` | One or more, separated by `\|`. New categories are created automatically. |
| `price` | `899` | **Required.** `₹` and commas are fine. |
| `compare_at_price` | `1199` | Optional "was" price; shown as a discount only when higher than `price`. |
| `colour` | `mustard` | Palette key, palette name (`Haldi Mustard`) or hex (`#1C5B49`). Default white. |
| `other_colours` | `white\|black` | Extra colours the buyer can switch to. |
| `fit` | `oversized` | T-shirts: `oversized`, `regular`, `crop`, `kids`. Shirts: `regular`, `slim`, `relaxed`. |
| `sizes` | `S\|M\|L` | Optional. Defaults to the fit's size range. |
| `print_lines` | `MAGGI IS\|A MEAL` | Up to 3 lines of print text. |
| `print_font` | `anton` | `anton`, `bebas`, `rozha`, `marker`, `playfair`, `mono`, `grotesk`. |
| `print_glyph` | `🍜` | Optional emoji above the text. |
| `print_backdrop` | `ring` | `burst`, `ring`, `box`, `banner`, `star`, or blank. |
| `print_backdrop_colour` | `#E7B325` | Hex colour for the backdrop. |
| `print_ink` | `#C9A24A` | Print colour. Defaults to a colour that reads well on the garment. |
| `image` | `/products/maggi.jpg` | Optional photo (a path inside `public/` or a full URL). Leave blank for an automatic mockup. |
| `description` | `Maggi is a meal. Fight us.` | Shown on the product page. |
| `badge` | `NEW` | Small label on the product card. |
| `rating` | `4.6` | Optional, 0–5. |
| `reviews` | `128` | Optional whole number. |
| `audience` | `men\|women\|unisex` | Powers the Wearer filter. |
| `occasions` | `holi\|monsoon` | Keys from the occasions list in `src/data/catalog.ts`. |
| `state` / `region` / `language` | `punjab` / `majha` / `Punjabi` | Optional. The slang atlas and state filters only appear when products use them. |
| `featured` | `yes` | The first featured product is the home-page hero. |

## Reviews sheet

**`reviews.csv`** feeds the review carousel on Home and the reviews section on product pages. `npm run check:products` checks it too. Only **name**, **rating** and **body** are required; an empty sheet (header row only) hides both sections.

| Column | Example | Notes |
|---|---|---|
| `product` | `BKC-1007` | A product id: the review appears first on that product. |
| `category` | `humour` | A category key: shown on every product in it. Leave `product` and `category` blank for a store-wide review. |
| `name` | `Meera J.` | **Required.** |
| `city` | `Lucknow` | Optional. |
| `rating` | `4` | **Required.** 1 to 5. |
| `title` | `Runs big` | Optional headline. |
| `body` | `Swapped M for S…` | **Required.** |
| `tags` | `size\|fit` | Topics, separated by `\|`. The most common become filter chips on product pages. |
| `featured` | `yes` | Featured rows fill the Home carousel (otherwise the best-rated are used). |
| `date` | `2026-07-08` | Optional, `YYYY-MM-DD`. Used for "Most recent" sorting. |

The demo sheet holds sample reviews, labelled as such on the site. A live store should use real ones.

## Colour palette

`white`, `black`, `offwhite`, `mustard`, `chilli`, `bottle`, `indigo`, `powder`, `lilac`, `sand`, `coral`, `mint`, `charcoal`, `maroon`, `olive`, `rose`, `acid`, `saffron`, `teal`, `lavender`, or any hex code. Names and hex values live in `src/data/palette.ts`.
