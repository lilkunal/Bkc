/**
 * Paints a product onto a canvas card for the 3D ring: the product photo, else the photo mockup,
 * else a drawn garment with its print. Same order of preference as components/GarmentImage.tsx.
 */
import type { Product } from '../data/catalog'
import { MOCKUP_WIDTH, imageSrc, renderMockup } from '../lib/mockup'
import { drawPrint, hasPrint, type PrintSpec } from '../lib/print'
import { teeShape } from '../lib/tee'
import { cssColor, withAlpha } from '../themes'

export const CARD_PX = { w: 512, h: 640 }

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`image failed to load: ${src}`))
    img.src = src
  })
}

/** The .spot studio tile from index.css, in the current theme. */
function tile() {
  const canvas = document.createElement('canvas')
  canvas.width = CARD_PX.w
  canvas.height = CARD_PX.h
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = cssColor('tile')
  ctx.fillRect(0, 0, CARD_PX.w, CARD_PX.h)
  const glow = ctx.createRadialGradient(CARD_PX.w / 2, CARD_PX.h * 0.36, 0, CARD_PX.w / 2, CARD_PX.h * 0.36, CARD_PX.w * 0.72)
  const bone = cssColor('bone')
  glow.addColorStop(0, withAlpha(bone, 0.08))
  glow.addColorStop(1, withAlpha(bone, 0))
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, CARD_PX.w, CARD_PX.h)
  return { canvas, ctx }
}

const INNER = { x: 40, y: 56, w: CARD_PX.w - 80, h: CARD_PX.h - 112 }

function drawContained(ctx: CanvasRenderingContext2D, img: HTMLImageElement) {
  const k = Math.min(INNER.w / img.naturalWidth, INNER.h / img.naturalHeight)
  const w = img.naturalWidth * k
  const h = img.naturalHeight * k
  ctx.drawImage(img, INNER.x + (INNER.w - w) / 2, INNER.y + (INNER.h - h) / 2, w, h)
}

export async function garmentCard(product: Product): Promise<HTMLCanvasElement> {
  const { canvas, ctx } = tile()
  const print: PrintSpec = {
    printLines: product.printLines,
    glyph: product.glyph,
    font: product.font,
    printHex: product.printHex,
    backdrop: product.backdrop,
    backdropHex: product.backdropHex,
  }

  try {
    const src = product.image
      ? imageSrc(product.image)
      : await renderMockup({ type: product.type, teeHex: product.teeHex, width: MOCKUP_WIDTH.card, print })
    if (src) {
      drawContained(ctx, await loadImage(src))
      return canvas
    }
  } catch {
    // Fall through to the drawn garment.
  }

  const shape = teeShape(product.fit)
  const k = Math.min(INNER.w / 400, INNER.h / 470)
  ctx.save()
  ctx.translate(INNER.x + (INNER.w - 400 * k) / 2, INNER.y + (INNER.h - 470 * k) / 2)
  ctx.scale(k, k)

  ctx.save()
  ctx.filter = 'blur(12px)'
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
  ctx.beginPath()
  ctx.ellipse(200, 455, 140, 12, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  const body = new Path2D(shape.body)
  ctx.fillStyle = product.teeHex
  ctx.fill(body)
  ctx.save()
  ctx.clip(body)
  const light = ctx.createLinearGradient(40, 0, 360, 470)
  light.addColorStop(0, 'rgba(255, 255, 255, 0.16)')
  light.addColorStop(0.5, 'rgba(0, 0, 0, 0)')
  light.addColorStop(1, 'rgba(0, 0, 0, 0.3)')
  ctx.fillStyle = light
  ctx.fillRect(0, 0, 400, 470)
  if (hasPrint(print)) {
    await document.fonts.load(`40px ${print.font}`, print.printLines.join(' ') || 'BKC').catch(() => undefined)
    drawPrint(ctx, print, shape.print)
  }
  ctx.restore()
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)'
  ctx.lineWidth = 1.6
  ctx.stroke(body)
  ctx.restore()
  return canvas
}
