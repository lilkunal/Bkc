import { useEffect, useMemo, useState } from 'react'
import type { Product } from '../data/catalog'
import { reviewTags, reviewsFor } from '../data/reviews'
import { STORE } from '../store.config'
import { Stars } from './Stars'

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>
  const pattern = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return (
    <>
      {text.split(pattern).map((part, i) =>
        i % 2 ? (
          <mark key={i} className="hl">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  )
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(STORE.currency.locale, { day: 'numeric', month: 'short', year: 'numeric' })

/** Product page reviews: rating summary, search with highlighted matches, topic chips and sorting. */
export function ProductReviews({ product }: { product: Product }) {
  const all = useMemo(() => reviewsFor(product), [product])
  const tags = useMemo(() => reviewTags(all), [all])
  const [query, setQuery] = useState('')
  const [tag, setTag] = useState('')
  const [sort, setSort] = useState('recent')
  const [limit, setLimit] = useState(4)

  useEffect(() => {
    setQuery('')
    setTag('')
    setSort('recent')
    setLimit(4)
  }, [product])

  if (!all.length) return null

  const q = query.trim()
  const needle = q.toLowerCase()
  const matches = all.filter((r) => (!tag || r.tags.includes(tag)) && (!needle || `${r.title} ${r.body}`.toLowerCase().includes(needle)))
  const sorted = [...matches].sort((a, b) =>
    sort === 'high' ? b.rating - a.rating : sort === 'low' ? a.rating - b.rating : b.date.localeCompare(a.date),
  )
  const shown = sorted.slice(0, limit)
  const average = product.rating ?? all.reduce((n, r) => n + r.rating, 0) / all.length
  const bars = [5, 4, 3, 2, 1].map((stars) => [stars, all.filter((r) => Math.round(r.rating) === stars).length] as const)

  return (
    <section id="reviews" className="mt-16 scroll-mt-32 border-t border-line pt-12" aria-labelledby="reviews-title">
      <div className="grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-16">
        <div className="grid content-start gap-5">
          <h2 id="reviews-title" className="h-section">
            Reviews
          </h2>
          <div className="flex items-end gap-4">
            <p className="font-display text-6xl font-medium leading-none tabular-nums">{average.toFixed(1)}</p>
            <div className="grid gap-1 pb-1">
              <Stars rating={average} />
              <p className="micro">
                {product.reviews != null ? `${product.reviews.toLocaleString(STORE.currency.locale)} ratings` : `${all.length} reviews`}
              </p>
            </div>
          </div>
          <ul className="grid gap-1.5" aria-label="How the reviews below are rated">
            {bars.map(([stars, n]) => (
              <li key={stars} className="grid grid-cols-[2.4rem_1fr_1.5rem] items-center gap-3 text-xs text-muted">
                <span>{stars} star</span>
                <span className="h-1 bg-line">
                  <span className="block h-full bg-gold" style={{ width: `${(n / all.length) * 100}%` }} />
                </span>
                <span className="text-right tabular-nums">{n}</span>
              </li>
            ))}
          </ul>
          {STORE.demo && <p className="text-xs text-muted">Sample reviews for the demo store, from catalog/reviews.csv.</p>}
        </div>

        <div className="grid min-w-0 content-start gap-6">
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <div className="grid gap-1.5">
              <label htmlFor="review-search" className="field-label">
                Search reviews
              </label>
              <input
                id="review-search"
                type="search"
                className="input"
                placeholder="Try “fit”, “print” or “wash”"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setLimit(4)
                }}
              />
            </div>
            <div className="grid gap-1.5">
              <label htmlFor="review-sort" className="field-label">
                Sort
              </label>
              <select id="review-sort" className="select sm:w-48" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="recent">Most recent</option>
                <option value="high">Highest rated</option>
                <option value="low">Lowest rated</option>
              </select>
            </div>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by topic">
              {tags.map(([t, n]) => (
                <button
                  key={t}
                  type="button"
                  className="chip-btn"
                  aria-pressed={tag === t}
                  onClick={() => {
                    setTag(tag === t ? '' : t)
                    setLimit(4)
                  }}
                >
                  {t} <span className="text-faint">{n}</span>
                </button>
              ))}
            </div>
          )}

          <p className="micro" aria-live="polite">
            Showing {Math.min(limit, matches.length)} of {matches.length} matching review{matches.length === 1 ? '' : 's'}
          </p>

          {shown.length === 0 ? (
            <p className="border border-line bg-surface p-6 text-sm text-muted">No reviews mention that yet. Try another word or topic.</p>
          ) : (
            <ul className="grid border-t border-line">
              {shown.map((r) => (
                <li key={r.id} className="grid gap-2 border-b border-line py-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Stars rating={r.rating} />
                    {r.date && (
                      <time dateTime={r.date} className="micro">
                        {formatDate(r.date)}
                      </time>
                    )}
                  </div>
                  {r.title && (
                    <h3 className="font-medium text-bone">
                      <Highlight text={r.title} query={q} />
                    </h3>
                  )}
                  <p className="max-w-prose text-sm text-muted">
                    <Highlight text={r.body} query={q} />
                  </p>
                  <p className="micro">
                    {r.name}
                    {r.city && ` · ${r.city}`}
                    {r.product === product.id && ' · On this design'}
                  </p>
                </li>
              ))}
            </ul>
          )}

          {sorted.length > limit && (
            <button type="button" className="btn btn-secondary justify-self-start" onClick={() => setLimit((n) => n + 4)}>
              Show more reviews
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
