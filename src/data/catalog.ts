/** BKC catalogue — colours, fits, taxonomy, products, helpers. */

import { REGIONAL_PRODUCTS } from './regionalProducts'

export type ColorKey =
  | 'white'
  | 'black'
  | 'offwhite'
  | 'mustard'
  | 'chilli'
  | 'bottle'
  | 'indigo'
  | 'powder'
  | 'lilac'
  | 'sand'
  | 'coral'
  | 'mint'
  | 'charcoal'
  | 'maroon'
  | 'olive'
  | 'rose'
  | 'acid'
  | 'saffron'
  | 'teal'
  | 'lavender'

export type FontKey = 'anton' | 'bebas' | 'rozha' | 'marker' | 'playfair' | 'mono' | 'grotesk'

export type FitKey = 'oversized' | 'regular' | 'crop' | 'kids'

export type BackdropKey = 'none' | 'burst' | 'ring' | 'box' | 'banner' | 'star'

export type CategoryKey =
  | 'humour'
  | 'statement'
  | 'civic'
  | 'festive'
  | 'animals'
  | 'insects'
  | 'pride'
  | 'kids'
  | 'women'
  | 'foodie'
  | 'work'
  | 'regional'
  | 'sports'
  | 'travel'
  | 'music'
  | 'typography'
  | 'slang'

export type OccasionKey =
  | 'republic'
  | 'pongal'
  | 'valentine'
  | 'exams'
  | 'holi'
  | 'newyear-reg'
  | 'ipl'
  | 'eid'
  | 'monsoon'
  | 'rakhi'
  | 'independence'
  | 'janmashtami'
  | 'ganesh'
  | 'onam'
  | 'navratri'
  | 'durga'
  | 'voting'
  | 'protest'
  | 'diwali'
  | 'chhath'
  | 'wedding'
  | 'christmas'
  | 'newyear'
  | 'everyday'

export type AudienceKey = 'men' | 'women' | 'unisex' | 'kids' | 'pride'

export interface Color {
  name: string
  hex: string
  ink: string
}

export interface Fit {
  key: FitKey
  label: string
  blurb: string
  gsm: number
  sizes: string[]
}

export interface Category {
  key: CategoryKey
  label: string
  glyph: string
  note: string
}

export interface Occasion {
  key: OccasionKey
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
  filter: { fit?: FitKey; cat?: CategoryKey }
}

export interface Product {
  id: string
  slug: string
  name: string
  printLines: string[]
  glyph: string
  font: string
  fontKey: FontKey
  fit: FitKey
  color: ColorKey
  colorName: string
  teeHex: string
  printHex: string
  backdrop: BackdropKey
  backdropHex: string
  alsoIn: ColorKey[]
  price: number
  mrp: number
  audience: AudienceKey[]
  cats: CategoryKey[]
  occasions: OccasionKey[]
  rating: number
  reviews: number
  badge: string
  desc: string
  state?: string
  region?: string
  lang?: string
}

export interface ProductInput {
  name: string
  p?: string[]
  g?: string
  f?: FontKey | string
  fit?: FitKey | string
  c?: ColorKey | string
  pr?: number
  mrp?: number
  aud?: AudienceKey[] | string[]
  cat?: CategoryKey[] | string[]
  occ?: OccasionKey[] | string[]
  bd?: BackdropKey | string
  bdc?: string
  also?: ColorKey[] | string[]
  ink?: string
  b?: string
  r?: number
  rev?: number
  d?: string
  state?: string
  region?: string
  lang?: string
}

export interface ProductFilter {
  cat?: CategoryKey | string
  fit?: FitKey | string
  occ?: OccasionKey | string
  aud?: AudienceKey | string
  color?: ColorKey | string
  state?: string
  region?: string
  q?: string
}

export const COLORS: Record<ColorKey, Color> = {
  white: { name: 'Chalk White', hex: '#FFFFFF', ink: '#0E0E0C' },
  black: { name: 'Kajal Black', hex: '#131313', ink: '#F6F1E6' },
  offwhite: { name: 'Khadi Off-White', hex: '#F1EADB', ink: '#0E0E0C' },
  mustard: { name: 'Haldi Mustard', hex: '#E7B325', ink: '#17150B' },
  chilli: { name: 'Mirchi Red', hex: '#D22B2B', ink: '#FFF6E8' },
  bottle: { name: 'Bottle Green', hex: '#1C5B49', ink: '#F4EFE4' },
  indigo: { name: 'Neel Indigo', hex: '#27356C', ink: '#F4EFE4' },
  powder: { name: 'Powder Blue', hex: '#AFCBE3', ink: '#14213D' },
  lilac: { name: 'Lilac Haze', hex: '#C6ACE4', ink: '#221436' },
  sand: { name: 'Desert Sand', hex: '#DAC7A6', ink: '#2A2013' },
  coral: { name: 'Coral Crush', hex: '#F4795B', ink: '#2A0F07' },
  mint: { name: 'Pudina Mint', hex: '#A6E2C6', ink: '#0C2E22' },
  charcoal: { name: 'Charcoal Grey', hex: '#3A3B3F', ink: '#F4EFE4' },
  maroon: { name: 'Maroon Velvet', hex: '#6E1F31', ink: '#F7E9D5' },
  olive: { name: 'Olive Fatigue', hex: '#6B7A4A', ink: '#F6F3E4' },
  rose: { name: 'Rose Pink', hex: '#F0A5B8', ink: '#3A1220' },
  acid: { name: 'Acid Wash Grey', hex: '#B8B4AA', ink: '#1B1A16' },
  saffron: { name: 'Kesari Saffron', hex: '#FF7A18', ink: '#2A1000' },
  teal: { name: 'Peacock Teal', hex: '#12808C', ink: '#F1FAFB' },
  lavender: { name: 'Lavender Ice', hex: '#DCD6F2', ink: '#26204A' },
}

