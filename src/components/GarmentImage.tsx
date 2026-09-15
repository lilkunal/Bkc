import { useEffect, useRef, useState } from 'react'
import type { Product } from '../data/catalog'
import { MOCKUP_WIDTH, imageSrc, renderMockup, type MockupDetail } from '../lib/mockup'
import { Tee } from './Tee'

type Detail = MockupDetail

type Props = {
  product?: Product
  type?: string
  /** A real product photo. When set, it's shown as-is. */
  image?: string
  fit?: string
  teeHex?: string
  printHex?: string
  lines?: string[]
  glyph?: string
  font?: string
  backdrop?: string
  backdropHex?: string
  detail?: Detail
  /** Build straight away instead of waiting to scroll into view (above-the-fold images). */
  priority?: boolean
  alt?: string
  className?: string
}

/**
 * Shows a garment the most realistic way available:
 * the product's own photo, else a photo mockup built from the blank garment, else the drawn tee.
 */
export function GarmentImage(props: Props) {
  const { product, detail = 'card', className = '', priority = false } = props
  const type = props.type ?? product?.type ?? 'tee'
  const image = props.image ?? product?.image ?? ''
  const teeHex = props.teeHex ?? product?.teeHex ?? '#FFFFFF'
  const printLines = props.lines ?? product?.printLines ?? []
  const glyph = props.glyph ?? product?.glyph ?? ''
  const font = props.font ?? product?.font ?? "'Anton', Impact, sans-serif"
  const printHex = props.printHex ?? product?.printHex ?? '#0E0E0C'
  const backdrop = props.backdrop ?? product?.backdrop ?? 'none'
  const backdropHex = props.backdropHex ?? product?.backdropHex ?? ''
  const alt = props.alt ?? (product ? `${product.name} ${type === 'shirt' ? 'shirt' : 't-shirt'}` : 'Garment')
  const key = [type, detail, teeHex, printHex, font, printLines.join('/'), glyph, backdrop, backdropHex].join('|')

  const ref = useRef<HTMLDivElement>(null)
  const lastUrl = useRef<string | null>(null)
  const [visible, setVisible] = useState(priority)
  const [result, setResult] = useState<{ key: string; url: string | null } | null>(null)

  useEffect(() => {
    if (image || priority) return
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { rootMargin: '400px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [image, priority])

  useEffect(() => {
    if (image || !visible) return
    let live = true
    renderMockup({ type, teeHex, width: MOCKUP_WIDTH[detail], print: { printLines, glyph, font, printHex, backdrop, backdropHex } }).then((url) => {
      if (!live) return
      if (url) lastUrl.current = url
      setResult({ key, url })
    })
    return () => {
      live = false
    }
    // `key` captures every input to the mockup.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image, visible, key])

  const box = `relative grid aspect-[4/5] place-items-center overflow-hidden ${className}`

  if (image) {
    return (
      <div className={box}>
        <img src={imageSrc(image)} alt={alt} loading={priority ? 'eager' : 'lazy'} decoding="async" className="h-full w-full object-contain" />
      </div>
    )
  }

  const current = result?.key === key ? result : null
  // While a new version builds (e.g. a colour or print-face change), keep showing the last one.
  const url = current ? current.url : lastUrl.current

  return (
    <div ref={ref} className={box}>
      {url ? (
        <img src={url} alt={alt} decoding="async" className="h-full w-full object-contain" />
      ) : current ? (
        <Tee
          product={product}
          fit={props.fit}
          teeHex={teeHex}
          printHex={printHex}
          lines={printLines}
          glyph={glyph}
          font={font}
          backdrop={backdrop}
          backdropHex={backdropHex}
          detail={detail}
          alt={alt}
          className="w-[86%]"
        />
      ) : (
        <span className="sr-only">{alt}</span>
      )}
    </div>
  )
}
