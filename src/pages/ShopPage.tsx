import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { CATEGORIES, COLORS, FITS, OCCASIONS, PRODUCTS, filterProducts } from '../data/catalog'
import { STATES } from '../data/states'
import { ProductCard, SectionHead } from '../components/ProductCard'
import { IconClose } from '../components/Icons'

type Option = [value: string, label: string]
type Group = { key: string; label: string; options: Option[] }

const SORTS: Option[] = [
  ['featured', 'Featured'],
  ['reviews', 'Most reviewed'],
  ['rating', 'Top rated'],
  ['price-asc', 'Price: low to high'],
  ['price-desc', 'Price: high to low'],
]

export function ShopPage() {
  const [params, setParams] = useSearchParams()
  const [sheet, setSheet] = useState(false)
  const { hash } = useLocation()
  const searchRef = useRef<HTMLInputElement>(null)

  const filters: Record<string, string> = {
    fit: params.get('fit') || '',
    cat: params.get('cat') || '',
    occ: params.get('occ') || '',
    aud: params.get('aud') || '',
    color: params.get('color') || '',
    state: params.get('state') || '',
    region: params.get('region') || '',
    q: params.get('q') || '',
    sort: params.get('sort') || 'featured',
  }

  useEffect(() => {
    if (hash === '#search') searchRef.current?.focus()
  }, [hash])

  useEffect(() => {
    if (!sheet) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSheet(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [sheet])

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (!value) next.delete(key)
    else next.set(key, value)
    if (key === 'state') next.delete('region')
    setParams(next, { replace: true })
  }

  const clearAll = () => setParams({}, { replace: true })

  const query = params.toString()
  const results = useMemo(() => {
    const p = new URLSearchParams(query)
    const get = (k: string) => p.get(k) || undefined
    let list = filterProducts({
      fit: get('fit'),
      cat: get('cat'),
      occ: get('occ'),
      aud: get('aud'),
      color: get('color'),
      state: get('state'),
      region: get('region'),
      q: get('q'),
    })
    const sort = p.get('sort')
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating)
    if (sort === 'reviews') list = [...list].sort((a, b) => b.reviews - a.reviews)
    return list
  }, [query])

  const stateEntry = STATES.find((s) => s.key === filters.state)
  const regionOptions: Option[] = stateEntry
    ? stateEntry.regions.map((r): Option => [r.key, `${r.label} (${r.lang})`])
    : STATES.flatMap((s) => s.regions.map((r): Option => [r.key, `${s.label} · ${r.label}`]))

  const groups: Group[] = [
    { key: 'fit', label: 'Fit', options: Object.values(FITS).map((f): Option => [f.key, f.label]) },
    { key: 'cat', label: 'Category', options: CATEGORIES.map((c): Option => [c.key, c.label]) },
    { key: 'occ', label: 'Occasion', options: OCCASIONS.map((o): Option => [o.key, o.label]) },
    {
      key: 'aud',
      label: 'Wearer',
      options: [
        ['men', 'Men'],
        ['women', 'Women'],
        ['unisex', 'Unisex'],
        ['kids', 'Kids'],
      ],
    },
    { key: 'state', label: 'State', options: STATES.map((s): Option => [s.key, s.label]) },
    { key: 'region', label: 'Region / tongue', options: regionOptions },
    { key: 'color', label: 'Colour', options: Object.entries(COLORS).map(([k, v]): Option => [k, v.name]) },
  ]

  const active = [
    ...(filters.q ? [{ key: 'q', text: `“${filters.q}”` }] : []),
    ...groups
      .filter((g) => filters[g.key])
      .map((g) => ({ key: g.key, text: g.options.find(([v]) => v === filters[g.key])?.[1] ?? filters[g.key] })),
  ]

  const renderFields = (prefix: string) => (
    <div className="grid gap-5">
      {groups.map((g) => (
        <div key={g.key} className="grid gap-1.5">
          <label htmlFor={`${prefix}-${g.key}`} className="field-label">
            {g.label}
          </label>
          <select id={`${prefix}-${g.key}`} className="select" value={filters[g.key]} onChange={(e) => set(g.key, e.target.value)}>
            <option value="">All</option>
            {g.options.map(([v, l], i) => (
              <option key={`${v}-${i}`} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  )

  return (
    <div className="shell py-10 md:py-14">
      <SectionHead
        level={1}
        eyebrow={`Catalogue · ${PRODUCTS.length} designs`}
        title="Shop everything"
        note="Cross-filter by fit, taste, occasion, wearer, state and colour. Every filter lives in the URL, so any view can be shared."
      />

      <div className="mb-5 grid gap-4 border-y border-line py-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div className="md:max-w-md">
          <label htmlFor="search" className="sr-only">
            Search the catalogue
          </label>
          <input
            id="search"
            ref={searchRef}
            type="search"
            value={filters.q}
            onChange={(e) => set('q', e.target.value)}
            placeholder="Search: Maggi, vote, gaay…"
            className="input scroll-mt-32"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="btn btn-secondary md:hidden" onClick={() => setSheet(true)}>
            Filters{active.length ? ` (${active.length})` : ''}
          </button>
          <label className="flex items-center gap-3">
            <span className="field-label">Sort</span>
            <select className="select w-auto min-w-48" value={filters.sort} onChange={(e) => set('sort', e.target.value)}>
              {SORTS.map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mb-6 flex min-h-10 flex-wrap items-center gap-2">
        <p className="micro mr-2" aria-live="polite">
          <b className="font-medium text-bone">{results.length}</b> result{results.length === 1 ? '' : 's'}
        </p>
        {active.map((a) => (
          <button key={a.key} type="button" className="chip chip-active" onClick={() => set(a.key, '')} aria-label={`Remove filter ${a.text}`}>
            {a.text} <span aria-hidden="true">×</span>
          </button>
        ))}
        {active.length > 0 && (
          <button type="button" className="u micro ml-1 text-bone" onClick={clearAll}>
            Clear all
          </button>
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-[230px_minmax(0,1fr)]">
        <aside className="hidden md:block" aria-label="Filters">
          {renderFields('f')}
        </aside>

        {results.length === 0 ? (
          <div className="grid content-center justify-items-center gap-4 border border-line bg-surface px-6 py-16 text-center">
            <p className="h-section">Nothing matched</p>
            <p className="lede">Loosen a filter or clear them all.</p>
            <button type="button" className="btn btn-secondary" onClick={clearAll}>
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>

      {sheet && (
        <div className="fixed inset-0 z-[65] md:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button type="button" tabIndex={-1} className="absolute inset-0 bg-night/75" aria-label="Close filters" onClick={() => setSheet(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto border-t border-line bg-surface p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="h-label">Filters</h2>
              <button type="button" className="icon-btn -mr-2.5" aria-label="Close filters" onClick={() => setSheet(false)}>
                <IconClose />
              </button>
            </div>
            {renderFields('m')}
            <button type="button" className="btn btn-primary mt-6 w-full" onClick={() => setSheet(false)}>
              Show {results.length} tees
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
