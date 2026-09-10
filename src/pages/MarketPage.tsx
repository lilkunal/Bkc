import { SectionHead } from '../components/ProductCard'

const STATS: [string, string][] = [
  ['$0.57B', 'India custom tee printing, 2024'],
  ['8–12%', 'CAGR range to 2030–32'],
  ['$24.9B', 'India online fashion, 2025'],
  ['31.7%', 'Fashion share of Indian e-com'],
]

const SIZING_HEAD = ['Source', 'Base', 'Forecast', 'CAGR', 'What it counts']

const SIZING_ROWS = [
  ['Credence Research', '$570.5M (2024)', '$1,164M by 2032', '8.25%', 'Broad: B2B + promo + custom'],
  ['Grand View Research', '—', '$635M by 2030', '12.1%', 'Custom/personalised, consumer-weighted'],
  ['IMARC Group', '$177M (2025)', '$408M by 2034', '9.75%', 'Narrow: made-to-order personalisation'],
]

const COMPETITORS = [
  {
    name: 'Bewakoof',
    take: 'Culture-meme density, men/women doors, graphic-first grids. BKC steals the catalogue energy, not the soft pastel UI.',
  },
  {
    name: 'Beyoung',
    take: 'New drops, combos, social proof, fit-first browsing. Sticky mobile ATC and clear offer maths.',
  },
  {
    name: 'Myntra',
    take: 'Filter chips, URL state, sort, size/colour swatches, related rails: the professional PLP baseline.',
  },
  {
    name: 'AJIO',
    take: 'Editorial collection landings. Capsules should feel like magazines, not spreadsheet rows.',
  },
  {
    name: 'Amazon Fashion',
    take: 'Specs block, size chart honesty, Q&A. Trust is a layout problem as much as a brand problem.',
  },
]

const ECONOMICS: { label: string; value: string; total?: boolean }[] = [
  { label: 'Blank oversized 240 GSM', value: '₹220–280' },
  { label: 'Screen print (1–2 colour)', value: '₹40–90' },
  { label: 'Packaging + QC', value: '₹25–40' },
  { label: 'Shipping (avg metro)', value: '₹50–80' },
  { label: 'Landed cost', value: '₹335–490', total: true },
  { label: 'Sell price (hero)', value: '₹899–999' },
  { label: 'Gross before ads/returns', value: '~45–60%' },
]

export function MarketPage() {
  return (
    <div className="shell py-10 md:py-14">
      <SectionHead
        level={1}
        eyebrow="Business file · August 2026"
        title={
          <>
            The printed
            <br />
            tee market
          </>
        }
        note="Sizing, competitor teardown, unit economics and the whitespace a loud Indian label can still walk through."
      />

      <div className="grid grid-cols-2 border-l border-t border-line lg:grid-cols-4">
        {STATS.map(([n, l]) => (
          <div key={l} className="grid gap-1 border-b border-r border-line p-5 md:p-6">
            <b className="font-display text-4xl font-semibold text-gold">{n}</b>
            <p className="text-sm text-muted">{l}</p>
          </div>
        ))}
      </div>

      <section className="mt-16" aria-labelledby="sizing-title">
        <h2 id="sizing-title" className="h-section mb-6">
          Market sizing
        </h2>
        <div className="overflow-x-auto border border-line">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-surface">
              <tr>
                {SIZING_HEAD.map((h) => (
                  <th key={h} scope="col" className="field-label px-4 py-3 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SIZING_ROWS.map((r) => (
                <tr key={r[0]} className="border-t border-line">
                  {r.map((cell, i) =>
                    i === 0 ? (
                      <th key={i} scope="row" className="px-4 py-3 text-left align-top font-medium">
                        {cell}
                      </th>
                    ) : (
                      <td key={i} className="px-4 py-3 align-top text-muted">
                        {cell}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 max-w-3xl text-sm text-muted">
          Honest planning number for a design-led D2C label: roughly <b className="font-medium text-bone">$180–250M</b> of
          genuinely design-led product inside a larger ~$570M printing industry dominated by corporate and event bulk.
        </p>
      </section>

      <section className="mt-16" aria-labelledby="competitors-title">
        <h2 id="competitors-title" className="h-section mb-6">
          Competitor teardown
        </h2>
        <div className="grid border-l border-t border-line md:grid-cols-2">
          {COMPETITORS.map((c) => (
            <article key={c.name} className="grid content-start gap-2 border-b border-r border-line p-6">
              <h3 className="font-display text-2xl font-semibold uppercase tracking-[0.05em]">{c.name}</h3>
              <p className="text-sm text-muted">{c.take}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-10 lg:grid-cols-2" aria-labelledby="economics-title">
        <div>
          <h2 id="economics-title" className="h-section mb-6">
            Unit economics
          </h2>
          <p className="micro">Illustrative, per tee</p>
          <ul className="mt-4 border-t border-line text-sm">
            {ECONOMICS.map((row) => (
              <li
                key={row.label}
                className={`flex justify-between gap-4 border-b py-3 ${row.total ? 'border-gold text-bone' : 'border-line text-muted'}`}
              >
                <span>{row.label}</span>
                <b className={`font-medium tabular-nums ${row.total ? 'text-gold' : 'text-bone'}`}>{row.value}</b>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid content-start gap-4 border border-line bg-surface p-6 md:p-8">
          <h2 className="eyebrow">BKC whitespace</h2>
          <p className="font-display text-3xl font-semibold uppercase leading-tight tracking-[0.04em]">Shop by where you speak.</p>
          <p className="text-muted">
            National D2C owns Hindi/English memes. City slang brands own one tongue. BKC ships a filterable India atlas:
            state → region → day-to-day language, plus soft-censor brand humour (Ch**tiya / चूtiya) that turns a gaali into
            affectionate habit.
          </p>
        </div>
      </section>
    </div>
  )
}
