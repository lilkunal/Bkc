/**
 * Turns the product sheet (catalog/products.csv) into typed products.
 * Pure functions: the site, the build check and the tests all use this.
 */

import { GARMENTS, fitInfo, isGarmentType, type GarmentType } from './garments'
import { resolveColour, normaliseHex, type Colour } from './palette'

export interface Product {
  id: string
  slug: string
  name: string
  type: GarmentType
  cats: string[]
  price: number
  /** Compare-at ("was") price. Equals `price` when the sheet has none. */
  mrp: number
  color: string
  colorName: string
  teeHex: string
  printHex: string
  alsoIn: string[]
  fit: string
  sizes: string[]
  printLines: string[]
  font: string
  fontKey: string
  glyph: string
  backdrop: string
  backdropHex: string
  /** Optional product photo; when empty the site renders a mockup. */
  image: string
  desc: string
  badge: string
  rating: number | null
  reviews: number | null
  audience: string[]
  occasions: string[]
  state?: string
  region?: string
  lang?: string
  featured: boolean
}

export interface Category {
  key: string
  label: string
  note: string
}

export interface SheetIssue {
  row: number
  column?: string
  message: string
}

export interface SheetContext {
  /** Print font key → CSS font-family. */
  fonts: Record<string, string>
  defaultFont: string
  /** Known category keys with display labels and notes. */
  categoryInfo: Record<string, { label: string; note: string }>
}

export interface SheetResult {
  products: Product[]
  categories: Category[]
  colours: Record<string, Colour>
  errors: SheetIssue[]
  warnings: SheetIssue[]
  rowCount: number
}

export const BACKDROPS = ['none', 'burst', 'ring', 'box', 'banner', 'star']

/** Header aliases, so "Color", "MRP" or "Image URL" still map to the right column. */
const HEADER_ALIASES: Record<string, string> = {
  color: 'colour',
  colours: 'other_colours',
  other_colors: 'other_colours',
  title: 'name',
  product: 'name',
  product_name: 'name',
  categories: 'category',
  sale_price: 'price',
  mrp: 'compare_at_price',
  compare_at: 'compare_at_price',
  was_price: 'compare_at_price',
  image_url: 'image',
  photo: 'image',
  lang: 'language',
  print_text: 'print_lines',
  print_color: 'print_ink',
  print_backdrop_color: 'print_backdrop_colour',
  desc: 'description',
}

/** RFC 4180 CSV parsing. Detects comma, semicolon or tab separators and strips a UTF-8 BOM. */
export function parseCsv(input: string): string[][] {
  const text = input.charCodeAt(0) === 0xfeff ? input.slice(1) : input
  const firstLine = text.slice(0, text.search(/\r?\n|$/))
  const counts = { ',': firstLine.split(',').length, ';': firstLine.split(';').length, '\t': firstLine.split('\t').length }
  const sep = (Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]) as ',' | ';' | '\t'

  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"'
          i++
        } else quoted = false
      } else cell += ch
    } else if (ch === '"' && cell === '') {
      quoted = true
    } else if (ch === sep) {
      row.push(cell)
      cell = ''
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
    } else cell += ch
  }
  if (cell !== '' || row.length) {
    row.push(cell)
    rows.push(row)
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ''))
}

const list = (v: string) =>
  v
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean)

export const slugify = (v: string) =>
  v
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')

const toNumber = (v: string) => Number(v.replace(/[₹$€£,\s]/g, ''))

const titleCase = (v: string) => v.replace(/[-_]+/g, ' ').replace(/\b\p{L}/gu, (c) => c.toUpperCase())