export const FONTS: Record<FontKey, string> = {
  anton: "'Anton', Impact, sans-serif",
  bebas: "'Bebas Neue', Impact, sans-serif",
  rozha: "'Rozha One', Georgia, serif",
  marker: "'Permanent Marker', cursive",
  playfair: "'Playfair Display', Georgia, serif",
  mono: "'Space Mono', monospace",
  grotesk: "'Space Grotesk', sans-serif",
}

export const FITS: Record<FitKey, Fit> = {
  oversized: {
    key: 'oversized',
    label: 'Oversized',
    blurb: 'Boxy 240 GSM drop-shoulder. Falls 2–3 inches below the shoulder point.',
    gsm: 240,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
  },
  regular: {
    key: 'regular',
    label: 'Regular / Classic',
    blurb: 'Everyday 180 GSM bio-washed cotton. True to size, straight hem.',
    gsm: 180,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
  },
  crop: {
    key: 'crop',
    label: 'Boxy Crop',
    blurb: 'Cropped 200 GSM boxy cut. Sits at the high waist.',
    gsm: 200,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  kids: {
    key: 'kids',
    label: 'Kids',
    blurb: 'Soft 160 GSM combed cotton, no-scratch neck tape, skin-safe inks.',
    gsm: 160,
    sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y', '12-13Y'],
  },
}

export const CATEGORIES: Category[] = [
  { key: 'humour', label: 'Desi Humour', glyph: '😂', note: 'The lines your group chat already says.' },
  { key: 'statement', label: 'Statement', glyph: '💬', note: 'Wear the opinion, skip the argument.' },
  { key: 'civic', label: 'Civic & Protest', glyph: '🗳️', note: 'Vote, question, show up. Peacefully.' },
  { key: 'festive', label: 'Festival Drops', glyph: '🪔', note: 'Every festival on the Indian calendar.' },
  { key: 'animals', label: 'Animals & Cows', glyph: '🐄', note: 'Cows, strays, elephants, the whole gang.' },
  { key: 'insects', label: 'Insects', glyph: '🐝', note: 'Bees, butterflies and one honest cockroach.' },
  { key: 'pride', label: 'Pride & Allies', glyph: '🏳️‍🌈', note: 'Made with the community, year-round.' },
  { key: 'kids', label: 'Kids', glyph: '🧒', note: 'Skin-safe inks, tiny attitude.' },
  { key: 'women', label: 'Women', glyph: '♀', note: 'Crop, oversized and regular cuts.' },
  { key: 'foodie', label: 'Food & Chai', glyph: '🍜', note: 'Maggi is a meal. Fight us.' },
  { key: 'work', label: 'Work Life', glyph: '💻', note: 'For the 10:02 AM standup.' },
  { key: 'regional', label: 'City & Region', glyph: '🏙️', note: 'Your pin code, printed.' },
  { key: 'sports', label: 'Cricket & Sport', glyph: '🏏', note: 'Match day uniform.' },
  { key: 'travel', label: 'Travel', glyph: '🚂', note: 'Sleeper class romantics.' },
  { key: 'music', label: 'Music', glyph: '🎧', note: 'Bass bhai bass.' },
  { key: 'typography', label: 'Pure Typography', glyph: 'Aa', note: 'No art. Just letterforms.' },
  { key: 'slang', label: 'State Slang Atlas', glyph: '🗣️', note: 'Day-to-day talk by state and region.' },
]

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
]

let idn = 0

function mk(a: ProductInput): Product {
  idn += 1
  const color = (a.c || 'white') as ColorKey
  const col = COLORS[color] || COLORS.white
  const fit = (a.fit || 'oversized') as FitKey
  const fontKey = (a.f || 'anton') as FontKey
  const basePrice =
    a.pr ?? (fit === 'oversized' ? 899 : fit === 'kids' ? 499 : fit === 'crop' ? 749 : 649)
  return {
    id: 'BKC-' + String(1000 + idn),
    slug: a.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, ''),
    name: a.name,
    printLines: a.p || [],
    glyph: a.g || '',
    font: FONTS[fontKey],
    fontKey,
    fit,
    color,
    colorName: col.name,
    teeHex: col.hex,
    printHex: a.ink || col.ink,
    backdrop: (a.bd || 'none') as BackdropKey,
    backdropHex: a.bdc || '',
    alsoIn: (a.also || ['white', 'black']) as ColorKey[],
    price: basePrice,
    mrp: a.mrp || Math.round((basePrice * 2) / 50) * 50 - 1,
    audience: (a.aud || ['unisex']) as AudienceKey[],
    cats: (a.cat || ['statement']) as CategoryKey[],
    occasions: (a.occ || ['everyday']) as OccasionKey[],
    rating: a.r || 4.1 + (idn % 9) / 10,
    reviews: a.rev || 40 + (idn * 37) % 900,
    badge: a.b || '',
    desc: a.d || '',
    state: a.state,
    region: a.region,
    lang: a.lang,
  }
}

