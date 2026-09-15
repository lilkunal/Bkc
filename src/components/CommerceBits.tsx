import { useMemo, useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { getProductById, relatedProducts, varied, type Product } from '../data/catalog'
import { money } from '../lib/format'
import { deliveryWindow, pincodeZone } from '../lib/orders'
import { checkCoupon, type Totals } from '../lib/pricing'
import { recentlyViewed } from '../lib/recent'
import { STORE } from '../store.config'
import { GarmentImage } from './GarmentImage'
import { AnimatedNumber, TextShimmer } from './motion'
import { ProductCard, RowHead } from './ProductCard'

/** How close the bag is to free shipping. */
export function FreeShippingBar({ totals }: { totals: Totals }) {
  if (!totals.subtotal) return null
  const unlocked = totals.freeShippingProgress >= 1
  return (
    <div className="grid gap-2">
      <p className="text-sm">
        {unlocked ? (
          <TextShimmer>Free shipping unlocked</TextShimmer>
        ) : (
          <>
            Add <b className="font-medium text-bone">{money(totals.toFreeShipping)}</b> more for free shipping
          </>
        )}
      </p>
      <div
        className="ship-meter"
        role="progressbar"
        aria-label="Progress to free shipping"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(totals.freeShippingProgress * 100)}
      >
        <motion.span className="ship-meter-fill" initial={false} animate={{ scaleX: totals.freeShippingProgress }} transition={{ type: 'spring', stiffness: 120, damping: 22 }} />
      </div>
    </div>
  )
}

/** Coupon code form, shared by the bag page and checkout. */
export function CouponForm({ subtotal, compact = false }: { subtotal: number; compact?: boolean }) {
  const { coupon, setCoupon } = useCart()
  const [code, setCode] = useState(coupon ?? '')
  const [message, setMessage] = useState<{ tone: 'ok' | 'err'; text: string } | null>(null)
  const inputId = compact ? 'coupon-compact' : 'coupon'

  const apply = (e: FormEvent) => {
    e.preventDefault()
    const result = checkCoupon(code, subtotal)
    if (result.coupon) {
      setCoupon(result.coupon.code)
      setCode(result.coupon.code)
      setMessage({ tone: 'ok', text: `${result.coupon.code} applied: ${result.coupon.note}.` })
    } else {
      setMessage({ tone: 'err', text: result.error ?? 'Enter a code first.' })
    }
  }

  const remove = () => {
    setCoupon(null)
    setCode('')
    setMessage({ tone: 'ok', text: 'Code removed.' })
  }

  return (
    <form onSubmit={apply} className="grid gap-2" noValidate>
      <label htmlFor={inputId} className="field-label">
        Coupon code
      </label>
      <div className="flex gap-2">
        <input id={inputId} className="input uppercase" value={code} onChange={(e) => setCode(e.target.value)} autoComplete="off" spellCheck={false} />
        {coupon ? (
          <button type="button" className="btn btn-secondary shrink-0 px-4" onClick={remove}>
            Remove
          </button>
        ) : (
          <button type="submit" className="btn btn-secondary shrink-0 px-5">
            Apply
          </button>
        )}
      </div>
      <p role="status" className={`min-h-[1.2em] text-xs ${message?.tone === 'err' ? 'text-error' : 'text-success'}`}>
        {message?.text}
      </p>
      {STORE.demo && !coupon && !compact && (
        <p className="text-xs text-muted">
          Demo codes:{' '}
          {STORE.coupons.map((c, i) => (
            <span key={c.code}>
              {i > 0 && ' · '}
              <button type="button" className="u text-bone" onClick={() => setCode(c.code)}>
                {c.code}
              </button>
            </span>
          ))}
        </p>
      )}
    </form>
  )
}

