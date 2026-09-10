import { Link } from 'react-router-dom'
import { CATEGORIES, COLLECTIONS, filterProducts } from '../data/catalog'
import { SectionHead } from '../components/ProductCard'
import { Tee } from '../components/Tee'

export function CollectionsPage() {
  return (
    <div className="shell py-10 md:py-14">
      <SectionHead level={1} eyebrow="Curated capsules" title="Collections" note="Ten ways into the catalogue, plus every taste category." />

      <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {COLLECTIONS.map((c) => {
          const qs = new URLSearchParams(c.filter as Record<string, string>).toString()
          const items = filterProducts(c.filter)
          const lead = items[0]
          return (
            <Link key={c.key} to={`/shop?${qs}`} className="group grid content-start gap-4">
              <div className="spot grid aspect-[4/3] place-items-center overflow-hidden p-6">
                {lead && (
                  <Tee product={lead} detail="card" className="w-[58%] transition-transform duration-700 ease-lux group-hover:scale-[1.03]" />
                )}
              </div>
              <div className="grid gap-1.5">
                <h2 className="font-display text-2xl font-semibold uppercase tracking-[0.05em] transition-colors group-hover:text-gold">
                  {c.label}
                </h2>
                <p className="text-sm text-muted">{c.note}</p>
                <p className="micro mt-1 text-gold">{items.length} tees →</p>
              </div>
            </Link>
          )
        })}
      </div>

      <section className="mt-20" aria-labelledby="categories-title">
        <SectionHead eyebrow="By taste" title="All categories" id="categories-title" />
        <div className="grid grid-cols-2 border-l border-t border-line md:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.key}
              to={`/shop?cat=${c.key}`}
              className="group grid content-start gap-1.5 border-b border-r border-line p-5 transition-colors duration-500 hover:bg-surface"
            >
              <h3 className="h-label transition-colors group-hover:text-gold">{c.label}</h3>
              <p className="text-sm text-muted">{c.note}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