export const PRODUCTS: Product[] = [
  mk({ name: "Bharat Ka Ch**tiya — The Original", p: ["BHARAT KA","Ch**tiya"], f: "anton", fit: "oversized", c: "white", pr: 999, mrp: 1999, aud: ["men","women","unisex"], cat: ["humour","typography","statement"], b: "HERO DROP", r: 4.9, rev: 3128, d: "The soft-censor brand tee. Gaali softened to habit — affectionate idiot energy on 240 GSM." }),
  mk({ name: "BKC Monogram", p: ["BKC"], f: "anton", fit: "oversized", c: "black", pr: 899, aud: ["unisex"], cat: ["typography"], bd: "ring", bdc: "#E7B325", b: "NEW", r: 4.7, rev: 612, d: "Three letters, one ring, zero explanation needed." }),
  mk({ name: "Certified Ch**tiya", p: ["CERTIFIED","Ch**tiya"], g: "🏅", f: "bebas", fit: "regular", c: "mustard", pr: 699, aud: ["unisex"], cat: ["humour"], r: 4.6, rev: 890 }),
  mk({ name: "चूtiya Lockup", p: ["चूtiya"], f: "rozha", fit: "oversized", c: "white", pr: 949, aud: ["unisex"], cat: ["typography","humour"], b: "HINGLISH", r: 4.8, rev: 1200, d: "Chu in Devanagari, tiya in Latin — cute enough that nobody flinches, clear enough that everyone gets it." }),
  mk({ name: "Chai Pe Charcha", p: ["CHAI PE","CHARCHA"], g: "☕", f: "rozha", fit: "oversized", c: "sand", cat: ["humour","foodie"], b: "BESTSELLER", r: 4.8, rev: 2140 }),
  mk({ name: "Sab Moh Maya Hai", p: ["SAB MOH","MAYA HAI"], g: "🌀", f: "rozha", fit: "oversized", c: "black", cat: ["humour","statement"], r: 4.7, rev: 1560 }),
  mk({ name: "Log Kya Kahenge", p: ["LOG KYA","KAHENGE"], g: "👀", f: "anton", fit: "oversized", c: "chilli", cat: ["humour"], b: "TRENDING", r: 4.6, rev: 1802 }),
  mk({ name: "Beta Tumse Na Ho Payega", p: ["BETA TUMSE","NA HO PAYEGA"], f: "bebas", fit: "regular", c: "white", cat: ["humour"], r: 4.5, rev: 980 }),
  mk({ name: "Adjust Kar Lenge", p: ["ADJUST","KAR LENGE"], g: "🧘", f: "grotesk", fit: "regular", c: "mint", cat: ["humour"], r: 4.4, rev: 430 }),
  mk({ name: "Jugaad Certified", p: ["JUGAAD","CERTIFIED"], g: "🔧", f: "mono", fit: "oversized", c: "olive", cat: ["humour","work"], r: 4.6, rev: 705 }),
  mk({ name: "Do Minute Mein Aata Hoon", p: ["DO MINUTE","MEIN AATA HOON"], g: "⏰", f: "bebas", fit: "regular", c: "powder", cat: ["humour"], r: 4.5, rev: 388 }),
  mk({ name: "Bas Nikal Hi Raha Tha", p: ["BAS NIKAL","HI RAHA THA"], g: "🛵", f: "marker", fit: "oversized", c: "coral", cat: ["humour","travel"], r: 4.7, rev: 1120 }),
  mk({ name: "System Hi Kharab Hai", p: ["SYSTEM HI","KHARAB HAI"], g: "⚙️", f: "mono", fit: "oversized", c: "charcoal", cat: ["humour","statement"], r: 4.8, rev: 1994 }),
  mk({ name: "Shaadi Kab Hai", p: ["SHAADI","KAB HAI?"], g: "💍", f: "playfair", fit: "regular", c: "rose", cat: ["humour"], occ: ["wedding"], r: 4.4, rev: 512 }),
  mk({ name: "Thoda Aur Scroll", p: ["THODA AUR","SCROLL"], g: "📱", f: "grotesk", fit: "oversized", c: "lavender", cat: ["humour","work"], r: 4.3, rev: 266 }),
  mk({ name: "Main Toh Bas Dekhne Aaya Tha", p: ["BAS DEKHNE","AAYA THA"], g: "🕶", f: "bebas", fit: "oversized", c: "acid", cat: ["humour"], r: 4.5, rev: 651 }),
  mk({ name: "Ghar Pe Bata Dunga", p: ["GHAR PE","BATA DUNGA"], g: "📞", f: "marker", fit: "regular", c: "mustard", cat: ["humour"], r: 4.4, rev: 344 }),
  mk({ name: "Maggi Is A Meal", p: ["MAGGI IS","A MEAL"], g: "🍜", f: "anton", fit: "oversized", c: "mustard", cat: ["foodie","humour"], b: "BESTSELLER", r: 4.8, rev: 2560 }),
  mk({ name: "Extra Chutney", p: ["EXTRA","CHUTNEY"], g: "🌶", f: "bebas", fit: "regular", c: "bottle", cat: ["foodie"], r: 4.5, rev: 470 }),
  mk({ name: "Cutting Chai Club", p: ["CUTTING CHAI","CLUB"], g: "🫖", f: "playfair", fit: "regular", c: "offwhite", cat: ["foodie"], bd: "ring", bdc: "#D22B2B", r: 4.7, rev: 1310 }),
  mk({ name: "Biryani Se Pyaar Hai", p: ["BIRYANI SE","PYAAR HAI"], g: "🍛", f: "rozha", fit: "oversized", c: "maroon", cat: ["foodie"], r: 4.9, rev: 3010 }),
  mk({ name: "Golgappa Ka Hisaab", p: ["GOLGAPPA","KA HISAAB"], g: "🥟", f: "marker", fit: "crop", c: "coral", aud: ["women"], cat: ["foodie","women"], r: 4.6, rev: 588 }),
  mk({ name: "Filter Coffee Only", p: ["FILTER COFFEE","ONLY"], g: "☕", f: "mono", fit: "regular", c: "sand", cat: ["foodie","regional"], r: 4.6, rev: 742 }),
  mk({ name: "Pakode Weather", p: ["PAKODE","WEATHER"], g: "🌧", f: "rozha", fit: "oversized", c: "teal", cat: ["foodie"], occ: ["monsoon"], r: 4.7, rev: 905 }),
  mk({ name: "This Meeting Could Have Been An Email", p: ["COULD HAVE","BEEN AN EMAIL"], g: "📧", f: "mono", fit: "oversized", c: "charcoal", cat: ["work","humour"], r: 4.8, rev: 1888 }),
  mk({ name: "On Mute, Not Listening", p: ["ON MUTE,","NOT LISTENING"], g: "🎧", f: "grotesk", fit: "regular", c: "black", cat: ["work"], r: 4.5, rev: 622 }),
  mk({ name: "Ctrl Alt Delete Life", p: ["CTRL ALT","DEL LIFE"], g: "⌨️", f: "mono", fit: "oversized", c: "indigo", cat: ["work"], r: 4.4, rev: 401 }),
  mk({ name: "Deadline Ka Dar", p: ["DEADLINE","KA DAR"], g: "⏳", f: "bebas", fit: "regular", c: "chilli", cat: ["work"], r: 4.3, rev: 288 }),
  mk({ name: "Startup Wala Sapna", p: ["STARTUP","WALA SAPNA"], g: "🚀", f: "anton", fit: "oversized", c: "white", cat: ["work"], r: 4.5, rev: 519 }),
  mk({ name: "Pehle Matdaan, Fir Jalpaan", p: ["PEHLE MATDAAN","FIR JALPAAN"], g: "🗳️", f: "rozha", fit: "oversized", c: "white", pr: 949, aud: ["men","women","unisex"], cat: ["civic","statement"], occ: ["voting"], b: "TURNOUT DROP", r: 4.9, rev: 1640, d: "Vote first, snacks after. Printed for polling day — deliberately free of any party name, colour or symbol." }),
  mk({ name: "Ungli Pe Nishaan", p: ["UNGLI PE","NISHAAN"], g: "☝️", f: "anton", fit: "regular", c: "offwhite", cat: ["civic"], occ: ["voting"], r: 4.7, rev: 830, d: "That indelible ink mark is the whole point. Wear the receipt." }),
  mk({ name: "Vote Daalo, Fir Bolo", p: ["VOTE DAALO","FIR BOLO"], g: "🗳️", f: "bebas", fit: "oversized", c: "indigo", cat: ["civic"], occ: ["voting"], r: 4.8, rev: 1205 }),
  mk({ name: "Loktantra Zindabad", p: ["LOKTANTRA","ZINDABAD"], g: "✊", f: "rozha", fit: "oversized", c: "black", cat: ["civic"], occ: ["protest"], r: 4.8, rev: 1422 }),
  mk({ name: "Sawaal Poochho", p: ["SAWAAL","POOCHHO"], g: "❓", f: "anton", fit: "regular", c: "mustard", cat: ["civic","statement"], occ: ["protest"], r: 4.6, rev: 690 }),
  mk({ name: "Shanti Se, Par Zaroor", p: ["SHANTI SE,","PAR ZAROOR"], g: "🕊", f: "playfair", fit: "oversized", c: "offwhite", cat: ["civic"], occ: ["protest"], r: 4.7, rev: 540, d: "Peacefully — but definitely. A protest tee that argues for the method as much as the cause." }),
  mk({ name: "Samvidhan Reader", p: ["SAMVIDHAN","READER"], g: "📖", f: "mono", fit: "regular", c: "bottle", cat: ["civic"], occ: ["republic","protest"], r: 4.9, rev: 1102 }),
  mk({ name: "RTI Filed", p: ["RTI","FILED"], g: "📄", f: "mono", fit: "regular", c: "acid", cat: ["civic","humour"], occ: ["protest"], r: 4.5, rev: 322 }),
  mk({ name: "Awaaz Do", p: ["AWAAZ","DO"], g: "📣", f: "anton", fit: "oversized", c: "chilli", cat: ["civic"], occ: ["protest"], r: 4.7, rev: 880 }),
  mk({ name: "NOTA Is Also A Choice", p: ["NOTA IS ALSO","A CHOICE"], g: "🗳️", f: "grotesk", fit: "regular", c: "charcoal", cat: ["civic","humour"], occ: ["voting"], r: 4.4, rev: 265 }),
  mk({ name: "Patakhe Kam, Mithai Zyada", p: ["PATAKHE KAM","MITHAI ZYADA"], g: "🪔", f: "rozha", fit: "oversized", c: "maroon", cat: ["festive"], occ: ["diwali"], b: "DIWALI", r: 4.9, rev: 2410 }),
  mk({ name: "Diya Jalao, Dil Jodo", p: ["DIYA JALAO","DIL JODO"], g: "🪔", f: "playfair", fit: "regular", c: "saffron", cat: ["festive"], occ: ["diwali"], r: 4.7, rev: 1180 }),
  mk({ name: "Bura Na Mano", p: ["BURA NA","MANO"], g: "🎨", f: "marker", fit: "oversized", c: "white", cat: ["festive"], occ: ["holi"], b: "HOLI", r: 4.8, rev: 1975, d: "A white tee engineered to be destroyed by gulaal. Pre-shrunk so the ruin is at least the right size." }),
  mk({ name: "Rang De", p: ["RANG","DE"], g: "🌈", f: "anton", fit: "crop", c: "white", aud: ["women"], cat: ["festive","women"], occ: ["holi"], r: 4.6, rev: 640 }),
  mk({ name: "15 August Wala Josh", p: ["15 AUGUST","WALA JOSH"], g: "🎆", f: "bebas", fit: "oversized", c: "offwhite", cat: ["festive"], occ: ["independence"], r: 4.8, rev: 1560 }),
  mk({ name: "Ganatantra", p: ["GANATANTRA"], g: "🇮🇳", f: "rozha", fit: "regular", c: "indigo", cat: ["festive","civic"], occ: ["republic"], r: 4.7, rev: 870 }),
  mk({ name: "Behen Ka Bodyguard", p: ["BEHEN KA","BODYGUARD"], g: "🎀", f: "marker", fit: "regular", c: "powder", cat: ["festive","humour"], occ: ["rakhi"], r: 4.6, rev: 733 }),
  mk({ name: "Bhai Ka ATM", p: ["BHAI KA","ATM"], g: "💸", f: "bebas", fit: "crop", c: "rose", aud: ["women"], cat: ["festive","humour","women"], occ: ["rakhi"], r: 4.5, rev: 410 }),
  mk({ name: "Garba Till Dawn", p: ["GARBA","TILL DAWN"], g: "💃", f: "anton", fit: "oversized", c: "chilli", cat: ["festive"], occ: ["navratri"], b: "NAVRATRI", r: 4.8, rev: 1340 }),
  mk({ name: "Pandal Hopping", p: ["PANDAL","HOPPING"], g: "🪘", f: "playfair", fit: "oversized", c: "white", cat: ["festive","regional"], occ: ["durga"], r: 4.7, rev: 995 }),
  mk({ name: "Bappa Morya", p: ["BAPPA","MORYA"], g: "🐘", f: "rozha", fit: "oversized", c: "saffron", cat: ["festive","animals"], occ: ["ganesh"], b: "GANESH", r: 4.9, rev: 2050 }),
  mk({ name: "Sadya Ready", p: ["SADYA","READY"], g: "🍌", f: "playfair", fit: "regular", c: "offwhite", cat: ["festive","foodie","regional"], occ: ["onam"], r: 4.7, rev: 620 }),
  mk({ name: "Pongalo Pongal", p: ["PONGALO","PONGAL"], g: "🌾", f: "bebas", fit: "regular", c: "mustard", cat: ["festive","regional"], occ: ["pongal"], r: 4.6, rev: 505 }),
  mk({ name: "Bhangra Mode On", p: ["BHANGRA","MODE ON"], g: "🥁", f: "anton", fit: "oversized", c: "mustard", cat: ["festive","music"], occ: ["newyear-reg"], r: 4.7, rev: 812 }),
  mk({ name: "Eid Mubarak", p: ["EID","MUBARAK"], g: "🌙", f: "playfair", fit: "regular", c: "bottle", cat: ["festive"], occ: ["eid"], r: 4.8, rev: 1090 }),
  mk({ name: "Desi Santa", p: ["DESI","SANTA"], g: "🎅", f: "marker", fit: "oversized", c: "chilli", cat: ["festive","humour"], occ: ["christmas"], r: 4.6, rev: 690 }),
  mk({ name: "Resolution Loading", p: ["RESOLUTION","LOADING…"], g: "🎆", f: "mono", fit: "oversized", c: "black", cat: ["festive","humour"], occ: ["newyear"], r: 4.5, rev: 588 }),
  mk({ name: "Makhan Chor", p: ["MAKHAN","CHOR"], g: "🍯", f: "rozha", fit: "kids", c: "mustard", aud: ["kids"], cat: ["festive","kids"], occ: ["janmashtami"], r: 4.8, rev: 470 }),
  mk({ name: "Chhathi Maiya", p: ["CHHATHI","MAIYA"], g: "🌅", f: "rozha", fit: "regular", c: "saffron", cat: ["festive","regional"], occ: ["chhath"], r: 4.7, rev: 380 }),
  mk({ name: "Shaadi Ka Season", p: ["SHAADI KA","SEASON"], g: "💒", f: "playfair", fit: "oversized", c: "maroon", cat: ["festive","humour"], occ: ["wedding"], r: 4.6, rev: 720 }),
  mk({ name: "Baraat Squad", p: ["BARAAT","SQUAD"], g: "🕺", f: "anton", fit: "oversized", c: "indigo", cat: ["festive"], occ: ["wedding"], b: "BULK SETS", r: 4.7, rev: 940 }),
  mk({ name: "Board Exam Survivor", p: ["BOARD EXAM","SURVIVOR"], g: "✏️", f: "mono", fit: "regular", c: "acid", cat: ["humour"], occ: ["exams"], r: 4.5, rev: 610 }),
  mk({ name: "Aggressively Single", p: ["AGGRESSIVELY","SINGLE"], g: "🥲", f: "bebas", fit: "oversized", c: "charcoal", cat: ["humour"], occ: ["valentine"], r: 4.6, rev: 1280 }),
  mk({ name: "Gaay Nikli Hai", p: ["GAAY","NIKLI HAI"], g: "🐄", f: "marker", fit: "oversized", c: "white", cat: ["animals","humour"], b: "BESTSELLER", r: 4.9, rev: 2860, d: "Traffic in India has one universal override and this is it." }),
  mk({ name: "Allah Ki Gaay", p: ["अल्लाह की","गाय"], g: "🐄", f: "rozha", fit: "oversized", c: "offwhite", pr: 899, aud: ["unisex"], cat: ["humour","animals"], b: "IDIOM", r: 4.8, rev: 420, d: "Hinglish for the most harmless person in the room — bhola-bhala, soft-hearted, will not hurt a fly. An idiom about temperament, not a jab at anyone." }),
  mk({ name: "Desi Cow Club", p: ["DESI COW","CLUB"], g: "🐄", f: "anton", fit: "oversized", c: "mint", cat: ["animals"], bd: "burst", bdc: "#FFFFFF", r: 4.8, rev: 1440 }),
  mk({ name: "Gir Cow Gang", p: ["GIR COW","GANG"], g: "🐄", f: "bebas", fit: "regular", c: "sand", cat: ["animals","regional"], r: 4.6, rev: 505 }),
  mk({ name: "Nandi Approved", p: ["NANDI","APPROVED"], g: "🐂", f: "rozha", fit: "regular", c: "bottle", cat: ["animals"], r: 4.7, rev: 618 }),
  mk({ name: "Buffalo Energy", p: ["BUFFALO","ENERGY"], g: "🐃", f: "anton", fit: "oversized", c: "charcoal", cat: ["animals","humour"], r: 4.5, rev: 402 }),
  mk({ name: "Street Dog Supporter", p: ["STREET DOG","SUPPORTER"], g: "🐕", f: "grotesk", fit: "regular", c: "offwhite", cat: ["animals"], b: "2% TO SHELTERS", r: 4.9, rev: 1830 }),
  mk({ name: "Adopt, Do Not Shop", p: ["ADOPT.","DO NOT SHOP."], g: "🐈", f: "mono", fit: "oversized", c: "black", cat: ["animals","statement"], r: 4.9, rev: 2110 }),
  mk({ name: "Elephant In The Room", p: ["ELEPHANT IN","THE ROOM"], g: "🐘", f: "playfair", fit: "oversized", c: "lavender", cat: ["animals","humour"], r: 4.6, rev: 720 }),
  mk({ name: "Peacock Dance", p: ["PEACOCK","DANCE"], g: "🦚", f: "playfair", fit: "crop", c: "teal", aud: ["women"], cat: ["animals","women"], r: 4.7, rev: 640 }),
  mk({ name: "Tiger Country", p: ["TIGER","COUNTRY"], g: "🐅", f: "anton", fit: "oversized", c: "olive", cat: ["animals"], r: 4.8, rev: 1305 }),
  mk({ name: "Bandar Sabha", p: ["BANDAR","SABHA"], g: "🐒", f: "marker", fit: "regular", c: "mustard", cat: ["animals","humour"], r: 4.5, rev: 388 }),
  mk({ name: "Camel Ka Safar", p: ["CAMEL KA","SAFAR"], g: "🐪", f: "bebas", fit: "regular", c: "sand", cat: ["animals","travel","regional"], r: 4.4, rev: 244 }),
  mk({ name: "Goat Mode", p: ["GOAT","MODE"], g: "🐐", f: "anton", fit: "oversized", c: "chilli", cat: ["animals","humour","sports"], r: 4.6, rev: 830 }),
  mk({ name: "Crow Ka Confidence", p: ["CROW KA","CONFIDENCE"], g: "🐦", f: "mono", fit: "regular", c: "charcoal", cat: ["animals","humour"], r: 4.5, rev: 291 }),
  mk({ name: "Snake Charmer, Retired", p: ["SNAKE CHARMER","(RETIRED)"], g: "🐍", f: "marker", fit: "oversized", c: "bottle", cat: ["animals","humour"], r: 4.4, rev: 205 }),
  mk({ name: "Bee Kind", p: ["BEE","KIND"], g: "🐝", f: "anton", fit: "oversized", c: "mustard", cat: ["insects","statement"], bd: "burst", bdc: "#FFFFFF", b: "BESTSELLER", r: 4.8, rev: 1720 }),
  mk({ name: "Titli Effect", p: ["TITLI","EFFECT"], g: "🦋", f: "playfair", fit: "crop", c: "lavender", aud: ["women"], cat: ["insects","women"], r: 4.7, rev: 910 }),
  mk({ name: "Butterfly Migration", p: ["BUTTERFLY","MIGRATION"], g: "🦋", f: "grotesk", fit: "regular", c: "powder", cat: ["insects"], r: 4.6, rev: 470 }),
  mk({ name: "Cockroach Survivor", p: ["COCKROACH","SURVIVOR"], g: "🪳", f: "mono", fit: "oversized", c: "black", cat: ["insects","humour"], r: 4.7, rev: 1188, d: "Outlived the dinosaurs, will outlive your quarterly targets." }),
  mk({ name: "Mosquito Ka Dushman", p: ["MOSQUITO KA","DUSHMAN"], g: "🦟", f: "marker", fit: "regular", c: "mint", cat: ["insects","humour"], occ: ["monsoon"], r: 4.5, rev: 522 }),
  mk({ name: "Ant Army", p: ["ANT","ARMY"], g: "🐜", f: "anton", fit: "regular", c: "maroon", cat: ["insects"], r: 4.4, rev: 316 }),
  mk({ name: "Ladybug Luck", p: ["LADYBUG","LUCK"], g: "🐞", f: "playfair", fit: "kids", c: "chilli", aud: ["kids"], cat: ["insects","kids"], r: 4.8, rev: 640 }),
  mk({ name: "Jugnu Squad", p: ["JUGNU","SQUAD"], g: "✨", f: "rozha", fit: "oversized", c: "indigo", cat: ["insects"], r: 4.6, rev: 428 }),
  mk({ name: "Jheenguur Choir", p: ["JHEENGUUR","CHOIR"], g: "🦗", f: "mono", fit: "regular", c: "olive", cat: ["insects","music"], r: 4.3, rev: 180 }),
  mk({ name: "Beetle Brigade", p: ["BEETLE","BRIGADE"], g: "🪲", f: "bebas", fit: "oversized", c: "teal", cat: ["insects"], r: 4.5, rev: 366 }),
  mk({ name: "Makdi Ka Jaal", p: ["MAKDI KA","JAAL"], g: "🕷", f: "marker", fit: "regular", c: "charcoal", cat: ["insects","humour"], r: 4.4, rev: 240 }),
  mk({ name: "Honey Economy", p: ["HONEY","ECONOMY"], g: "🍯", f: "playfair", fit: "regular", c: "mustard", cat: ["insects","foodie"], r: 4.6, rev: 405 }),
  mk({ name: "Silkworm Story", p: ["SILKWORM","STORY"], g: "🐛", f: "grotesk", fit: "regular", c: "sand", cat: ["insects"], r: 4.4, rev: 199 }),
  mk({ name: "Pyaar Hi Pyaar Hai", p: ["PYAAR HI","PYAAR HAI"], g: "🏳️‍🌈", f: "rozha", fit: "oversized", c: "white", pr: 949, aud: ["pride","unisex"], cat: ["pride","statement"], b: "PRIDE", r: 4.9, rev: 1980, d: "Love is love, said in the language most of our customers argue with their families in." }),
  mk({ name: "Proud & Desi", p: ["PROUD","& DESI"], g: "🌈", f: "anton", fit: "oversized", c: "lavender", aud: ["pride","unisex"], cat: ["pride"], r: 4.9, rev: 1540 }),
  mk({ name: "Chosen Family", p: ["CHOSEN","FAMILY"], g: "🫂", f: "playfair", fit: "regular", c: "rose", aud: ["pride","unisex"], cat: ["pride"], r: 4.8, rev: 1122 }),
  mk({ name: "Trans Rights Now", p: ["TRANS RIGHTS","NOW"], g: "🏳️‍⚧️", f: "bebas", fit: "oversized", c: "powder", aud: ["pride","unisex"], cat: ["pride","civic"], r: 4.9, rev: 1360 }),
  mk({ name: "They / Them & Proud", p: ["THEY / THEM","& PROUD"], f: "mono", fit: "regular", c: "black", aud: ["pride","unisex"], cat: ["pride","typography"], r: 4.8, rev: 880 }),
  mk({ name: "Queer Aur Clear", p: ["QUEER AUR","CLEAR"], g: "🌈", f: "marker", fit: "crop", c: "mint", aud: ["pride","women"], cat: ["pride","women"], r: 4.7, rev: 640 }),
  mk({ name: "Rainbow Riwaaz", p: ["RAINBOW","RIWAAZ"], g: "🌈", f: "rozha", fit: "oversized", c: "offwhite", aud: ["pride","unisex"], cat: ["pride"], r: 4.8, rev: 720 }),
  mk({ name: "Ally, Not Audience", p: ["ALLY, NOT","AUDIENCE"], g: "🤝", f: "grotesk", fit: "regular", c: "teal", aud: ["pride","unisex"], cat: ["pride","statement"], r: 4.7, rev: 560 }),
  mk({ name: "Apne Rang Mein", p: ["APNE RANG","MEIN"], g: "🎨", f: "playfair", fit: "oversized", c: "coral", aud: ["pride","unisex"], cat: ["pride"], r: 4.8, rev: 690 }),
  mk({ name: "2018 — Struck Down", p: ["2018","STRUCK DOWN"], g: "⚖️", f: "mono", fit: "regular", c: "indigo", aud: ["pride","unisex"], cat: ["pride","civic"], r: 4.9, rev: 1015, d: "The year Section 377 was read down. A date tee, because dates are hard to argue with." }),
  mk({ name: "Ladki Hoon, Lad Sakti Hoon", p: ["LADKI HOON,","LAD SAKTI HOON"], g: "✊", f: "rozha", fit: "oversized", c: "chilli", aud: ["women"], cat: ["women","statement","civic"], b: "BESTSELLER", r: 4.9, rev: 2240 }),
  mk({ name: "Apni Marzi", p: ["APNI","MARZI"], f: "anton", fit: "crop", c: "black", aud: ["women"], cat: ["women","typography"], r: 4.8, rev: 1180 }),
  mk({ name: "Not Your Behenji", p: ["NOT YOUR","BEHENJI"], g: "💅", f: "marker", fit: "crop", c: "rose", aud: ["women"], cat: ["women","humour"], r: 4.6, rev: 705 }),
  mk({ name: "Beti Padhao, Sawaal Uthao", p: ["BETI PADHAO","SAWAAL UTHAO"], g: "📚", f: "rozha", fit: "regular", c: "mustard", aud: ["women"], cat: ["women","civic"], r: 4.8, rev: 990 }),
  mk({ name: "Zidd Hai", p: ["ZIDD","HAI"], f: "anton", fit: "oversized", c: "maroon", aud: ["women"], cat: ["women","typography"], r: 4.7, rev: 615 }),
  mk({ name: "Boss Lady, Desi Edition", p: ["BOSS LADY","DESI EDITION"], g: "👑", f: "playfair", fit: "regular", c: "lavender", aud: ["women"], cat: ["women","work"], r: 4.6, rev: 540 }),
  mk({ name: "Chhota Packet Bada Dhamaka", p: ["CHHOTA PACKET","BADA DHAMAKA"], g: "🎁", f: "marker", fit: "kids", c: "coral", aud: ["kids"], cat: ["kids","humour"], b: "KIDS PICK", r: 4.9, rev: 1440 }),
  mk({ name: "Homework Ka Dushman", p: ["HOMEWORK","KA DUSHMAN"], g: "📕", f: "bebas", fit: "kids", c: "powder", aud: ["kids"], cat: ["kids","humour"], occ: ["exams"], r: 4.7, rev: 820 }),
  mk({ name: "Future Scientist", p: ["FUTURE","SCIENTIST"], g: "🔬", f: "mono", fit: "kids", c: "white", aud: ["kids"], cat: ["kids"], r: 4.8, rev: 660 }),
  mk({ name: "Mummy Ka Boss", p: ["MUMMY KA","BOSS"], g: "👶", f: "marker", fit: "kids", c: "mint", aud: ["kids"], cat: ["kids","humour"], r: 4.8, rev: 905 }),
  mk({ name: "Dino Dost", p: ["DINO","DOST"], g: "🦕", f: "anton", fit: "kids", c: "bottle", aud: ["kids"], cat: ["kids","animals"], r: 4.9, rev: 1180 }),
  mk({ name: "Rocket Bacha", p: ["ROCKET","BACHA"], g: "🚀", f: "bebas", fit: "kids", c: "indigo", aud: ["kids"], cat: ["kids"], r: 4.7, rev: 540 }),
  mk({ name: "Ice Cream First", p: ["ICE CREAM","FIRST"], g: "🍦", f: "marker", fit: "kids", c: "rose", aud: ["kids"], cat: ["kids","foodie"], r: 4.8, rev: 730 }),
  mk({ name: "Chhota Cow, Bada Dil", p: ["CHHOTA COW","BADA DIL"], g: "🐄", f: "marker", fit: "kids", c: "mustard", aud: ["kids"], cat: ["kids","animals"], r: 4.9, rev: 1005 }),
  mk({ name: "Dilli Wala", p: ["DILLI","WALA"], g: "🚇", f: "anton", fit: "oversized", c: "charcoal", cat: ["regional"], r: 4.6, rev: 880 }),
  mk({ name: "Bombay Local", p: ["BOMBAY","LOCAL"], g: "🚆", f: "bebas", fit: "oversized", c: "indigo", cat: ["regional","travel"], r: 4.7, rev: 1140 }),
  mk({ name: "Namma Bengaluru", p: ["NAMMA","BENGALURU"], g: "🌳", f: "grotesk", fit: "regular", c: "bottle", cat: ["regional"], r: 4.6, rev: 760 }),
  mk({ name: "Kolkata Cha", p: ["KOLKATA","CHA"], g: "🫖", f: "playfair", fit: "regular", c: "offwhite", cat: ["regional","foodie"], r: 4.7, rev: 690 }),
  mk({ name: "Chennai Super Filter", p: ["CHENNAI","SUPER FILTER"], g: "☕", f: "bebas", fit: "regular", c: "sand", cat: ["regional","foodie"], r: 4.6, rev: 605 }),
  mk({ name: "Hyderabadi Nawabi", p: ["HYDERABADI","NAWABI"], g: "🕌", f: "rozha", fit: "oversized", c: "maroon", cat: ["regional"], r: 4.7, rev: 810 }),
  mk({ name: "Jaipur Pink", p: ["JAIPUR","PINK"], g: "🏰", f: "playfair", fit: "crop", c: "rose", aud: ["women"], cat: ["regional","women"], r: 4.6, rev: 470 }),
  mk({ name: "Northeast Pride", p: ["NORTHEAST","PRIDE"], g: "⛰️", f: "anton", fit: "oversized", c: "teal", cat: ["regional"], r: 4.8, rev: 590 }),
  mk({ name: "Ek Aur Over", p: ["EK AUR","OVER"], g: "🏏", f: "anton", fit: "oversized", c: "white", cat: ["sports"], occ: ["ipl"], b: "MATCH DAY", r: 4.8, rev: 1620 }),
  mk({ name: "Stadium Wali Feeling", p: ["STADIUM WALI","FEELING"], g: "🏟", f: "bebas", fit: "oversized", c: "chilli", cat: ["sports"], occ: ["ipl"], r: 4.7, rev: 1010 }),
  mk({ name: "Gully Cricket Legend", p: ["GULLY CRICKET","LEGEND"], g: "🏏", f: "marker", fit: "regular", c: "mustard", cat: ["sports","humour"], occ: ["ipl"], r: 4.7, rev: 880 }),
  mk({ name: "Kabaddi Breath", p: ["KABADDI","BREATH"], g: "🤼", f: "anton", fit: "regular", c: "olive", cat: ["sports"], r: 4.5, rev: 320 }),
  mk({ name: "Sleeper Class Stories", p: ["SLEEPER CLASS","STORIES"], g: "🚂", f: "mono", fit: "oversized", c: "sand", cat: ["travel"], r: 4.7, rev: 940 }),
  mk({ name: "Window Seat Only", p: ["WINDOW SEAT","ONLY"], g: "🪟", f: "grotesk", fit: "regular", c: "powder", cat: ["travel"], r: 4.6, rev: 620 }),
  mk({ name: "Bullet Pe Ladakh", p: ["BULLET PE","LADAKH"], g: "🏍", f: "bebas", fit: "oversized", c: "charcoal", cat: ["travel"], r: 4.8, rev: 1180 }),
  mk({ name: "Bass Bhai Bass", p: ["BASS BHAI","BASS"], g: "🔊", f: "anton", fit: "oversized", c: "black", cat: ["music"], r: 4.6, rev: 705 }),
  mk({ name: "Qawwali Nights", p: ["QAWWALI","NIGHTS"], g: "🎶", f: "rozha", fit: "regular", c: "bottle", cat: ["music"], r: 4.7, rev: 512 }),
  mk({ name: "Auto Wale Ka Playlist", p: ["AUTO WALE KA","PLAYLIST"], g: "🎵", f: "marker", fit: "regular", c: "saffron", cat: ["music","humour","travel"], r: 4.6, rev: 640 }),
  mk({ name: "Kuch Nahi", p: ["KUCH","NAHI"], f: "anton", fit: "oversized", c: "offwhite", cat: ["typography"], r: 4.5, rev: 388 }),
  mk({ name: "Theek Hai", p: ["THEEK","HAI"], f: "bebas", fit: "regular", c: "acid", cat: ["typography","humour"], r: 4.4, rev: 290 }),
  mk({ name: "Achha Sun", p: ["ACHHA","SUN"], f: "rozha", fit: "oversized", c: "white", cat: ["typography"], r: 4.6, rev: 460 }),
  mk({ name: "Chal Bhai", p: ["CHAL","BHAI"], f: "marker", fit: "regular", c: "coral", cat: ["typography","humour"], r: 4.5, rev: 350 }),
  mk({ name: "Hai Na?", p: ["HAI","NA?"], f: "playfair", fit: "crop", c: "lavender", aud: ["women"], cat: ["typography","women"], r: 4.5, rev: 275 }),
  mk({ name: "Scene On Hai", p: ["SCENE ON","HAI"], f: "mono", fit: "oversized", c: "teal", cat: ["typography"], r: 4.6, rev: 505 }),
  ...REGIONAL_PRODUCTS.map((p) =>
    mk({
      ...p,
      cat: Array.from(new Set([...(p.cat || ['regional']), 'slang', 'regional'])) as CategoryKey[],
    }),
  ),
]

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug)
}

