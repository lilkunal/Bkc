import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { COLORS, fitInfo, type Product } from '../data/catalog'
import { useCart } from '../context/CartContext'
import { useDialog } from '../lib/useDialog'
import { GarmentImage } from './GarmentImage'
import { IconClose } from './Icons'
import { Price } from './Price'
import { Stars } from './Stars'
import { WishlistButton } from './WishlistButton'

/** Pick colour and size and add to the bag without leaving the grid. */
export function QuickView({ product, onClose }: { product: Product; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useDialog(true, ref, onClose)
  const { addItem } = useCart()
  const [color, setColor] = useState(product.color)
  const [size, setSize] = useState('')
  const [error, setError] = useState('')

  const colours = [product.color, ...product.alsoIn].filter((k, i, all) => COLORS[k] && all.indexOf(k) === i)
  const meta = COLORS[color] ?? COLORS[product.color]
  const printHex = meta.key === product.color ? product.printHex : meta.ink
  const fit = fitInfo(product.type, product.fit)
  const titleId = `quick-${product.id}`

  const add = () => {
    if (!size) {
      setError('Pick a size first.')
      return
    }
    addItem({
      id: product.id,
      name: product.name,
      type: product.type,
      image: product.image,
      size,
      color: meta.key,
      fit: product.fit,
      price: product.price,
      teeHex: meta.hex,
      printHex,
      printLines: product.printLines,
      glyph: product.glyph,
      font: product.font,
      backdrop: product.backdrop,
      backdropHex: product.backdropHex,
    })
    onClose()
  }

  return createPortal(
    <div className="fixed inset-0 z-[80] grid place-items-center p-3 sm:p-6">
      <button type="button" tabIndex={-1} aria-label="Close quick view" className="absolute inset-0 bg-night/80 backdrop-blur-[2px]" onClick={onClose} />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative grid max-h-[92dvh] w-full max-w-4xl overflow-y-auto border border-line bg-surface md:grid-cols-2"
      >
        <button type="button" data-autofocus className="icon-btn absolute right-1 top-1 z-10" aria-label="Close quick view" onClick={onClose}>
          <IconClose />
        </button>
        <div className="spot grid place-items-center p-6 sm:p-10">
          <GarmentImage product={product} teeHex={meta.hex} printHex={printHex} detail="card" priority className="w-full max-w-sm" />
        </div>
        <div className="grid content-start gap-6 p-6 sm:p-8">
          <div className="grid gap-2 pr-8">
            <p className="micro">
              {fit.label} · {meta.name}
            </p>
            <h2 id={titleId} className="font-display text-3xl font-medium uppercase leading-tight tracking-[0.02em]">
              {product.name}
            </h2>
            {product.rating != null && (
              <p className="micro flex items-center gap-2">
                <Stars rating={product.rating} /> {product.rating.toFixed(1)}
              </p>
            )}
            <Price price={product.price} mrp={product.mrp} className="mt-1 text-xl" />
          </div>

          {colours.length > 1 && (
            <fieldset>
              <legend className="field-label mb-3">
                Colour · <span className="text-bone">{meta.name}</span>
              </legend>
              <div className="flex flex-wrap gap-3">
                {colours.map((k) => (
                  <button
                    key={k}
                    type="button"
                    className="swatch"
                    aria-label={COLORS[k].name}
                    aria-pressed={k === meta.key}
                    style={{ background: COLORS[k].hex }}
                    onClick={() => setColor(k)}
                  />
                ))}
              </div>
            </fieldset>
          )}

          <fieldset>
            <legend className="field-label mb-3">Size</legend>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="size-btn"
                  aria-pressed={size === s}
                  onClick={() => {
                    setSize(s)
                    setError('')
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-2">
            <div className="flex flex-wrap gap-3">
              <button type="button" className="btn btn-primary flex-1" onClick={add}>
                Add to bag
              </button>
              <WishlistButton product={product} className="btn btn-secondary px-4" withLabel />
            </div>
            <p role="status" className="min-h-[1.4em] text-sm text-error">
              {error}
            </p>
          </div>

          <Link to={`/product/${product.id}`} className="u micro justify-self-start text-gold" onClick={onClose}>
            View full details
          </Link>
        </div>
      </div>
    </div>,
    document.body,
  )
}
