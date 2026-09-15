import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { money } from '../lib/format'
import { clearOrderHistory, orderHistory, trackingFor } from '../lib/orders'
import { usePageTitle } from '../lib/usePageTitle'
import { STORE } from '../store.config'
import { RecentlyViewed } from '../components/CommerceBits'
import { InView } from '../components/motion'
import { SectionHead } from '../components/ProductCard'

const dateFormat = new Intl.DateTimeFormat(STORE.currency.locale, { day: 'numeric', month: 'short', year: 'numeric' })

export function AccountPage() {
  usePageTitle('Your account')
  const [orders, setOrders] = useState(orderHistory)
  const wishlist = useWishlist()
  const { count } = useCart()
  const last = orders[0]

  return (
    <div className="shell py-10 md:py-14">
      <SectionHead
        level={1}
        eyebrow={STORE.demo ? 'Demo · no sign-in needed' : 'Account'}
        title="Your account"
        note="Orders, saved designs and details from this browser."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Orders', value: orders.length, to: '#orders' },
          { label: 'Wishlist', value: wishlist.count, to: '/wishlist' },
          { label: 'In your bag', value: count, to: '/cart' },
        ].map((stat) => (
          <Link key={stat.label} to={stat.to} className="group grid gap-1 border border-line bg-surface p-6 transition-colors hover:border-gold" style={{ borderRadius: 'var(--radius-card)' }}>
            <span className="field-label">{stat.label}</span>
            <span className="font-display text-4xl font-semibold lining-nums tabular-nums transition-colors group-hover:text-gold">{stat.value}</span>
          </Link>
        ))}
      </div>

      <section id="orders" className="mt-14 scroll-mt-32" aria-labelledby="orders-title">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-4">
          <h2 id="orders-title" className="h-label">
            Order history
          </h2>
          {orders.length > 0 && (
            <button
              type="button"
              className="u micro text-bone"
              onClick={() => {
                clearOrderHistory()
                setOrders([])
              }}
            >
              Clear history
            </button>
          )}
        </div>
        {orders.length === 0 ? (
          <div className="grid justify-items-start gap-4 border border-line bg-surface p-8">
            <p className="text-muted">No orders from this browser yet.</p>
            <Link to="/shop" className="btn btn-secondary">
              Start shopping
            </Link>
          </div>
        ) : (
          <ul className="grid gap-3">
            {orders.map((order, i) => {
              const { stages, current } = trackingFor(order)
              const items = order.items.reduce((n, item) => n + item.qty, 0)
              return (
                <li key={order.ref}>
                  <InView transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.3) }}>
                    <div className="grid gap-4 border border-line p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center" style={{ borderRadius: 'var(--radius-card)' }}>
                      <div className="grid gap-1">
                        <p className="font-medium">{order.ref}</p>
                        <p className="text-sm text-muted">
                          {dateFormat.format(new Date(order.createdAt))} · {items} item{items === 1 ? '' : 's'} · {money(order.total)}
                        </p>
                        <p className="micro text-gold">{stages[current].label}</p>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        <Link to={`/order/${order.ref}`} className="u micro text-bone">
                          Details
                        </Link>
                        <Link to={`/track/${order.ref}`} className="u micro text-gold">
                          Track
                        </Link>
                      </div>
                    </div>
                  </InView>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {last && (
        <section className="mt-14" aria-labelledby="details-title">
          <h2 id="details-title" className="h-label mb-5">
            Saved details
          </h2>
          <dl className="grid gap-4 text-sm sm:grid-cols-3">
            <div>
              <dt className="field-label">Name</dt>
              <dd className="mt-1">{last.name}</dd>
            </div>
            <div>
              <dt className="field-label">Email</dt>
              <dd className="mt-1">{last.email}</dd>
            </div>
            <div>
              <dt className="field-label">Deliver to</dt>
              <dd className="mt-1">{[last.address, last.city, last.state, last.pincode].filter(Boolean).join(', ')}</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-muted">Checkout fills these in for you next time.</p>
        </section>
      )}

      <RecentlyViewed />
    </div>
  )
}
