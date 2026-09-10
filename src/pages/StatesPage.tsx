import { Link, useSearchParams } from 'react-router-dom'
import { BRAND, STATES } from '../data/states'
import { filterProducts } from '../data/catalog'
import { SectionHead } from '../components/ProductCard'

export function StatesPage() {
  const [params] = useSearchParams()
  const focus = params.get('state') || ''

  return (
    <div className="shell py-10 md:py-14">
      <SectionHead
        level={1}
        eyebrow="India vernacular atlas"
        title={
          <>
            Shop by where
            <br />
            you speak
          </>
        }
        note={BRAND.differentiator}
      />

      <section className="mb-12 grid gap-3 border border-line bg-surface p-6 md:p-8" aria-labelledby="gap-title">
        <h2 id="gap-title" className="eyebrow">
          The one thing others don’t ship
        </h2>
        <p className="max-w-3xl text-muted">
          Puneri Paati owns Pune. Hyderabadi slang shops own one city. Bewakoof owns pan-Hindi memes. Nobody lets a Kumaoni
          filter Kumaon and a Mallu filter Malayalam in the <b className="font-medium text-bone">same cart</b>: state → region
          → day-to-day language. That’s BKC.
        </p>
      </section>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {STATES.map((s) => {
          const count = filterProducts({ state: s.key }).length
          const active = focus === s.key
          return (
            <article
              key={s.key}
              id={s.key}
              className={`grid scroll-mt-32 content-start border p-6 ${active ? 'border-gold' : 'border-line'}`}
              aria-labelledby={`${s.key}-title`}
            >
              <div className="flex items-baseline justify-between gap-3">
                <h2 id={`${s.key}-title`} className="font-display text-[1.75rem] font-semibold uppercase tracking-[0.05em]">
                  {s.label}
                </h2>
                <span className="micro shrink-0">{count} tees</span>
              </div>
              <p className="mt-2 text-sm text-muted">{s.note}</p>
              <ul className="mt-5 grid border-t border-line">
                {s.regions.map((r) => (
                  <li key={r.key} className="border-b border-line">
                    <Link to={`/shop?state=${s.key}&region=${r.key}`} className="group flex min-h-12 items-center justify-between gap-3 py-3">
                      <span>
                        <b className="font-medium transition-colors group-hover:text-gold">{r.label}</b>
                        <span className="text-muted"> · {r.lang}</span>
                        <span className="mt-0.5 block text-xs text-muted">{r.note}</span>
                      </span>
                      <span aria-hidden="true" className="text-gold">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link to={`/shop?state=${s.key}`} className="u micro mt-5 justify-self-start text-gold">
                All {s.label} →
              </Link>
            </article>
          )
        })}
      </div>
    </div>
  )
}
