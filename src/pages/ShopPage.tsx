import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  CATEGORIES,
  COLORS,
  FITS,
  OCCASIONS,
  PRODUCTS,
  filterProducts,
} from '../data/catalog'
import { ProductCard, SectionHead } from '../components/ProductCard'

export function ShopPage() {
  const [params, setParams] = useSearchParams()
  const [sheet, setSheet] = useState(false)

  const filters = {
    fit: params.get('fit') || '',
    cat: params.get('cat') || '',
    occ: params.get('occ') || '',
    aud: params.get('aud') || '',
    color: params.get('color') || '',
    q: params.get('q') || '',
    sort: params.get('sort') || 'featured',
  }

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (!value) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const results = useMemo(() => {
    let list = filterProducts({
      fit: filters.fit || undefined,
      cat: filters.cat || undefined,
      occ: filters.occ || undefined,
      aud: filters.aud || undefined,
      color: filters.color || undefined,
      q: filters.q || undefined,
    })
    if (filters.sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price)
    if (filters.sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
    if (filters.sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating)
    if (filters.sort === 'reviews') list = [...list].sort((a, b) => b.reviews - a.reviews)
    return list
  }, [filters.fit, filters.cat, filters.occ, filters.aud, filters.color, filters.q, filters.sort])

  const FilterFields = (
    <div className="flex flex-col gap-4">
      <label className="block text-xs uppercase tracking-wide">
        Search
        <input
          name="q"
          value={filters.q}
          onChange={(e) => set('q', e.target.value)}
          className="mt-1 min-h-11 w-full border-2 border-ink bg-cream px-3"
          placeholder="Maggi, vote, gaay…"
        />
      </label>
      {(
        [
          ['fit', 'Fit', Object.values(FITS).map((f) => [f.key, f.label] as [string, string])],
          ['cat', 'Category', CATEGORIES.map((c) => [c.key, c.label] as [string, string])],
          ['occ', 'Occasion', OCCASIONS.map((o) => [o.key, o.label] as [string, string])],
          [
            'aud',
            'Wearer',
            [
              ['men', 'Men'],
              ['women', 'Women'],
              ['unisex', 'Unisex'],
              ['kids', 'Kids'],
            ] as [string, string][],
          ],
          ['color', 'Colour', Object.entries(COLORS).map(([k, v]) => [k, v.name] as [string, string])],
        ] as const
      ).map(([key, label, opts]) => (
        <label key={key} className="block text-xs uppercase tracking-wide">
          {label}
          <select
            name={key}
            value={(filters as Record<string, string>)[key]}
            onChange={(e) => set(key, e.target.value)}
            className="mt-1 min-h-11 w-full border-2 border-ink bg-cream px-2"
          >
            <option value="">All</option>
            {opts.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
      ))}
      <button
        type="button"
        className="min-h-11 border-2 border-ink text-sm underline"
        onClick={() => setParams({}, { replace: true })}
      >
        Clear all filters
      </button>
    </div>
  )

  return (
    <div className="mx-auto max-w-[1440px] px-[clamp(1rem,0.5rem+2vw,3rem)] py-8 md:py-12">
      <SectionHead
        eyebrow={`Catalogue · ${PRODUCTS.length} designs`}
        title="Shop everything"
        note="Cross-filter by fit, taste, occasion, wearer and colour. Filters live in the URL."
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="min-h-11 border-2 border-ink bg-marigold px-4 font-bold uppercase md:hidden"
          onClick={() => setSheet(true)}
        >
          Filters
        </button>
        <p className="text-sm text-ink-70">
          <b>{results.length}</b> result{results.length === 1 ? '' : 's'}
        </p>
        <label className="ml-auto flex items-center gap-2 text-sm">
          Sort
          <select
            name="sort"
            value={filters.sort}
            onChange={(e) => set('sort', e.target.value)}
            className="min-h-11 border-2 border-ink bg-cream px-2"
          >
            <option value="featured">Featured</option>
            <option value="reviews">Most reviewed</option>
            <option value="rating">Top rated</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
          </select>
        </label>
      </div>

      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <aside className="hidden border-2 border-ink bg-cream p-4 md:block">{FilterFields}</aside>

        {results.length === 0 ? (
          <div className="border-2 border-ink bg-paper-2 p-8 text-center">
            <p className="font-display text-2xl uppercase">Nothing matched</p>
            <p className="mt-2 text-sm text-ink-70">Loosen a filter or clear all.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4 md:gap-4">
            {results.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>

      {sheet && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal aria-label="Filters">
          <button type="button" className="absolute inset-0 bg-ink/50" aria-label="Close" onClick={() => setSheet(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto border-t-2 border-ink bg-paper p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-xl uppercase">Filters</h2>
              <button type="button" className="min-h-11 min-w-11 border-2 border-ink" onClick={() => setSheet(false)}>
                ✕
              </button>
            </div>
            {FilterFields}
            <button
              type="button"
              className="mt-4 min-h-12 w-full border-2 border-ink bg-ink font-bold uppercase text-cream"
              onClick={() => setSheet(false)}
            >
              Show {results.length} tees
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
