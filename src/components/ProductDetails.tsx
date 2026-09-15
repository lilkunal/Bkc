import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { GARMENTS, type FitInfo, type Product } from '../data/catalog'
import { money } from '../lib/format'
import { deliveryWindow } from '../lib/orders'
import { STORE } from '../store.config'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="group border-b border-line">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4">
        <span className="h-label">{title}</span>
        <span aria-hidden="true" className="text-xl leading-none text-gold transition-transform duration-300 group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="grid gap-3 pb-6 text-sm text-muted">{children}</div>
    </details>
  )
}

/** Size guide, fabric and care, delivery estimate and returns summary for a product page. */
export function ProductDetails({ product, fit }: { product: Product; fit: FitInfo }) {
  const garment = GARMENTS[product.type]
  const { shipping } = STORE
  const [earliest, latest] = deliveryWindow()
  const sizes = Object.entries(fit.measurements)

  return (
    <div className="mt-8 border-t border-line">
      <Section title="Size guide">
        <p>
          <b className="font-medium text-bone">{fit.label}.</b> {fit.blurb}
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[280px] text-left">
            <caption className="sr-only">
              {garment.label} {fit.label} measurements in centimetres
            </caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="field-label py-2 pr-4 font-medium">
                  Size
                </th>
                <th scope="col" className="field-label py-2 pr-4 font-medium">
                  Chest (cm)
                </th>
                <th scope="col" className="field-label py-2 font-medium">
                  Length (cm)
                </th>
              </tr>
            </thead>
            <tbody>
              {sizes.map(([size, [chest, length]]) => (
                <tr key={size} className="border-b border-line/60">
                  <th scope="row" className="py-2 pr-4 font-medium text-bone">
                    {size}
                  </th>
                  <td className="py-2 pr-4 tabular-nums">{chest}</td>
                  <td className="py-2 tabular-nums">{length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="micro">Garment laid flat, chest measured edge to edge and doubled.</p>
      </Section>

      <Section title="Fabric & care">
        <p>{fit.weight}.</p>
        <ul className="grid list-disc gap-1 pl-5">
          {garment.care.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </Section>

      <Section title="Delivery">
        <p>
          Ships within {shipping.dispatchDays} business days. Order today and it should arrive between{' '}
          <b className="font-medium text-bone">{earliest}</b> and{' '}
          <b className="font-medium text-bone">{latest}</b>.
        </p>
        <p>
          Free shipping above {money(shipping.freeAbove)}; otherwise {money(shipping.fee)}.
        </p>
        <Link to="/policies/shipping" className="u micro justify-self-start text-gold">
          Shipping policy
        </Link>
      </Section>

      <Section title="Returns & exchanges">
        <p>{STORE.returns.summary}</p>
        <Link to="/policies/returns" className="u micro justify-self-start text-gold">
          Returns policy
        </Link>
      </Section>
    </div>
  )
}
