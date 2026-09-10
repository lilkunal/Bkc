import { Link } from 'react-router-dom'
import { OCCASIONS, filterProducts } from '../data/catalog'
import { SectionHead } from '../components/ProductCard'

export function OccasionsPage() {
  return (
    <div className="shell py-10 md:py-14">
      <SectionHead
        level={1}
        eyebrow="The Indian calendar"
        title={
          <>
            A tee for
            <br />
            every occasion
          </>
        }
        note="Festivals, exams, shaadi season, monsoon, and polling day plus peaceful protest."
      />

      <section id="policy" className="mb-12 grid scroll-mt-32 gap-3 border border-line bg-surface p-6 md:p-8" aria-labelledby="policy-title">
        <h2 id="policy-title" className="eyebrow">
          Civic content policy
        </h2>
        <p className="max-w-3xl text-muted">
          Voting and protest ranges are deliberately non-partisan. No party names, colours or symbols. No national flag on
          fabric. Designs argue for the mechanism: turn up, ask questions, read the constitution, assemble peacefully. Never
          for an outcome.
        </p>
      </section>

      <div className="grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-3">
        {OCCASIONS.map((o) => {
          const count = filterProducts({ occ: o.key }).length
          return (
            <Link
              key={o.key}
              to={`/shop?occ=${o.key}`}
              className="group grid content-start gap-2 border-b border-r border-line p-6 transition-colors duration-500 hover:bg-surface"
            >
              <span className="eyebrow">{o.when}</span>
              <h2 className="font-display text-2xl font-semibold uppercase tracking-[0.05em] transition-colors group-hover:text-gold">
                {o.label}
              </h2>
              <p className="text-sm text-muted">{o.note}</p>
              <p className="micro mt-2 text-gold">{count} designs →</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