/** Summary rows for any set of totals. */
export function TotalsList({ totals }: { totals: Totals }) {
  const row = 'flex justify-between gap-4'
  return (
    <dl className="grid gap-2 text-sm">
      <div className={row}>
        <dt className="text-muted">Subtotal</dt>
        <dd className="tabular-nums">{money(totals.subtotal)}</dd>
      </div>
      {totals.discount > 0 && (
        <div className={row}>
          <dt className="text-muted">Discount{totals.coupon ? ` (${totals.coupon.code})` : ''}</dt>
          <dd className="tabular-nums text-success" data-testid="discount">
            −{money(totals.discount)}
          </dd>
        </div>
      )}
      <div className={row}>
        <dt className="text-muted">Shipping</dt>
        <dd className="tabular-nums">{totals.shipping ? money(totals.shipping) : 'Free'}</dd>
      </div>
      {totals.express > 0 && (
        <div className={row}>
          <dt className="text-muted">Express delivery</dt>
          <dd className="tabular-nums">{money(totals.express)}</dd>
        </div>
      )}
      {totals.giftWrap > 0 && (
        <div className={row}>
          <dt className="text-muted">Gift wrap</dt>
          <dd className="tabular-nums">{money(totals.giftWrap)}</dd>
        </div>
      )}
      {totals.codFee > 0 && (
        <div className={row}>
          <dt className="text-muted">Cash on delivery fee</dt>
          <dd className="tabular-nums">{money(totals.codFee)}</dd>
        </div>
      )}
      <div className="mt-2 flex items-baseline justify-between border-t border-line pt-4 font-display text-2xl font-semibold uppercase tracking-[0.04em]">
        <dt>Total</dt>
        <dd>
          <AnimatedNumber value={totals.total} format={money} />
        </dd>
      </div>
      {totals.tax > 0 && (
        <p className="text-xs text-muted">
          Includes {money(totals.tax)} {STORE.tax.label}
        </p>
      )}
    </dl>
  )
}

/** Products this browser looked at recently. */
export function RecentlyViewed({ exclude = [], title = 'Recently viewed', max = 4 }: { exclude?: string[]; title?: string; max?: number }) {
  const [ids] = useState(() => recentlyViewed(exclude))
  const products = ids
    .map((id) => getProductById(id))
    .filter((p): p is Product => !!p)
    .slice(0, max)
  if (!products.length) return null
  return (
    <section className="mt-16" aria-labelledby="recent-title">
      <RowHead title={title} id="recent-title" />
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  )
}

/** Delivery estimate for a pincode, on product pages. */
export function DeliveryCheck() {
  const [pin, setPin] = useState(() => {
    try {
      return localStorage.getItem('bkc_pincode') ?? ''
    } catch {
      return ''
    }
  })
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null)

  const check = (e: FormEvent) => {
    e.preventDefault()
    const zone = pincodeZone(pin.trim())
    if (!zone) {
      setResult({ ok: false, text: 'Enter a 6-digit pincode.' })
      return
    }
    try {
      localStorage.setItem('bkc_pincode', pin.trim())
    } catch {
      // Storage blocked.
    }
    const [from, to] = deliveryWindow(new Date(), zone.extraDays)
    const [express] = deliveryWindow(new Date(), zone.extraDays - STORE.shipping.expressDaysFaster)
    setResult({ ok: true, text: `Delivers to ${zone.name} between ${from} and ${to}, or by ${express} with express. Cash on delivery available.` })
  }

  return (
    <form onSubmit={check} className="grid gap-2" noValidate>
      <label htmlFor="delivery-pin" className="field-label">
        Check delivery
      </label>
      <div className="flex max-w-sm gap-2">
        <input
          id="delivery-pin"
          className="input"
          inputMode="numeric"
          maxLength={6}
          placeholder="Pincode"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
          autoComplete="postal-code"
        />
        <button type="submit" className="btn btn-secondary shrink-0 px-5">
          Check
        </button>
      </div>
      <p role="status" className={`min-h-[1.2em] max-w-md text-sm ${result?.ok === false ? 'text-error' : 'text-muted'}`}>
        {result?.text}
      </p>
    </form>
  )
}

