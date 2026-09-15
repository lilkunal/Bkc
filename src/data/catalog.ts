/**
 * BKC catalogue.
 * Products come from catalog/products.csv (see catalog/README.md). This file holds
 * the store-level lists the sheet refers to: print fonts, category labels,
 * occasions and curated collections.
 */

import sheetCsv from '../../catalog/products.csv?raw'
import { GARMENTS, type GarmentType } from './garments'
import type { Colour } from './palette'
import { productsFromSheet, type Category, type Product, type SheetContext } from './sheet'

export { GARMENTS, fitInfo, type FitInfo, type GarmentType } from './garments'
export type { Category, Product, SheetIssue } from './sheet'

export type FontKey = 'anton' | 'bebas' | 'rozha' | 'marker' | 'playfair' | 'mono' | 'grotesk'
/** Fits and colours are plain strings now; these aliases keep older imports working. */
export type FitKey = string
export type ColorKey = string

export interface Occasion {
  key: string
  label: string
  when: string
  month: number
  glyph: string
  note: string
}

export interface Collection {
  key: string
  label: string
  glyph: string
  hero: string
  note: string
  filter: { fit?: string; cat?: string; type?: string }
}

export interface ProductFilter {
  type?: string
  cat?: string
  fit?: string
  occ?: string
  aud?: string
  color?: string
  state?: string
  region?: string
  /** Price strictly below this. */
  under?: number | string
  q?: string
}

/** Where a home or menu row takes its products from. */
export type ProductSource = 'newest' | 'bestsellers' | 'rating' | 'featured'

export const FONTS: Record<FontKey, string> = {
  anton: "'Anton', Impact, sans-serif",
  bebas: "'Bebas Neue', Impact, sans-serif",
  rozha: "'Rozha One', Georgia, serif",
  marker: "'Permanent Marker', cursive",
  playfair: "'Playfair Display', Georgia, serif",
  mono: "'Space Mono', monospace",
  grotesk: "'Space Grotesk', sans-serif",
}

/** Labels and notes for category keys used in the sheet. Unknown keys still work with a title-cased label. */
const CATEGORY_INFO: Record<string, { label: string; note: string }> = {
  "humour": {
    "label": "Desi Humour",
    "note": "The lines your group chat already says."
  },
  "statement": {
    "label": "Statement",
    "note": "Wear the opinion, skip the argument."
  },
  "civic": {
    "label": "Civic & Protest",
    "note": "Vote, question, show up. Peacefully."
  },
  "festive": {
    "label": "Festival Drops",
    "note": "Every festival on the Indian calendar."
  },
  "animals": {
    "label": "Animals & Cows",
    "note": "Cows, strays, elephants, the whole gang."
  },
  "insects": {
    "label": "Insects",
    "note": "Bees, butterflies and one honest cockroach."
  },
  "pride": {
    "label": "Pride & Allies",
    "note": "Made with the community, year-round."
  },
  "kids": {
    "label": "Kids",
    "note": "Skin-safe inks, tiny attitude."
  },
  "women": {
    "label": "Women",
    "note": "Crop, oversized and regular cuts."
  },
  "foodie": {
    "label": "Food & Chai",
    "note": "Maggi is a meal. Fight us."
  },
  "work": {
    "label": "Work Life",
    "note": "For the 10:02 AM standup."
  },
  "regional": {
    "label": "City & Region",
    "note": "Your pin code, printed."
  },
  "sports": {
    "label": "Cricket & Sport",
    "note": "Match day uniform."
  },
  "travel": {
    "label": "Travel",
    "note": "Sleeper class romantics."
  },
  "music": {
    "label": "Music",
    "note": "Bass bhai bass."
  },
  "typography": {
    "label": "Pure Typography",
    "note": "No art. Just letterforms."
  },
  "slang": {
    "label": "State Slang Atlas",
    "note": "Day-to-day talk by state and region."
  },
  "shirts": {
    "label": "Shirts",
    "note": "Button-downs and camp collars with small chest prints."
  }
}

