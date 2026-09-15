import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { useWishlist } from '../context/WishlistContext'
import { getProductById, pickProducts, relatedProducts, varied, type Product } from '../data/catalog'
import { money } from '../lib/format'
import { computeTotals } from '../lib/pricing'
import { usePageTitle } from '../lib/usePageTitle'
import { STORE } from '../store.config'
import { CouponForm, FreeShippingBar, RecentlyViewed, TotalsList } from '../components/CommerceBits'
import { GarmentImage } from '../components/GarmentImage'
import { AnimatedNumber, BorderTrail, Magnetic } from '../components/motion'
import { ProductCard, RowHead, SectionHead } from '../components/ProductCard'

export function CartPage() {
  usePageTitle('Your bag')
  const { items, count, setQty, removeItem, coupon } = useCart()
  const wishlist = useWishlist()
  const notify = useToast()
  const totals = computeTotals(items, { coupon })

  const ids = items.map((i) => i.id).join(',')
  const suggestions = useMemo(() => {
    const inBag = new Set(ids.split(','))
    const first = ids ? getProductById(ids.split(',')[0]) : undefined
    const pool: Product[] = first ? relatedProducts(first, 24) : pickProducts('bestsellers', {}, 24)
    return varied(
      pool.filter((p) => !inBag.has(p.id)),
      4,
    )
  }, [ids])

  if (!items.length) {
    return (
      <div className="shell py-10 md:py-14">
        <SectionHead level={1} eyebrow="Bag" title="Your bag is empty" note="Save a few favourites, or start with the best sellers." />
        <div className="flex flex-wrap gap-3">
          <Link to="/shop" className="btn btn-primary">
            Shop everything
          </Link>
          {wishlist.count > 0 && (
            <Link to="/wishlist" className="btn btn-secondary">
              Open wishlist ({wishlist.count})
            </Link>
          )}
        </div>
        <section className="mt-16" aria-labelledby="best-title">
          <RowHead title="Best sellers" id="best-title" to="/shop?sort=reviews" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
            {suggestions.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
        <RecentlyViewed />
      </div>
    )
  }

  const moveToWishlist = (key: string, id: string) => {
    if (!wishlist.has(id)) wishlist.toggle(id)
    removeItem(key)
    notify('Moved to your wishlist.', { label: 'View', to: '/wishlist' })
  }

  return (
    <div className="shell py-10 md:py-14">
      <SectionHead level={1} eyebrow={`Bag · ${count} item${count === 1 ? '' : 's'}`} title="Your bag" />

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
        <div className="grid gap-6">
          <FreeShippingBar totals={totals} />
          <ul className="border-t border-line">
            {items.map((item) => (
              <li key={item.key} className="grid grid-cols-[96px_minmax(0,1fr)] gap-5 border-b border-line py-6 sm:grid-cols-[128px_minmax(0,1fr)_auto]">
                <Link to={`/product/${item.id}`} className="spot block p-2" aria-label={item.name}>
                  <GarmentImage
                    type={item.type}
                    image={item.image}
                    fit={item.fit}
                    teeHex={item.teeHex}
                    printHex={item.printHex}
                    lines={item.printLines}
                    glyph={item.glyph}
                    font={item.font}
                    backdrop={item.backdrop}
                    backdropHex={item.backdropHex}
                    detail="flat"
                    alt=""
                  />
                </Link>
                <div className="grid min-w-0 content-start gap-1.5">
                  <Link to={`/product/${item.id}`} className="font-medium transition-colors hover:text-gold">
                    {item.name}
                  </Link>
                  <p className="text-xs uppercase tracking-[0.08em] text-muted">
                    Size {item.size} · {item.fit}
                  </p>
                  <p className="text-sm tabular-nums text-muted">{money(item.price)} each</p>
                  <div className="mt-2 flex flex-wrap items-center gap-4">
                    <div className="stepper" role="group" aria-label={`Quantity of ${item.name}`}>
                      <button type="button" onClick={() => setQty(item.key, item.qty - 1)} aria-label={`Decrease quantity of ${item.name}`}>
                        −
                      </button>
                      <output aria-live="polite">{item.qty}</output>
                      <button type="button" onClick={() => setQty(item.key, Math.min(10, item.qty + 1))} aria-label={`Increase quantity of ${item.name}`}>
                        +
                      </button>
                    </div>
                    <button type="button" className="u micro text-bone" onClick={() => moveToWishlist(item.key, item.id)}>
                      Move to wishlist
                    </button>
                    <button type="button" className="u micro text-bone" onClick={() => removeItem(item.key)}>
                      Remove
                    </button>
                  </div>
                </div>
                <p className="col-start-2 font-medium sm:col-start-auto sm:text-right">
                  <AnimatedNumber value={item.price * item.qty} format={money} />
                </p>
              </li>
            ))}
          </ul>
          <Link to="/shop" className="u micro justify-self-start text-bone">
            ← Keep shopping
          </Link>
        </div>

        <aside className="grid gap-6 border border-line bg-surface p-6 lg:sticky lg:top-28" style={{ borderRadius: 'var(--radius-card)' }} aria-labelledby="bag-summary-title">
          <h2 id="bag-summary-title" className="h-label">
            Order summary
          </h2>
          <CouponForm subtotal={totals.subtotal} />
          <TotalsList totals={totals} />
          <Magnetic className="block">
            <Link to="/checkout" className="btn btn-primary relative w-full overflow-hidden">
              Checkout · {money(totals.total)}
              <BorderTrail size={80} />
            </Link>
          </Magnetic>
          <ul className="flex flex-wrap gap-2" aria-label="Payment methods">
            {STORE.payments.map((m) => (
              <li key={m} className="border border-line px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                {m}
              </li>
            ))}
          </ul>
          {STORE.demo && <p className="text-xs text-muted">Demo store: no payment is taken.</p>}
        </aside>
      </div>

      {suggestions.length > 0 && (
        <section className="mt-16" aria-labelledby="look-title">
          <RowHead title="Complete the look" id="look-title" to="/shop" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
            {suggestions.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
      <RecentlyViewed exclude={items.map((i) => i.id)} />
    </div>
  )
}
