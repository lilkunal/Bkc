import { Link } from 'react-router-dom'
import { COLLECTIONS, CATEGORIES, filterProducts } from '../data/catalog'
import { SectionHead } from '../components/ProductCard'

export function CollectionsPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-[clamp(1rem,0.5rem+2vw,3rem)] py-8 md:py-12">
      <SectionHead
        eyebrow="Curated capsules"
        title="Collections"
        note="Ten ways into the catalogue — plus every taste category."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COLLECTIONS.map((c) => {
          const qs = new URLSearchParams(c.filter as Record<string, string>).toString()
          const count = filterProducts(c.filter).length
          return (
            <Link
              key={c.key}
              to={`/shop?${qs}`}
              className="border-2 border-ink p-5"
              style={{ background: c.hero }}
            >
              <span className="text-3xl">{c.glyph}</span>
              <h2 className="mt-2 font-display text-2xl uppercase">{c.label}</h2>
              <p className="mt-1 text-sm text-ink/80">{c.note}</p>
              <p className="mt-3 font-mono text-xs">{count} tees →</p>
            </Link>
          )
        })}
      </div>

      <h2 className="mb-4 mt-14 font-display text-2xl uppercase">All categories</h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {CATEGORIES.map((c) => (
          <Link key={c.key} to={`/shop?cat=${c.key}`} className="border-2 border-ink bg-cream p-4 hover:bg-marigold">
            <span>{c.glyph}</span>
            <h3 className="font-display uppercase">{c.label}</h3>
          </Link>
        ))}
      </div>
    </div>
  )
}