/** The product plus two pairings, each tickable with its own size, added to the bag together. */
export function FrequentlyBought({ product, onAddMain }: { product: Product; onAddMain: () => boolean }) {
  const { addItem, setOpen } = useCart()
  const notify = useToast()
  const extras = useMemo(() => varied(relatedProducts(product, 12), 2), [product])
  const [picked, setPicked] = useState<Record<string, boolean>>({})
  const [sizes, setSizes] = useState<Record<string, string>>({})

  if (!extras.length) return null
  const isPicked = (id: string) => picked[id] !== false
  const sizeFor = (p: Product) => sizes[p.id] ?? (p.sizes.includes('M') ? 'M' : p.sizes[0])
  const chosen = extras.filter((p) => isPicked(p.id))
  const total = product.price + chosen.reduce((n, p) => n + p.price, 0)

  const addAll = () => {
    if (!onAddMain()) return
    for (const p of chosen) {
      addItem(
        {
          id: p.id,
          name: p.name,
          type: p.type,
          image: p.image,
          size: sizeFor(p),
          color: p.color,
          fit: p.fit,
          price: p.price,
          teeHex: p.teeHex,
          printHex: p.printHex,
          printLines: p.printLines,
          glyph: p.glyph,
          font: p.font,
          backdrop: p.backdrop,
          backdropHex: p.backdropHex,
        },
        { openBag: false },
      )
    }
    setOpen(true)
    notify(`${chosen.length + 1} items added to your bag.`, { label: 'View bag', to: '/cart' })
  }

  return (
    <section className="mt-16 border-t border-line pt-12" aria-labelledby="bundle-title">
      <h2 id="bundle-title" className="h-section">
        Wear it with
      </h2>
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center">
        <div className="flex items-center gap-3">
          {[product, ...extras].map((p, i) => (
            <div key={p.id} className="flex flex-1 items-center gap-3">
              {i > 0 && (
                <span aria-hidden="true" className="font-display text-2xl text-gold">
                  +
                </span>
              )}
              <div className={`spot flex-1 p-2 transition-opacity duration-300 ${i === 0 || isPicked(p.id) ? '' : 'opacity-35'}`}>
                <GarmentImage product={p} detail="card" />
              </div>
            </div>
          ))}
        </div>
        <div className="grid gap-4">
          <ul className="grid gap-3">
            <li className="flex items-center justify-between gap-3 text-sm">
              <span className="min-w-0">
                <b className="font-medium text-bone">This design:</b> <span className="text-muted">{product.name}</span>
              </span>
              <span className="tabular-nums">{money(product.price)}</span>
            </li>
            {extras.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <label className="flex min-w-0 flex-1 items-center gap-3">
                  <input
                    type="checkbox"
                    className="size-4 shrink-0 accent-[var(--color-gold)]"
                    checked={isPicked(p.id)}
                    onChange={(e) => setPicked((s) => ({ ...s, [p.id]: e.target.checked }))}
                  />
                  <span className="truncate">{p.name}</span>
                </label>
                <label className="sr-only" htmlFor={`bundle-size-${p.id}`}>
                  Size for {p.name}
                </label>
                <select
                  id={`bundle-size-${p.id}`}
                  className="select h-10 min-h-10 w-20 text-sm"
                  value={sizeFor(p)}
                  onChange={(e) => setSizes((s) => ({ ...s, [p.id]: e.target.value }))}
                  disabled={!isPicked(p.id)}
                >
                  {p.sizes.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <span className="w-16 text-right tabular-nums">{money(p.price)}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4">
            <p className="font-display text-2xl font-semibold uppercase tracking-[0.04em]">
              Together <AnimatedNumber value={total} format={money} />
            </p>
            <button type="button" className="btn btn-primary" onClick={addAll}>
              Add {chosen.length + 1} to bag
            </button>
          </div>
          <p className="text-xs text-muted">Uses the size you picked above for this design.</p>
        </div>
      </div>
    </section>
  )
}
