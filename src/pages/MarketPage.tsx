import { SectionHead } from '../components/ProductCard'

export function MarketPage() {
  const rows = [
    ['Credence Research', '$570.5M (2024)', '$1,164M by 2032', '8.25%', 'Broad: B2B + promo + custom'],
    ['Grand View Research', '—', '$635M by 2030', '12.1%', 'Custom/personalised, consumer-weighted'],
    ['IMARC Group', '$177M (2025)', '$408M by 2034', '9.75%', 'Narrow: made-to-order personalisation'],
  ]

  const competitors = [
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
      take: 'Filter chips, URL state, sort, size/colour swatches, related rails — the professional PLP baseline.',
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

  return (
    <div className="mx-auto max-w-[1440px] px-[clamp(1rem,0.5rem+2vw,3rem)] py-8 md:py-12">
      <SectionHead
        eyebrow="Business file · August 2026"
        title={<>The printed<br />tee market</>}
        note="Sizing, competitor teardown, unit economics and the whitespace a loud Indian label can still walk through."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['$0.57B', 'India custom tee printing, 2024'],
          ['8–12%', 'CAGR range to 2030–32'],
          ['$24.9B', 'India online fashion, 2025'],
          ['31.7%', 'Fashion share of Indian e-com'],
        ].map(([n, l]) => (
          <div key={l} className="border-2 border-ink bg-cream p-4">
            <b className="font-display text-3xl">{n}</b>
            <p className="mt-1 text-sm text-ink-70">{l}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-3 mt-12 font-display text-2xl uppercase">Market sizing</h2>
      <div className="overflow-x-auto border-2 border-ink">
        <table className="min-w-[640px] w-full text-left text-sm">
          <thead className="bg-ink text-cream">
            <tr>
              {['Source', 'Base', 'Forecast', 'CAGR', 'What it counts'].map((h) => (
                <th key={h} className="px-3 py-2 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]} className="border-t-2 border-ink odd:bg-cream">
                {r.map((c) => (
                  <td key={c} className="px-3 py-2 align-top">
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 max-w-3xl text-sm text-ink-70">
        Honest planning number for a design-led D2C label: roughly <b>$180–250M</b> of genuinely design-led product
        inside a larger ~$570M printing industry dominated by corporate and event bulk.
      </p>

      <h2 className="mb-3 mt-12 font-display text-2xl uppercase">Competitor teardown</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {competitors.map((c) => (
          <article key={c.name} className="border-2 border-ink bg-cream p-4">
            <h3 className="font-display text-xl uppercase">{c.name}</h3>
            <p className="mt-2 text-sm text-ink-70">{c.take}</p>
          </article>
        ))}
      </div>

      <h2 className="mb-3 mt-12 font-display text-2xl uppercase">Unit economics (illustrative)</h2>
      <ul className="max-w-xl space-y-2 border-2 border-ink bg-paper-2 p-4 text-sm">
        <li className="flex justify-between gap-4"><span>Blank oversized 240 GSM</span><b>₹220–280</b></li>
        <li className="flex justify-between gap-4"><span>Screen print (1–2 colour)</span><b>₹40–90</b></li>
        <li className="flex justify-between gap-4"><span>Packaging + QC</span><b>₹25–40</b></li>
        <li className="flex justify-between gap-4"><span>Shipping (avg metro)</span><b>₹50–80</b></li>
        <li className="flex justify-between gap-4 border-t-2 border-ink pt-2"><span>Landed cost</span><b>₹335–490</b></li>
        <li className="flex justify-between gap-4"><span>Sell price (hero)</span><b>₹899–999</b></li>
        <li className="flex justify-between gap-4"><span>Gross before ads/returns</span><b>~45–60%</b></li>
      </ul>

      <h2 className="mb-3 mt-12 font-display text-2xl uppercase">BKC whitespace</h2>
      <p className="max-w-3xl text-sm text-ink-70">
        <b>Shop by where you speak.</b> National D2C owns Hindi/English memes. City slang brands own one tongue.
        BKC ships a filterable India atlas — state → region → day-to-day language — plus soft-censor brand humour
        (Ch**tiya / चूtiya) that turns a gaali into affectionate habit.
      </p>
    </div>
  )
}
