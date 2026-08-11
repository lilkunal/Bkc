import fs from 'fs'

const raw = fs.readFileSync('_archive/js/data.js', 'utf8')
let body = raw
  .replace(/^[\s\S]*?\(function \(BKC\) \{\s*'use strict';\s*/, '')
  .replace(/\s*BKC\.colors = COLORS;[\s\S]*$/, '')

// Insert Allah Ki Gaay after Gaay Nikli Hai line
if (!body.includes("Allah Ki Gaay")) {
  body = body.replace(
    /(mk\(\{ name: 'Gaay Nikli Hai'[\s\S]*?\}\),)/,
    `$1
    mk({ name: 'Allah Ki Gaay', p: ['अल्लाह की', 'गाय'], g: '🐄', f: 'rozha', fit: 'oversized', c: 'offwhite', pr: 899, aud: ['unisex'], cat: ['humour','animals'], b: 'IDIOM', r: 4.8, rev: 420,
      d: 'Hinglish for the most harmless person in the room — bhola-bhala, soft-hearted, will not hurt a fly. An idiom about temperament, not a jab at anyone.' }),`,
  )
}

const out = `/** Auto-ported catalogue */
${body}

export const COLORS = COLORS;
export const FONTS = FONTS;
export const FITS = FITS;
export const CATEGORIES = CATEGORIES;
export const OCCASIONS = OCCASIONS;
export const COLLECTIONS = COLLECTIONS;
export const PRODUCTS = PRODUCTS;
export const helpers = helpers;

export function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id) || null;
}
export function getProductBySlug(slug) {
  return PRODUCTS.find((p) => p.slug === slug) || null;
}
export function filterProducts(opts = {}) {
  return PRODUCTS.filter((p) => {
    if (opts.fit && p.fit !== opts.fit) return false;
    if (opts.cat && !p.cats.includes(opts.cat)) return false;
    if (opts.aud && !p.audience.includes(opts.aud) && !(opts.aud === 'unisex')) return false;
    if (opts.occ && !p.occasions.includes(opts.occ)) return false;
    if (opts.color && p.color !== opts.color && !(p.alsoIn || []).includes(opts.color)) return false;
    if (opts.q) {
      const q = String(opts.q).toLowerCase();
      const hay = (p.name + ' ' + p.printLines.join(' ') + ' ' + p.cats.join(' ')).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}
`

fs.mkdirSync('src/data', { recursive: true })
// Fix: can't export const COLORS = COLORS from const COLORS - the vars are already declared
const fixed = out
  .replace('export const COLORS = COLORS;', 'export { COLORS, FONTS, FITS, CATEGORIES, OCCASIONS, COLLECTIONS, PRODUCTS, helpers };')
  .replace('export const FONTS = FONTS;\nexport const FITS = FITS;\nexport const CATEGORIES = CATEGORIES;\nexport const OCCASIONS = OCCASIONS;\nexport const COLLECTIONS = COLLECTIONS;\nexport const PRODUCTS = PRODUCTS;\nexport const helpers = helpers;\n', '')

fs.writeFileSync('src/data/catalog.js', fixed)

fs.writeFileSync(
  'src/data/catalog.d.ts',
  `export type Product = {
  id: string
  slug: string
  name: string
  printLines: string[]
  glyph: string
  font: string
  fontKey: string
  fit: string
  color: string
  colorName: string
  teeHex: string
  printHex: string
  backdrop: string
  backdropHex: string
  alsoIn: string[]
  price: number
  mrp: number
  audience: string[]
  cats: string[]
  occasions: string[]
  rating: number
  reviews: number
  badge: string
  desc: string
}
export type Color = { name: string; hex: string; ink: string }
export declare const COLORS: Record<string, Color>
export declare const FONTS: Record<string, string>
export declare const FITS: Record<string, any>
export declare const CATEGORIES: Array<{ key: string; label: string; glyph: string; note: string }>
export declare const OCCASIONS: Array<{ key: string; label: string; when: string; month: number; glyph: string; note: string }>
export declare const COLLECTIONS: Array<{ key: string; label: string; glyph: string; hero: string; note: string; filter: Record<string, string> }>
export declare const PRODUCTS: Product[]
export declare const helpers: any
export function getProductById(id: string): Product | null
export function getProductBySlug(slug: string): Product | null
export function filterProducts(opts?: Record<string, string | undefined>): Product[]
`,
)

console.log('products approx', (fixed.match(/mk\(\{/g) || []).length, 'bytes', fs.statSync('src/data/catalog.js').size)
