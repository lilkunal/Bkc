import { Link, useSearchParams } from 'react-router-dom'
import { STATES, BRAND } from '../data/states'
import { filterProducts } from '../data/catalog'
import { SectionHead } from '../components/ProductCard'

export function StatesPage() {
  const [params] = useSearchParams()
  const focus = params.get('state') || ''

  return (
    <div className="mx-auto max-w-[1440px] px-[clamp(1rem,0.5rem+2vw,3rem)] py-8 md:py-12">
      <SectionHead
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

      <div className="mb-8 border-2 border-ink bg-marigold/40 p-4 text-sm md:p-5">
        <p className="font-display text-lg uppercase">The one thing others don’t ship</p>
        <p className="mt-2 max-w-3xl text-ink-70">
          Puneri Paati owns Pune. Hyderabadi slang shops own one city. Bewakoof owns pan-Hindi memes.
          Nobody lets a Kumaoni filter Kumaon and a Mallu filter Malayalam in the <b>same cart</b> —
          state → region → day-to-day language. That’s BKC.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STATES.map((s) => {
          const count = filterProducts({ state: s.key }).length
          const active = focus === s.key
          return (
            <article
              key={s.key}
              id={s.key}
              className={`border-2 border-ink bg-cream p-4 ${active ? 'ring-4 ring-marigold' : ''}`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-3xl" aria-hidden>
                  {s.glyph}
                </span>
                <span className="font-mono text-[10px] uppercase text-ink-45">{count} tees</span>
              </div>
              <h2 className="mt-2 font-display text-2xl uppercase">{s.label}</h2>
              <p className="mt-1 text-sm text-ink-70">{s.note}</p>
              <ul className="mt-3 space-y-2">
                {s.regions.map((r) => (
                  <li key={r.key}>
                    <Link
                      to={`/shop?state=${s.key}&region=${r.key}`}
                      className="flex min-h-11 items-center justify-between border border-ink/30 bg-paper-2 px-3 text-sm hover:bg-marigold"
                    >
                      <span>
                        <b>{r.label}</b>
                        <span className="text-ink-45"> · {r.lang}</span>
                      </span>
                      <span aria-hidden>→</span>
                    </Link>
                    <p className="mt-1 px-1 text-xs text-ink-45">{r.note}</p>
                  </li>
                ))}
              </ul>
              <Link
                to={`/shop?state=${s.key}`}
                className="mt-4 inline-flex min-h-11 items-center font-bold uppercase underline"
              >
                All {s.label} →
              </Link>
            </article>
          )
        })}
      </div>
    </div>
  )
}