export const OCCASIONS: Occasion[] = [
  { key: 'republic', label: 'Republic Day', when: '26 January', month: 1, glyph: '🇮🇳', note: 'Ganatantra drop. Tricolour-safe prints, no flag on fabric.' },
  { key: 'pongal', label: 'Pongal & Makar Sankranti', when: 'Mid January', month: 1, glyph: '🌾', note: 'Harvest, kites and sesame ladoos.' },
  { key: 'valentine', label: "Valentine's Week", when: '7–14 February', month: 2, glyph: '💌', note: 'Couple sets and aggressively single tees.' },
  { key: 'exams', label: 'Board Exam Season', when: 'Feb–March', month: 2, glyph: '✏️', note: 'For the survivors and the parents.' },
  { key: 'holi', label: 'Holi', when: 'March', month: 3, glyph: '🎨', note: 'White tees built to be ruined. Deliberately.' },
  { key: 'newyear-reg', label: 'Gudi Padwa / Ugadi / Baisakhi', when: 'March–April', month: 4, glyph: '🌿', note: 'Regional new years, one drop.' },
  { key: 'ipl', label: 'Cricket Season', when: 'March–May', month: 4, glyph: '🏏', note: 'Match-day tees, no franchise logos.' },
  { key: 'eid', label: 'Eid', when: 'Varies', month: 4, glyph: '🌙', note: 'Eid Mubarak in six typefaces.' },
  { key: 'monsoon', label: 'Monsoon', when: 'June–September', month: 7, glyph: '🌧', note: 'Quick-dry cotton, pakoda energy.' },
  { key: 'rakhi', label: 'Raksha Bandhan', when: 'August', month: 8, glyph: '🎀', note: 'Sibling twinning sets.' },
  { key: 'independence', label: 'Independence Day', when: '15 August', month: 8, glyph: '🎆', note: '15 August wala josh.' },
  { key: 'janmashtami', label: 'Janmashtami', when: 'August', month: 8, glyph: '🍯', note: 'Makhan chor, certified.' },
  { key: 'ganesh', label: 'Ganesh Chaturthi', when: 'Aug–September', month: 9, glyph: '🐘', note: 'Bappa morya, eleven days straight.' },
  { key: 'onam', label: 'Onam', when: 'Aug–September', month: 9, glyph: '🍌', note: 'Sadya-ready, stain-forgiving colours.' },
  { key: 'navratri', label: 'Navratri & Garba', when: 'Sept–October', month: 10, glyph: '💃', note: 'Nine nights, breathable cotton.' },
  { key: 'durga', label: 'Durga Puja', when: 'October', month: 10, glyph: '🪘', note: 'Pandal hopping uniform.' },
  { key: 'voting', label: 'Election & Voting Day', when: 'Poll calendar', month: 11, glyph: '🗳️', note: 'Non-partisan. Pro-turnout. Ink-finger proud.' },
  { key: 'protest', label: 'Protest & Civic Action', when: 'Year-round', month: 11, glyph: '✊', note: 'Peaceful assembly, printed. No party symbols, ever.' },
  { key: 'diwali', label: 'Diwali', when: 'Oct–November', month: 11, glyph: '🪔', note: 'The biggest drop of the year.' },
  { key: 'chhath', label: 'Chhath Puja', when: 'November', month: 11, glyph: '🌅', note: 'Ghat-side sunrise prints.' },
  { key: 'wedding', label: 'Shaadi Season', when: 'Nov–February', month: 12, glyph: '💒', note: 'Baraat squad sets, bulk pricing.' },
  { key: 'christmas', label: 'Christmas', when: '25 December', month: 12, glyph: '🎅', note: 'Desi Santa, sweater weather optional.' },
  { key: 'newyear', label: 'New Year', when: '31 December', month: 12, glyph: '🎆', note: 'Resolution loading…' },
  { key: 'everyday', label: 'Everyday', when: 'All year', month: 0, glyph: '☀️', note: 'The core range that never goes out of stock.' },
]

