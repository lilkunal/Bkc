/**
 * Reviews come from catalog/reviews.csv. A row can belong to one product (product id),
 * to a category (every product in it), or to the whole store (both blank).
 */
import reviewsCsv from '../../catalog/reviews.csv?raw'
import { CATEGORIES, PRODUCTS, type Product } from './catalog'
import { parseCsv, type SheetIssue } from './sheet'

export interface Review {
  id: string
  product: string
  category: string
  name: string
  city: string
  rating: number
  title: string
  body: string
  tags: string[]
  /** ISO date, or '' when the sheet has none. */
  date: string
  featured: boolean
}

export interface ReviewSheet {
  reviews: Review[]
  errors: SheetIssue[]
  warnings: SheetIssue[]
  rowCount: number
}

const REQUIRED = ['name', 'rating', 'body']

const ALIASES: Record<string, string> = {
  product_id: 'product',
  sku: 'product',
  id: 'product',
  stars: 'rating',
  review: 'body',
  text: 'body',
  comment: 'body',
  headline: 'title',
  location: 'city',
  keywords: 'tags',
  topics: 'tags',
}

export function reviewsFromSheet(csv: string, productIds: Set<string>, categoryKeys: Set<string>): ReviewSheet {
  const rows = parseCsv(csv)
  const errors: SheetIssue[] = []
  const warnings: SheetIssue[] = []
  if (!rows.length) return { reviews: [], errors, warnings, rowCount: 0 }

  const header = rows[0].map((h) => {
    const key = h.trim().toLowerCase().replace(/[\s-]+/g, '_')
    return ALIASES[key] ?? key
  })
  const missing = REQUIRED.filter((c) => !header.includes(c))
  if (missing.length) {
    errors.push({ row: 1, message: `Missing required column(s): ${missing.join(', ')}.` })
    return { reviews: [], errors, warnings, rowCount: rows.length - 1 }
  }

  const reviews: Review[] = []
  rows.slice(1).forEach((cells, i) => {
    const row = i + 2
    const get = (column: string) => (header.includes(column) ? (cells[header.indexOf(column)] ?? '').trim() : '')

    const name = get('name')
    const body = get('body')
    if (!name || !body) {
      errors.push({ row, column: name ? 'body' : 'name', message: 'A review needs a name and a body.' })
      return
    }
    const rating = Number(get('rating'))
    if (!(rating >= 1 && rating <= 5)) {
      errors.push({ row, column: 'rating', message: `Rating "${get('rating')}" should be a number from 1 to 5.` })
      return
    }

    let product = get('product')
    if (product && !productIds.has(product)) {
      warnings.push({ row, column: 'product', message: `No product with id "${product}"; shown as a store-wide review.` })
      product = ''
    }
    let category = get('category').toLowerCase()
    if (category && !categoryKeys.has(category)) {
      warnings.push({ row, column: 'category', message: `Unknown category "${category}"; shown as a store-wide review.` })
      category = ''
    }
    let date = get('date')
    if (date && Number.isNaN(Date.parse(date))) {
      warnings.push({ row, column: 'date', message: `Date "${date}" should look like 2026-08-14.` })
      date = ''
    }

    reviews.push({
      id: `review-${row}`,
      product,
      category,
      name,
      city: get('city'),
      rating,
      title: get('title'),
      body,
      tags: get('tags')
        .split('|')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
      date,
      featured: /^(yes|y|true|1)$/i.test(get('featured')),
    })
  })

  return { reviews, errors, warnings, rowCount: rows.length - 1 }
}

export const REVIEW_SHEET = reviewsFromSheet(reviewsCsv, new Set(PRODUCTS.map((p) => p.id)), new Set(CATEGORIES.map((c) => c.key)))
export const REVIEWS = REVIEW_SHEET.reviews

const newestFirst = (a: Review, b: Review) => b.date.localeCompare(a.date)

/** Reviews for a product page: its own first, then its categories', then store-wide ones. */
export function reviewsFor(product: Product, max = 12): Review[] {
  const own = REVIEWS.filter((r) => r.product === product.id).sort(newestFirst)
  const category = REVIEWS.filter((r) => !r.product && r.category && product.cats.includes(r.category)).sort(newestFirst)
  const store = REVIEWS.filter((r) => !r.product && !r.category).sort(newestFirst)
  return [...own, ...category, ...store].slice(0, max)
}

/** Rows marked featured, or the best-rated ones when none are. */
export function featuredReviews(n = 9): Review[] {
  const featured = REVIEWS.filter((r) => r.featured)
  return (featured.length ? featured : REVIEWS.filter((r) => r.rating >= 4)).sort(newestFirst).slice(0, n)
}

/** Most mentioned tags across a set of reviews. */
export function reviewTags(list: Review[], n = 8): [tag: string, count: number][] {
  const counts = new Map<string, number>()
  for (const r of list) for (const t of r.tags) counts.set(t, (counts.get(t) ?? 0) + 1)
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, n)
}
