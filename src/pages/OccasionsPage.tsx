import { Link } from 'react-router-dom'
import { OCCASIONS, filterProducts } from '../data/catalog'
import { SectionHead } from '../components/ProductCard'

export function OccasionsPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-[clamp(1rem,0.5rem+2vw,3rem)] py-8 md:py-12">
      <SectionHead
        eyebrow="Indian calendar"
        title={<>A tee for<br />every occasion</>}
        note="Festivals, exams, shaadi season, monsoon — and polling day plus peaceful protest."
      />

      <div className="mb-8 border-2 border-ink bg-indigo p-5 text-cream md:p-6">
        <h2 className="font-display text-xl uppercase text-marigold">Civic content policy</h2>
        <p className="mt-2 max-w-3xl text-sm text-cream/85">
          Voting and protest ranges are deliberately non-partisan. No party names, colours or symbols.
          No national flag on fabric. Designs argue for the mechanism — turn up, ask questions, read the
          constitution, assemble peacefully — never for an outcome.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {OCCASIONS.map((o) => {
          const count = filterProducts({ occ: o.key }).length
          return (
            <Link
              key={o.key}
              to={`/shop?occ=${o.key}`}
              className="border-2 border-ink bg-cream p-4 hover:bg-marigold"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-2xl">{o.glyph}</span>
                <span className="font-mono text-[10px] uppercase text-ink-45">{o.when}</span>
              </div>
              <h3 className="mt-2 font-display text-xl uppercase">{o.label}</h3>
              <p className="mt-1 text-sm text-ink-70">{o.note}</p>
              <p className="mt-3 font-mono text-xs">{count} designs →</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