export const COLLECTIONS: Collection[] = [
  {
    key: 'oversized-club',
    label: 'The Oversized Club',
    glyph: '📦',
    hero: '#E7B325',
    note: '240 GSM, drop shoulder, boxy hem. Our biggest seller by a distance.',
    filter: { fit: 'oversized' },
  },
  {
    key: 'classic-cut',
    label: 'Classic Cut',
    glyph: '👕',
    hero: '#AFCBE3',
    note: '180 GSM bio-washed regular fit. The one you actually re-order.',
    filter: { fit: 'regular' },
  },
  {
    key: 'loud-and-desi',
    label: 'Loud & Desi',
    glyph: '📣',
    hero: '#D22B2B',
    note: 'Hinglish one-liners in Devanagari and Latin. Group-chat energy.',
    filter: { cat: 'humour' },
  },
  {
    key: 'creature-comfort',
    label: 'Creature Comfort',
    glyph: '🐄',
    hero: '#A6E2C6',
    note: 'Cows, strays, elephants, bees, butterflies — 2% of every sale goes to animal shelters.',
    filter: { cat: 'animals' },
  },
  {
    key: 'six-legs',
    label: 'Six Legs Good',
    glyph: '🐝',
    hero: '#12808C',
    note: 'An entire capsule about insects. Yes, including the cockroach.',
    filter: { cat: 'insects' },
  },
  {
    key: 'pride-always',
    label: 'Pride, All Year',
    glyph: '🏳️‍🌈',
    hero: '#C6ACE4',
    note: 'Designed with queer illustrators. Available in June and every other month.',
    filter: { cat: 'pride' },
  },
  {
    key: 'chhote-ustaad',
    label: 'Chhote Ustaad',
    glyph: '🧒',
    hero: '#F4795B',
    note: 'Kids 2–13Y. Skin-safe water-based inks, no plastisol.',
    filter: { fit: 'kids' },
  },
  {
    key: 'polling-booth',
    label: 'Polling Booth',
    glyph: '🗳️',
    hero: '#27356C',
    note: 'Turnout tees. Non-partisan by design — no party names, colours or symbols.',
    filter: { cat: 'civic' },
  },
  {
    key: 'festival-calendar',
    label: 'The Festival Calendar',
    glyph: '🪔',
    hero: '#FF7A18',
    note: 'Twenty-three drops mapped to the Indian festival year.',
    filter: { cat: 'festive' },
  },
  {
    key: 'plain-speak',
    label: 'Plain Speak',
    glyph: 'Aa',
    hero: '#B8B4AA',
    note: 'Typography-only. No illustration, no emoji, all letterform.',
    filter: { cat: 'typography' },
  },
  {
    key: 'slang-atlas',
    label: 'Slang Atlas',
    glyph: '🗣️',
    hero: '#A6E2C6',
    note: 'Shop by where you speak — Kumaoni to Malayalam, same cart.',
    filter: { cat: 'slang' },
  },
  {
    key: 'shirt-shop',
    label: 'The Shirt Shop',
    glyph: '👔',
    hero: '#AFCBE3',
    note: 'Button-downs, camp collars and linen blends with small chest prints.',
    filter: { type: 'shirt' },
  },
]

export const SHEET_CONTEXT: SheetContext = { fonts: FONTS, defaultFont: 'anton', categoryInfo: CATEGORY_INFO }
export const SHEET = productsFromSheet(sheetCsv, SHEET_CONTEXT)

if (import.meta.env.DEV && (SHEET.errors.length || SHEET.warnings.length)) {
  console.warn(
    '[catalog] products.csv has ' + SHEET.errors.length + ' error(s) and ' + SHEET.warnings.length +
      ' warning(s). Run npm run check:products for details.',
  )
}

export const PRODUCTS: Product[] = SHEET.products
export const CATEGORIES: Category[] = SHEET.categories
export const COLORS: Record<string, Colour> = SHEET.colours
export const PRODUCT_TYPES: GarmentType[] = [...new Set(PRODUCTS.map((p) => p.type))]

export function featuredProduct(): Product {
  return PRODUCTS.find((p) => p.featured) ?? PRODUCTS[0]
}

/** Fit filter options across every garment type in the sheet. */
export function fitOptions(): [string, string][] {
  const seen = new Map<string, string>()
  for (const type of PRODUCT_TYPES) {
    for (const fit of Object.values(GARMENTS[type].fits)) if (!seen.has(fit.key)) seen.set(fit.key, fit.label)
  }
  return [...seen]
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug)
}

