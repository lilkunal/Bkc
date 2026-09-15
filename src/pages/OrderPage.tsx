import { Link, useParams } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { money } from '../lib/format'
import { deliveryWindow, loadOrder, pincodeZone } from '../lib/orders'
import { usePageTitle } from '../lib/usePageTitle'
import { STORE } from '../store.config'
import { ShapeBackdrop } from '../components/ShapeBackdrop'
import { TextEffect } from '../components/motion'

export function OrderPage() {
  const { ref = '' } = useParams()
  const order = loadOrder(ref)
  const { theme } = useTheme()
  usePageTitle(order ? 'Order confirmed' : 'Order not found')

  if (!order) {
    return (
      <div className="shell grid justify-items-center gap-5 py-24 text-center">
        <h1 className="h-section">We can’t find that order here</h1>
        <p className="lede">Orders are saved in the browser that placed them.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/account" className="btn btn-secondary">
            Your orders
          </Link>
          <Link to="/shop" className="btn btn-primary">
            Keep shopping
          </Link>
        </div>
      </div>
    )
  }

  const shift = (pincodeZone(order.pincode ?? '')?.extraDays ?? 0) - (order.delivery === 'express' ? STORE.shipping.expressDaysFaster : 0)
  const [earliest, latest] = deliveryWindow(new Date(order.createdAt), shift)
  const firstName = order.name.trim().split(/\s+/)[0] || 'there'
  const row = 'flex justify-between gap-4'

  return (
    <div>
      <section className="relative isolate overflow-hidden border-b border-line">
        <ShapeBackdrop kind={theme.backdrop === 'silk' ? 'blobs' : theme.backdrop} seed={order.ref.length * 7} className="-z-10 opacity-80" />
        <div className="mx-auto grid max-w-3xl justify-items-start gap-4 px-[clamp(1rem,0.5rem+2.5vw,3rem)] py-14 md:py-20">
          <p className="eyebrow">Order confirmed</p>
          <TextEffect as="h1" per="word" preset="fade-in-blur" className="h-display">
            {`Thank you, ${firstName}`}
          </TextEffect>
          <p className="lede max-w-none text-lg">
            Order <b className="font-medium text-bone">{order.ref}</b> is in.{' '}
            {STORE.demo ? `In a live store, a confirmation email would go to ${order.email}.` : `A confirmation is on its way to ${order.email}.`}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link to={`/track/${order.ref}`} className="btn btn-primary">
              Track this order
            </Link>
            <Link to="/shop" className="btn btn-secondary">
              Keep shopping
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-3xl gap-8 px-[clamp(1rem,0.5rem+2.5vw,3rem)] py-12">
        {STORE.demo && <p className="border border-line bg-surface p-4 text-sm text-muted">Demo store: no payment was taken and nothing will ship.</p>}

        <p className="text-muted">
          Estimated delivery to {order.city}
          {order.delivery === 'express' ? ' (express)' : ''}: <b className="font-medium text-bone">{earliest}</b> to{' '}
          <b className="font-medium text-bone">{latest}</b>.
        </p>

        <section className="border border-line p-6" style={{ borderRadius: 'var(--radius-card)' }} aria-labelledby="order-items">
          <h2 id="order-items" className="h-label">
            What you ordered
          </h2>
          <ul className="mt-4 grid gap-3 text-sm">
            {order.items.map((item) => (
              <li key={item.key} className="flex justify-between gap-4 border-b border-line pb-3">
                <span>
                  {item.name} <span className="text-muted">· {item.size} · Qty {item.qty}</span>
                </span>
                <span className="tabular-nums">{money(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 grid gap-2 text-sm">
            {!!order.discount && (
              <div className={row}>
                <dt className="text-muted">Discount{order.coupon ? ` (${order.coupon})` : ''}</dt>
                <dd className="tabular-nums text-success">−{money(order.discount)}</dd>
              </div>
            )}
            <div className={row}>
              <dt className="text-muted">Shipping</dt>
              <dd>{order.shipping ? money(order.shipping) : 'Free'}</dd>
            </div>
            {!!order.express && (
              <div className={row}>
                <dt className="text-muted">Express delivery</dt>
                <dd className="tabular-nums">{money(order.express)}</dd>
              </div>
            )}
            {!!order.giftWrap && (
              <div className={row}>
                <dt className="text-muted">Gift wrap</dt>
                <dd className="tabular-nums">{money(order.giftWrap)}</dd>
              </div>
            )}
            {!!order.codFee && (
              <div className={row}>
                <dt className="text-muted">Cash on delivery fee</dt>
                <dd className="tabular-nums">{money(order.codFee)}</dd>
              </div>
            )}
            <div className={row}>
              <dt className="text-muted">Payment</dt>
              <dd>{order.payment}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 font-medium">
              <dt>Total</dt>
              <dd className="tabular-nums">{money(order.total)}</dd>
            </div>
            {!!order.tax && (
              <p className="text-xs text-muted">
                Includes {money(order.tax)} {STORE.tax.label}
              </p>
            )}
          </dl>
          {order.giftMessage && <p className="mt-4 border-t border-line pt-4 text-sm italic text-muted">Gift note: “{order.giftMessage}”</p>}
        </section>

        <Link to="/account" className="u micro justify-self-start text-bone">
          All your orders →
        </Link>
      </div>
    </div>
  )
}