export function productsFromSheet(csv: string, ctx: SheetContext): SheetResult {
  const table = parseCsv(csv)
  const errors: SheetIssue[] = []
  const warnings: SheetIssue[] = []
  const products: Product[] = []
  const colours: Record<string, Colour> = {}
  const categoryOrder: string[] = []
  const categoryLabels: Record<string, string> = {}

  if (table.length === 0) {
    errors.push({ row: 1, message: 'The sheet is empty. The first row must be the column headers.' })
    return { products, categories: [], colours, errors, warnings, rowCount: 0 }
  }

  const header = table[0].map((h) => {
    const k = h.trim().toLowerCase().replace(/[\s-]+/g, '_')
    return HEADER_ALIASES[k] ?? k
  })
  for (const required of ['name', 'price']) {
    if (!header.includes(required)) errors.push({ row: 1, column: required, message: `Missing required column "${required}".` })
  }
  if (errors.length) return { products, categories: [], colours, errors, warnings, rowCount: table.length - 1 }

  const seenIds = new Set<string>()
  const seenSlugs = new Set<string>()

  table.slice(1).forEach((cells, index) => {
    const row = index + 2
    const get = (col: string) => {
      const i = header.indexOf(col)
      return i >= 0 ? (cells[i] ?? '').trim() : ''
    }
    const warn = (column: string, message: string) => warnings.push({ row, column, message })
    const fail = (column: string, message: string) => errors.push({ row, column, message })

    const name = get('name')
    if (!name) return fail('name', 'Product name is empty; row skipped.')

    const typeRaw = get('type').toLowerCase() || 'tee'
    if (!isGarmentType(typeRaw)) {
      return fail('type', `Unknown garment type "${typeRaw}". Use one of: ${Object.keys(GARMENTS).join(', ')}.`)
    }
    const type: GarmentType = typeRaw

    const price = toNumber(get('price'))
    if (!Number.isFinite(price) || price <= 0) return fail('price', `Price "${get('price')}" is not a positive number; row skipped.`)

    let id = get('id')
    if (!id) {
      id = `P-${row}`
      warn('id', `No id, so "${id}" was assigned. Give every product a permanent id so links don't change.`)
    }
    if (seenIds.has(id)) return fail('id', `Duplicate id "${id}"; row skipped.`)
    seenIds.add(id)

    let slug = slugify(name) || id.toLowerCase()
    for (let n = 2; seenSlugs.has(slug); n++) slug = `${slugify(name)}-${n}`
    seenSlugs.add(slug)

    let mrp = price
    if (get('compare_at_price')) {
      const compare = toNumber(get('compare_at_price'))
      if (Number.isFinite(compare) && compare > price) mrp = compare
      else warn('compare_at_price', `Compare-at price "${get('compare_at_price')}" must be higher than the price; ignored.`)
    }

    let colour = resolveColour(get('colour') || 'white')
    if (!colour) {
      warn('colour', `Unknown colour "${get('colour')}"; using Chalk White. Use a palette name or a hex code like #1C5B49.`)
      colour = resolveColour('white')!
    }
    colours[colour.key] = colour

    const alsoIn: string[] = []
    for (const value of list(get('other_colours'))) {
      const c = resolveColour(value)
      if (!c) {
        warn('other_colours', `Unknown colour "${value}"; skipped.`)
        continue
      }
      colours[c.key] = c
      if (c.key !== colour.key && !alsoIn.includes(c.key)) alsoIn.push(c.key)
    }

    const garment = GARMENTS[type]
    let fit = get('fit').toLowerCase() || garment.defaultFit
    if (!garment.fits[fit]) {
      warn('fit', `"${fit}" isn't a ${garment.label.toLowerCase()} fit (${Object.keys(garment.fits).join(', ')}); using ${garment.defaultFit}.`)
      fit = garment.defaultFit
    }
    const sizes = list(get('sizes'))

    let fontKey = get('print_font').toLowerCase() || ctx.defaultFont
    if (!ctx.fonts[fontKey]) {
      warn('print_font', `Unknown print font "${fontKey}" (${Object.keys(ctx.fonts).join(', ')}); using ${ctx.defaultFont}.`)
      fontKey = ctx.defaultFont
    }

    let printHex = colour.ink
    if (get('print_ink')) {
      const hex = normaliseHex(get('print_ink'))
      if (hex) printHex = hex
      else warn('print_ink', `Print ink "${get('print_ink')}" isn't a hex colour; using the default ink.`)
    }

    let backdrop = get('print_backdrop').toLowerCase() || 'none'
    if (!BACKDROPS.includes(backdrop)) {
      warn('print_backdrop', `Unknown backdrop "${backdrop}" (${BACKDROPS.join(', ')}); using none.`)
      backdrop = 'none'
    }

    let rating: number | null = null
    if (get('rating')) {
      const r = toNumber(get('rating'))
      if (Number.isFinite(r) && r >= 0 && r <= 5) rating = r
      else warn('rating', `Rating "${get('rating')}" must be between 0 and 5; ignored.`)
    }
    let reviews: number | null = null
    if (get('reviews')) {
      const n = toNumber(get('reviews'))
      if (Number.isInteger(n) && n >= 0) reviews = n
      else warn('reviews', `Review count "${get('reviews')}" must be a whole number; ignored.`)
    }

    const cats: string[] = []
    for (const value of list(get('category'))) {
      const known = ctx.categoryInfo[value.toLowerCase()] ? value.toLowerCase() : null
      const key = known ?? slugify(value)
      if (!key || cats.includes(key)) continue
      cats.push(key)
      if (!categoryOrder.includes(key)) categoryOrder.push(key)
      if (!categoryLabels[key]) {
        categoryLabels[key] = ctx.categoryInfo[key]?.label ?? (/\s|[A-Z]/.test(value) ? value : titleCase(value))
      }
    }

    products.push({
      id,
      slug,
      name,
      type,
      cats,
      price,
      mrp,
      color: colour.key,
      colorName: colour.name,
      teeHex: colour.hex,
      printHex,
      alsoIn,
      fit,
      sizes: sizes.length ? sizes : fitInfo(type, fit).sizes,
      printLines: list(get('print_lines')).slice(0, 3),
      font: ctx.fonts[fontKey],
      fontKey,
      glyph: get('print_glyph'),
      backdrop,
      backdropHex: normaliseHex(get('print_backdrop_colour')) ?? '',
      image: get('image'),
      desc: get('description'),
      badge: get('badge'),
      rating,
      reviews,
      audience: list(get('audience')).map((a) => a.toLowerCase()),
      occasions: list(get('occasions')).map((o) => o.toLowerCase()),
      state: get('state').toLowerCase() || undefined,
      region: get('region').toLowerCase() || undefined,
      lang: get('language') || undefined,
      featured: /^(yes|y|true|1)$/i.test(get('featured')),
    })
  })

  const known = Object.keys(ctx.categoryInfo).filter((k) => categoryOrder.includes(k))
  const extra = categoryOrder.filter((k) => !ctx.categoryInfo[k])
  const categories = [...known, ...extra].map((key) => ({
    key,
    label: categoryLabels[key],
    note: ctx.categoryInfo[key]?.note ?? '',
  }))

  return { products, categories, colours, errors, warnings, rowCount: table.length - 1 }
}
