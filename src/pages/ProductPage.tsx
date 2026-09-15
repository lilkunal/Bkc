import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { usePageTitle } from '../lib/usePageTitle'
import { ProductDetails } from '../components/ProductDetails'
import { ProductReviews } from '../components/ProductReviews'
import { Lightbox } from '../components/Lightbox'
import { WishlistButton } from '../components/WishlistButton'
import { Stars } from '../components/Stars'
import { IconExpand, IconShare } from '../components/Icons'
import { DeliveryCheck, FrequentlyBought, RecentlyViewed } from '../components/CommerceBits'
import { COLORS, GARMENTS, fitInfo, getProductById, relatedProducts } from '../data/catalog'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { money } from '../lib/format'
import { rememberView } from '../lib/recent'
import { GarmentImage } from '../components/GarmentImage'
import { Price, ProductCard, RowHead, TrustBar } from '../components/ProductCard'

type Toast = { tone: 'ok' | 'err'; msg: string } | null

const MAX_QTY = 10

export function ProductPage() {
  const { id } = useParams()
  const product = getProductById(id || '')
  usePageTitle(product?.name ?? 'Product not found')
  const { addItem } = useCart()
  const notify = useToast()
  const buyRef = useRef<HTMLDivElement>(null)
  const [stuck, setStuck] = useState(false)

  const [fit, setFit] = useState(product?.fit ?? '')
  const [color, setColor] = useState(product?.color ?? '')
  const [size, setSize] = useState('')
  const [qty, setQty] = useState(1)
  const [zoom, setZoom] = useState(false)
  const [toast, setToast] = useState<Toast>(null)

  useEffect(() => {
    if (product) {
      setFit(product.fit)
      setColor(product.color)
      setSize('')
      setQty(1)
      setZoom(false)
      setToast(null)
      rememberView(product.id)
    }
  }, [product])

  useEffect(() => {
    const el = buyRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting), { threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [product])

  useEffect(() => {
    if (toast?.tone !== 'ok') return
    const t = window.setTimeout(() => setToast(null), 2200)
    return () => window.clearTimeout(t)
  }, [toast])

  const colourOptions = useMemo(
    () => (product ? [product.color, ...product.alsoIn].filter((k, i, all) => COLORS[k] && all.indexOf(k) === i) : []),
    [product],
  )

  if (!product) {
    return (
      <div className="shell grid justify-items-center gap-5 py-24 text-center">
        <h1 className="h-section">Product not found</h1>
        <p className="lede">That design may have been retired, or the link is off by a letter.</p>
        <Link to="/shop" className="btn btn-secondary">
          Back to the shop
        </Link>
      </div>
    )
  }

  const garment = GARMENTS[product.type]
  const fitMeta = fitInfo(product.type, fit)
  const colorMeta = COLORS[color] ?? COLORS[product.color]
  const printHex = colorMeta.key === product.color ? product.printHex : colorMeta.ink
  const sizes = fitMeta.key === product.fit ? product.sizes : fitMeta.sizes
  const related = relatedProducts(product, 4)

  const add = (options: { openBag?: boolean } = {}) => {
    if (!size) {
      setToast({ tone: 'err', msg: 'Pick a size first.' })
      buyRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      return false
    }
    addItem(
      {
        id: product.id,
        name: product.name,
        type: product.type,
        image: product.image,
        size,
        color: colorMeta.key,
        fit: fitMeta.key,
        price: product.price,
        qty,
        teeHex: colorMeta.hex,
        printHex,
        printLines: product.printLines,
        glyph: product.glyph,
        font: product.font,
        backdrop: product.backdrop,
        backdropHex: product.backdropHex,
      },
      options,
    )
    setToast({ tone: 'ok', msg: 'Added to bag.' })
    return true
  }

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url })
        return
      }
      await navigator.clipboard.writeText(url)
      notify('Link copied.')
    } catch (err) {
      if ((err as DOMException)?.name !== 'AbortError') notify('Couldn’t share from this browser.')
    }
  }

  const specs: [string, string][] = [
    ['Garment', `${garment.label} · ${fitMeta.label}`],
    ['Fabric', fitMeta.weight],
    ['Print', product.type === 'shirt' ? 'Chest print' : 'Water-based screen print'],
    ['SKU', product.id],
  ]

  return (
    <div className="shell py-8 md:py-12">
      <nav aria-label="Breadcrumb" className="micro mb-6">
        <Link to="/shop" className="u">
          Shop
        </Link>
        <span aria-hidden="true" className="mx-2 text-faint">
          /
        </span>
        <Link to={`/shop?type=${product.type}`} className="u">
          {garment.plural}
        </Link>
        <span aria-hidden="true" className="mx-2 text-faint">
          /
        </span>
        <span className="text-bone">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <button type="button" className="spot group relative block cursor-zoom-in self-start overflow-hidden p-6 sm:p-12" aria-label="Enlarge image" onClick={() => setZoom(true)}>
          <GarmentImage product={product} fit={fitMeta.key} teeHex={colorMeta.hex} printHex={printHex} detail="high" className="mx-auto max-w-lg" />
          <span aria-hidden="true" className="card-action absolute right-3 top-3 opacity-70 transition-opacity group-hover:opacity-100">
            <IconExpand className="h-[18px] w-[18px]" />
          </span>
        </button>

        <div>
          {product.badge && <span className="chip chip-active">{product.badge}</span>}
          <h1 className="mt-4 font-display text-[clamp(2rem,1.2rem+2.2vw,3.25rem)] font-medium uppercase leading-[1.04] tracking-[0.02em]">
            {product.name}
          </h1>
          {product.rating != null && (
            <a href="#reviews" className="micro mt-3 inline-flex flex-wrap items-center gap-2 transition-colors hover:text-bone">
              <Stars rating={product.rating} />
              {product.rating.toFixed(1)}
              {product.reviews != null && ` · ${product.reviews.toLocaleString('en-IN')} reviews`}
            </a>
          )}
          <Price price={product.price} mrp={product.mrp} className="mt-4 text-2xl" />
          <p className="mt-1 text-xs text-muted">Inclusive of all taxes</p>
          <p className="lede mt-5 max-w-prose">
            {product.desc || `${product.name}. ${garment.label} in ${fitMeta.weight}.`}
          </p>

          <div ref={buyRef} className="mt-8 grid gap-7">
            <fieldset>
              <legend className="field-label mb-3">Fit</legend>
              <div className="flex flex-wrap gap-2">
                {Object.values(garment.fits).map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    aria-pressed={fitMeta.key === f.key}
                    onClick={() => {
                      setFit(f.key)
                      setSize('')
                    }}
                    className="chip-btn"
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </fieldset>

            {colourOptions.length > 1 && (
              <fieldset>
                <legend className="field-label mb-3">
                  Colour · <span className="text-bone">{colorMeta.name}</span>
                </legend>
                <div className="flex flex-wrap gap-3">
                  {colourOptions.map((k) => (
                    <button
                      key={k}
                      type="button"
                      aria-label={COLORS[k].name}
                      aria-pressed={colorMeta.key === k}
                      onClick={() => setColor(k)}
                      className="swatch"
                      style={{ background: COLORS[k].hex }}
                    />
                  ))}
                </div>
              </fieldset>
            )}

            <fieldset>
              <legend className="field-label mb-3">Size</legend>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={size === s}
                    onClick={() => {
                      setSize(s)
                      setToast(null)
                    }}
                    className="size-btn"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <div className="stepper stepper-lg" role="group" aria-label="Quantity">
                  <button type="button" onClick={() => setQty((n) => Math.max(1, n - 1))} disabled={qty <= 1} aria-label="Decrease quantity">
                    −
                  </button>
                  <output aria-live="polite">{qty}</output>
                  <button type="button" onClick={() => setQty((n) => Math.min(MAX_QTY, n + 1))} disabled={qty >= MAX_QTY} aria-label="Increase quantity">
                    +
                  </button>
                </div>
                <button type="button" onClick={() => add()} className="btn btn-primary flex-1 sm:flex-none sm:px-12">
                  Add to bag · {money(product.price * qty)}
                </button>
                <WishlistButton product={product} className="btn btn-secondary px-4" withLabel />
                <button type="button" className="icon-btn border border-line" aria-label="Share this design" onClick={share} style={{ borderRadius: 'var(--radius)' }}>
                  <IconShare className="h-[18px] w-[18px]" />
                </button>
              </div>
              <p role="status" className={`min-h-[1.4em] text-sm ${toast?.tone === 'err' ? 'text-error' : 'text-success'}`}>
                {toast?.msg}
              </p>
            </div>

            <DeliveryCheck />
          </div>

          <ProductDetails product={product} fit={fitMeta} />

          <dl className="mt-8 grid gap-5 text-sm sm:grid-cols-2">
            {specs.map(([term, value]) => (
              <div key={term}>
                <dt className="field-label">{term}</dt>
                <dd className="mt-1">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-14">
        <TrustBar />
      </div>

      <FrequentlyBought product={product} onAddMain={() => add({ openBag: false })} />

      <ProductReviews product={product} />

      {related.length > 0 && (
        <section className="mt-16" aria-labelledby="related-title">
          <RowHead title="You may also like" id="related-title" to={`/shop?type=${product.type}`} />
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      <RecentlyViewed key={product.id} exclude={[product.id]} />

      {stuck && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-md md:hidden">
          <div className="flex gap-2">
            <label htmlFor="sticky-size" className="sr-only">
              Size
            </label>
            <select id="sticky-size" value={size} onChange={(e) => setSize(e.target.value)} className="select flex-1">
              <option value="">Size</option>
              {sizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button type="button" onClick={() => add()} className="btn btn-primary flex-[1.4] px-3">
              Add · {money(product.price * qty)}
            </button>
          </div>
        </div>
      )}

      {zoom && (
        <Lightbox
          product={product}
          fit={fitMeta.key}
          colour={colorMeta.key}
          colours={colourOptions}
          onColour={setColor}
          onClose={() => setZoom(false)}
        />
      )}
    </div>
  )
}
