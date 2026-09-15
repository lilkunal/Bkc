import { useRef, useState, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import { COLORS, type Product } from '../data/catalog'
import { useDialog } from '../lib/useDialog'
import { GarmentImage } from './GarmentImage'
import { IconClose } from './Icons'

type Props = {
  product: Product
  fit: string
  colour: string
  colours: string[]
  onColour: (key: string) => void
  onClose: () => void
}

/** Full-screen product image. Zoom with the button (or click the image), move the mouse to look around, switch colours. */
export function Lightbox({ product, fit, colour, colours, onColour, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  useDialog(true, ref, onClose)
  const [zoomed, setZoomed] = useState(false)
  const [origin, setOrigin] = useState('50% 42%')
  const meta = COLORS[colour] ?? COLORS[product.color]
  const printHex = meta.key === product.color ? product.printHex : meta.ink

  // Measured against the unscaled layout box, so the zoom doesn't chase its own transform.
  const aim = (e: MouseEvent<HTMLElement>) => {
    const el = stage.current
    const box = el?.offsetParent?.getBoundingClientRect()
    if (!el || !box) return
    const x = ((e.clientX - box.left - el.offsetLeft) / el.offsetWidth) * 100
    const y = ((e.clientY - box.top - el.offsetTop) / el.offsetHeight) * 100
    setOrigin(`${Math.min(100, Math.max(0, x)).toFixed(1)}% ${Math.min(100, Math.max(0, y)).toFixed(1)}%`)
  }

  return createPortal(
    <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="lightbox-title" className="fixed inset-0 z-[90] flex flex-col bg-night">
      <div className="w-full shrink-0 border-b border-line">
        <div className="shell flex h-[72px] items-center justify-between gap-4">
          <p id="lightbox-title" className="h-label min-w-0 truncate">
            {product.name}
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              className="chip-btn"
              aria-pressed={zoomed}
              onClick={() => {
                setOrigin('50% 42%')
                setZoomed((z) => !z)
              }}
            >
              Zoom
            </button>
            <button type="button" data-autofocus className="icon-btn -mr-2.5" aria-label="Close enlarged image" onClick={onClose}>
              <IconClose />
            </button>
          </div>
        </div>
      </div>

      <div
        className="relative grid min-h-0 flex-1 place-items-center overflow-hidden p-4"
        onPointerMove={(e) => {
          if (zoomed && e.pointerType === 'mouse') aim(e)
        }}
      >
        <div
          ref={stage}
          className={`lightbox-stage ${zoomed ? 'is-zoomed' : ''}`}
          style={{ transformOrigin: origin }}
          onClick={(e) => {
            aim(e)
            setZoomed((z) => !z)
          }}
        >
          <GarmentImage product={product} fit={fit} teeHex={meta.hex} printHex={printHex} detail="high" priority className="h-full w-full" />
        </div>
      </div>

      {colours.length > 1 && (
        <div className="relative z-10 flex w-full shrink-0 flex-wrap items-center justify-center gap-3 border-t border-line bg-night py-4" role="group" aria-label="Colour">
          {colours.map((k) => (
            <button
              key={k}
              type="button"
              className="swatch"
              aria-label={COLORS[k].name}
              aria-pressed={k === meta.key}
              style={{ background: COLORS[k].hex }}
              onClick={() => onColour(k)}
            />
          ))}
        </div>
      )}
    </div>,
    document.body,
  )
}
