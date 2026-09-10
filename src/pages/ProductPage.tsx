import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { COLORS, FITS, getProductById, relatedProducts, type ColorKey, type FitKey } from '../data/catalog'
import { useCart } from '../context/CartContext'
import { money } from '../lib/format'
import { Tee } from '../components/Tee'
import { Price, ProductCard, RowHead, TrustBar } from '../components/ProductCard'

function isColorKey(k: string): k is ColorKey {
  return Object.prototype.hasOwnProperty.call(COLORS, k)
}

type Toast = { tone: 'ok' | 'err'; msg: string } | null

export function ProductPage() {
  const { id } = useParams()
  const product = getProductById(id || '')
  const { addItem } = useCart()
  const buyRef = useRef<HTMLDivElement>(null)
  const [stuck, setStuck] = useState(false)

  const [fit, setFit] = useState<FitKey>(product?.fit || 'oversized')
  const [color, setColor] = useState<ColorKey>(product?.color || 'white')
  const [size, setSize] = useState('')
  const [toast, setToast] = useState<Toast>(null)

  useEffect(() => {
    if (product) {
      setFit(product.fit)
      setColor(product.color)
      setSize('')
      setToast(null)
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

  const colorMeta = COLORS[color]
  const fitMeta = FITS[fit]
  const sizes: string[] = fitMeta.sizes || ['S', 'M', 'L', 'XL']

  const colourOptions = useMemo((): ColorKey[] => {
    if (!product) return []
    const keys = Array.from(new Set([product.color, ...(product.alsoIn || []), 'white', 'black' as const]))
    return keys.filter(isColorKey)
  }, [product])

  if (!product) {
    return (
      <div className="shell grid justify-items-center gap-5 py-24 text-center">
        <h1 className="h-section">Tee not found</h1>
        <p className="lede">That design may have been retired, or the link is off by a letter.</p>
        <Link to="/shop" className="btn btn-secondary">
          Back to the shop
        </Link>
      </div>
    )
  }

  const related = relatedProducts(product, 4)

  const add = () => {
    if (!size) {
      setToast({ tone: 'err', msg: 'Pick a size first.' })
      return
    }
    addItem({
      id: product.id,
      name: product.name,
      size,
      color,
      fit,
      price: product.price,
      teeHex: colorMeta.hex,
      printHex: colorMeta.ink,
      printLines: product.printLines,
      glyph: product.glyph,
      font: product.font,
      backdrop: product.backdrop,
      backdropHex: product.backdropHex,
    })
    setToast({ tone: 'ok', msg: 'Added to bag.' })
  }

  const specs: [string, string][] = [
    ['GSM', String(fitMeta.gsm)],
    ['Print', 'Water-based screen'],
    ['SKU', product.id],
    ['Ships', '48 hours (demo)'],
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
        <span className="text-bone">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="spot self-start p-6 sm:p-12">
          <Tee product={product} fit={fit} teeHex={colorMeta.hex} printHex={colorMeta.ink} detail="high" className="mx-auto max-w-md" />
        </div>

        <div>
          {product.badge && <span className="chip chip-active">{product.badge}</span>}
          <h1 className="mt-4 font-display text-[clamp(2rem,1.2rem+2.2vw,3.25rem)] font-medium uppercase leading-[1.04] tracking-[0.02em]">
            {product.name}
          </h1>
          <p className="micro mt-3">
            ★ {product.rating.toFixed(1)} · {product.reviews.toLocaleString('en-IN')} reviews
          </p>
          <Price price={product.price} mrp={product.mrp} className="mt-4 text-2xl" />
          <p className="lede mt-5 max-w-prose">
            {product.desc || `${product.name}, printed on ${fitMeta.label} ${fitMeta.gsm} GSM cotton.`}
          </p>

          <div ref={buyRef} className="mt-8 grid gap-7">
            <fieldset>
              <legend className="field-label mb-3">Fit</legend>
              <div className="flex flex-wrap gap-2">
                {Object.values(FITS).map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    aria-pressed={fit === f.key}
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
                    aria-pressed={color === k}
                    onClick={() => setColor(k)}
                    className="swatch"
                    style={{ background: COLORS[k].hex }}
                  />
                ))}
              </div>
            </fieldset>

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
              <button type="button" onClick={add} className="btn btn-primary w-full sm:w-auto sm:justify-self-start sm:px-12">
                Add to bag · {money(product.price)}
              </button>
              <p role="status" className={`min-h-[1.4em] text-sm ${toast?.tone === 'err' ? 'text-error' : 'text-success'}`}>
                {toast?.msg}
              </p>
            </div>
          </div>

          <dl className="mt-6 grid gap-5 border-t border-line pt-6 text-sm sm:grid-cols-2">
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

      {related.length > 0 && (
        <section className="mt-16" aria-labelledby="related-title">
          <RowHead title="You may also like" id="related-title" to="/shop" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

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
            <button type="button" onClick={add} className="btn btn-primary flex-[1.4] px-3">
              Add · {money(product.price)}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