export function filterProducts(filter: ProductFilter = {}): Product[] {
  return PRODUCTS.filter((p) => {
    if (filter.cat && !p.cats.includes(filter.cat as CategoryKey)) return false
    if (filter.fit && p.fit !== filter.fit) return false
    if (filter.occ && !p.occasions.includes(filter.occ as OccasionKey)) return false
    if (
      filter.color &&
      p.color !== filter.color &&
      !p.alsoIn.includes(filter.color as ColorKey)
    )
      return false
    if (filter.aud) {
      const aud = filter.aud as AudienceKey
      const match =
        p.audience.includes(aud) || (aud !== 'kids' && p.audience.includes('unisex'))
      if (!match) return false
    }
    if (filter.state && p.state !== filter.state) return false
    if (filter.region && p.region !== filter.region) return false
    if (filter.q) {
      const q = filter.q.toLowerCase()
      const hay = [p.name, p.desc, p.lang, p.state, p.region, ...p.printLines, ...p.cats]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })
}

export function relatedProducts(product: Product, n = 4): Product[] {
  return PRODUCTS.filter(
    (q) => q.id !== product.id && q.cats.some((c) => product.cats.includes(c)),
  ).slice(0, n)
}

export function bestsellers(n = 8): Product[] {
  return PRODUCTS.slice()
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, n)
}

export function newest(n = 8): Product[] {
  return PRODUCTS.slice().reverse().slice(0, n)
}

export const helpers = {
  bestsellers,
  newest,
  related: relatedProducts,
  money: (n: number) => '₹' + Number(n).toLocaleString('en-IN'),
  discount: (p: Product) => Math.round((1 - p.price / p.mrp) * 100),
  catLabel: (key: string) => CATEGORIES.find((c) => c.key === key)?.label || key,
  occLabel: (key: string) => OCCASIONS.find((o) => o.key === key)?.label || key,
}
