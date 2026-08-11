import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { COLORS, FITS, getProductById, relatedProducts, type ColorKey, type FitKey } from '../data/catalog'
import { useCart } from '../context/CartContext'
import { discount, money } from '../lib/format'
import { Tee } from '../components/Tee'
import { ProductCard } from '../components/ProductCard'

function isColorKey(k: string): k is ColorKey {
  return Object.prototype.hasOwnProperty.call(COLORS, k)
}

export function ProductPage() {
  const { id } = useParams()
  const product = getProductById(id || '')
  const { addItem } = useCart()
  const buyRef = useRef<HTMLDivElement>(null)
  const [stuck, setStuck] = useState(false)

  const [fit, setFit] = useState<FitKey>(product?.fit || 'oversized')
  const [color, setColor] = useState<ColorKey>(product?.color || 'white')
  const [size, setSize] = useState('')
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (product) {
      setFit(product.fit)
      setColor(product.color)
      setSize('')
    }
  }, [product])

  useEffect(() => {
    const el = buyRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting), {
      threshold: 0,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [product])

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
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="font-display text-3xl uppercase">Tee not found</h1>
        <Link to="/shop" className="mt-4 inline-block underline">
          Back to shop
        </Link>
      </div>
    )
  }

  const related = relatedProducts(product, 4)

  const add = () => {
    if (!size) {
      setToast('Pick a size first')
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
    setToast('Added to bag')
    window.setTimeout(() => setToast(''), 1800)
  }

  return (
    <div className="mx-auto max-w-[1440px] px-[clamp(1rem,0.5rem+2vw,3rem)] py-6 md:py-10">
      <nav className="mb-4 text-xs text-ink-45">
        <Link to="/shop" className="underline">
          Shop
        </Link>{' '}
        / {product.name}
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="border-2 border-ink bg-paper-2 p-4 sm:p-8">
          <Tee
            product={product}
            fit={fit}
            teeHex={colorMeta.hex}
            printHex={colorMeta.ink}
            detail="high"
            className="mx-auto max-w-md"
          />
        </div>

        <div>
          {product.badge && (
            <span className="border-2 border-ink bg-marigold px-2 py-1 font-mono text-xs uppercase">
              {product.badge}
            </span>
          )}
          <h1 className="mt-3 font-display text-[clamp(1.8rem,1rem+2vw,3rem)] uppercase leading-none">
            {product.name}
          </h1>
          <p className="mt-2 text-sm text-ink-70">
            ★ {product.rating.toFixed(1)} · {product.reviews.toLocaleString('en-IN')} reviews
          </p>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="font-mono text-2xl font-bold">{money(product.price)}</span>
            <span className="font-mono text-ink-45 line-through">{money(product.mrp)}</span>
            <span className="text-chilli">{discount(product.price, product.mrp)}% off</span>
          </div>
          <p className="mt-4 max-w-prose text-sm text-ink-70">
            {product.desc ||
              `${product.name} — printed on ${fitMeta.label} ${fitMeta.gsm} GSM cotton.`}
          </p>

          <div ref={buyRef} className="mt-6 space-y-5">
            <fieldset>
              <legend className="mb-2 text-xs uppercase tracking-wide">Fit</legend>
              <div className="flex flex-wrap gap-2">
                {Object.values(FITS).map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => {
                      setFit(f.key)
                      setSize('')
                    }}
                    className={`min-h-11 border-2 border-ink px-3 text-sm ${
                      fit === f.key ? 'bg-ink text-cream' : 'bg-cream'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-2 text-xs uppercase tracking-wide">Colour — {colorMeta.name}</legend>
              <div className="flex flex-wrap gap-2">
                {colourOptions.map((k) => (
                  <button
                    key={k}
                    type="button"
                    aria-label={COLORS[k].name}
                    onClick={() => setColor(k)}
                    className={`h-11 w-11 border-2 ${color === k ? 'border-chilli ring-2 ring-chilli' : 'border-ink'}`}
                    style={{ background: COLORS[k].hex }}
                  />
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-2 text-xs uppercase tracking-wide">Size</legend>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`min-h-11 min-w-11 border-2 border-ink px-3 ${
                      size === s ? 'bg-marigold' : 'bg-cream'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </fieldset>

            <button
              type="button"
              onClick={add}
              className="min-h-12 w-full border-2 border-ink bg-chilli font-bold uppercase text-cream hard-shadow sm:w-auto sm:px-10"
            >
              Add to bag
            </button>
            {toast && <p className="font-mono text-sm text-mint">{toast}</p>}
          </div>

          <dl className="mt-8 grid gap-2 border-t-2 border-ink pt-6 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-ink-45">GSM</dt>
              <dd>{fitMeta.gsm}</dd>
            </div>
            <div>
              <dt className="text-ink-45">Print</dt>
              <dd>Water-based screen</dd>
            </div>
            <div>
              <dt className="text-ink-45">SKU</dt>
              <dd className="font-mono">{product.id}</dd>
            </div>
            <div>
              <dt className="text-ink-45">Ships</dt>
              <dd>48 hours (demo)</dd>
            </div>
          </dl>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-4 font-display text-2xl uppercase">Related</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {stuck && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-ink bg-paper p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:hidden">
          <div className="flex gap-2">
            <select
              name="sticky-size"
              aria-label="Size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="min-h-12 flex-1 border-2 border-ink bg-cream px-2"
            >
              <option value="">Size</option>
              {sizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={add}
              className="min-h-12 flex-[1.4] border-2 border-ink bg-chilli font-bold uppercase text-cream"
            >
              Add · {money(product.price)}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
