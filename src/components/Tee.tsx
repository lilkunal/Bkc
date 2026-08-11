import { useEffect, useMemo } from 'react'
import { ensureTeeDefs, renderTee, type RenderOpts } from '../lib/tee'
import type { Product } from '../data/catalog'

type Props = {
  product?: Product
  fit?: string
  teeHex?: string
  printHex?: string
  lines?: string[]
  glyph?: string
  font?: string
  backdrop?: string
  backdropHex?: string
  detail?: RenderOpts['detail']
  alt?: string
  className?: string
}

export function Tee({
  product,
  fit,
  teeHex,
  printHex,
  lines,
  glyph,
  font,
  backdrop,
  backdropHex,
  detail = 'card',
  alt,
  className = '',
}: Props) {
  useEffect(() => {
    ensureTeeDefs()
  }, [])

  const html = useMemo(() => {
    if (product) {
      return renderTee({
        fit: fit || product.fit,
        teeHex: teeHex || product.teeHex,
        printHex: printHex || product.printHex,
        glyph: glyph ?? product.glyph,
        lines: lines || product.printLines,
        font: font || product.font,
        backdrop: backdrop || product.backdrop,
        backdropHex: backdropHex || product.backdropHex,
        detail,
        alt: alt || `${product.name} t-shirt`,
      })
    }
    return renderTee({
      fit: fit || 'oversized',
      teeHex: teeHex || '#FFFFFF',
      printHex: printHex || '#0E0E0C',
      glyph,
      lines: lines || [],
      font: font || "'Anton', Impact, sans-serif",
      backdrop,
      backdropHex,
      detail,
      alt: alt || 'T-shirt',
    })
  }, [
    product,
    fit,
    teeHex,
    printHex,
    lines,
    glyph,
    font,
    backdrop,
    backdropHex,
    detail,
    alt,
  ])

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