export function filterProducts(filter: ProductFilter = {}): Product[] {
  return PRODUCTS.filter((p) => {
    if (filter.type && p.type !== filter.type) return false
    if (filter.cat && !p.cats.includes(filter.cat)) return false
    if (filter.fit && p.fit !== filter.fit) return false
    if (filter.occ && !p.occasions.includes(filter.occ)) return false
    if (filter.color && p.color !== filter.color && !p.alsoIn.includes(filter.color)) return false
    if (filter.aud) {
      const match = p.audience.includes(filter.aud) || (filter.aud !== 'kids' && p.audience.includes('unisex'))
      if (!match) return false
    }
    if (filter.state && p.state !== filter.state) return false
    if (filter.region && p.region !== filter.region) return false
    if (filter.under && !(p.price < Number(filter.under))) return false
    if (filter.q) {
      const q = filter.q.toLowerCase()
      const hay = [p.name, p.desc, p.lang, p.state, p.region, p.type, ...p.printLines, ...p.cats]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })
}

/** Same garment type and a shared category rank highest. */
export function relatedProducts(product: Product, n = 4): Product[] {
  const score = (q: Product) => (q.type === product.type ? 2 : 0) + (q.cats.some((c) => product.cats.includes(c)) ? 1 : 0)
  return PRODUCTS.filter((q) => q.id !== product.id)
    .map((q) => [q, score(q)] as const)
    .filter(([, s]) => s > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([q]) => q)
}

export function bestsellers(n = 8): Product[] {
  return [...PRODUCTS].sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0) || (b.rating ?? 0) - (a.rating ?? 0)).slice(0, n)
}

/** Later rows in the sheet count as newer. */
export function newest(n = 8): Product[] {
  return [...PRODUCTS].reverse().slice(0, n)
}

/** A slice of the catalogue for a home or menu row. */
export function pickProducts(source: ProductSource, filter: ProductFilter = {}, n = 8): Product[] {
  const pool = filterProducts(filter)
  const byReviews = (a: Product, b: Product) => (b.reviews ?? 0) - (a.reviews ?? 0) || (b.rating ?? 0) - (a.rating ?? 0)
  let list: Product[]
  if (source === 'newest') list = [...pool].reverse()
  else if (source === 'rating') list = [...pool].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || byReviews(a, b))
  else if (source === 'featured') list = [...pool].sort((a, b) => Number(b.featured) - Number(a.featured) || byReviews(a, b))
  else list = [...pool].sort(byReviews)
  return list.slice(0, n)
}

/** Spreads garment colours across a row, so it doesn't read as ten white tees in a line. */
export function varied(list: Product[], n: number): Product[] {
  const picked: Product[] = []
  const colours = new Set<string>()
  for (const p of list) {
    if (picked.length < n && !colours.has(p.color)) {
      picked.push(p)
      colours.add(p.color)
    }
  }
  for (const p of list) if (picked.length < n && !picked.includes(p)) picked.push(p)
  return picked
}

/**
 * "Under X" price bands that split this catalogue usefully: round thresholds (100, 150, 200, 250…
 * at every scale), keeping up to four spread across the range.
 */
export function priceBands(max = 4): { under: number; count: number }[] {
  const prices = PRODUCTS.map((p) => p.price).sort((a, b) => a - b)
  if (prices.length < 4) return []
  const total = prices.length
  const candidates: { under: number; count: number }[] = []
  for (let scale = 10 ** Math.floor(Math.log10(Math.max(prices[0], 1))); scale <= prices[total - 1] * 10; scale *= 10) {
    for (const m of [1, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 8]) {
      const under = m * scale
      const count = prices.filter((p) => p < under).length
      if (count > 0 && count < total && !candidates.some((c) => c.count === count)) candidates.push({ under, count })
    }
  }
  const picked = new Set<{ under: number; count: number }>()
  for (let i = 0; i < max; i++) {
    const goal = (total * (i + 0.6)) / max
    const best = candidates.filter((c) => !picked.has(c)).sort((a, b) => Math.abs(a.count - goal) - Math.abs(b.count - goal))[0]
    if (best) picked.add(best)
  }
  return [...picked].sort((a, b) => a.under - b.under)
}
