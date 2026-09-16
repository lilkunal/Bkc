/**
 * Photo mockups, built in the browser: recolour a blank garment photo and print a design onto it.
 * The maps come from scripts/prepare-mockups.py (fold shading in RGB, garment mask in alpha)
 * and are listed in public/mockups/mockups.json. With no map for a garment type, callers fall back.
 */

import { drawPrint, hasPrint, printBounds, type PrintSpec } from './print'

export interface MockupSpec {
  src: string
  width: number
  height: number
  /** Print box centre and size, as fractions of the image. */
  print: { x: number; y: number; w: number; h: number }
  /** How strongly folds bend the print (pixels per 1000px of image width). */
  warp?: number
}

export type MockupManifest = Record<string, MockupSpec>

export type MockupDetail = 'flat' | 'card' | 'high'

/** Output width per use; covers 2× screens at the sizes these slots render. */
export const MOCKUP_WIDTH: Record<MockupDetail, number> = { flat: 240, card: 640, high: 1200 }

export interface MockupRequest {
  type: string
  teeHex: string
  print: PrintSpec
  /** Output width in pixels. */
  width: number
  /** Garment fit, for the 3D fallback's silhouette. */
  fit?: string
}

const BASE = import.meta.env.BASE_URL

/** Resolve a sheet image value: full URLs as-is, anything else relative to the site base. */
export function imageSrc(image: string) {
  return /^https?:\/\//i.test(image) ? image : BASE + image.replace(/^\/+/, '')
}
let manifest: Promise<MockupManifest> | null = null

export function loadMockupManifest(): Promise<MockupManifest> {
  manifest ??= fetch(`${BASE}mockups/mockups.json`)
    .then((r) => (r.ok ? (r.json() as Promise<MockupManifest>) : {}))
    .catch(() => ({}))
  return manifest
}

interface Layer {
  width: number
  height: number
  shade: Float32Array
  alpha: Uint8ClampedArray
}

const layers = new Map<string, Promise<Layer>>()

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`mockup image failed to load: ${src}`))
    img.src = src
  })
}

function layerFor(spec: MockupSpec, width: number): Promise<Layer> {
  const key = `${spec.src}@${width}`
  let layer = layers.get(key)
  if (!layer) {
    layer = loadImage(BASE + spec.src.replace(/^\/+/, '')).then((img) => {
      const height = Math.round((width * spec.height) / spec.width)
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d', { willReadFrequently: true })!
      ctx.drawImage(img, 0, 0, width, height)
      const data = ctx.getImageData(0, 0, width, height).data
      const shade = new Float32Array(width * height)
      const alpha = new Uint8ClampedArray(width * height)
      for (let i = 0, j = 0; j < shade.length; i += 4, j++) {
        shade[j] = data[i] / 200 // prepare-mockups.py stores shade × 200
        alpha[j] = data[i + 3]
      }
      return { width, height, shade, alpha }
    })
    layers.set(key, layer)
  }
  return layer
}

function rgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', '').padEnd(6, '0').slice(0, 6), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

// Only two composites at a time, so long product grids stay responsive.
let running = 0
const queue: (() => void)[] = []
async function acquire() {
  if (running >= 2) await new Promise<void>((resolve) => queue.push(resolve))
  running++
}
function release() {
  running--
  queue.shift()?.()
}

const results = new Map<string, Promise<string | null>>()

/** No blank-garment photo: render the three.js T-shirt instead (null without WebGL). */
async function bake3d(req: MockupRequest): Promise<string | null> {
  try {
    const { bakeTee } = await import('../three/teeBaker')
    return await bakeTee({ fit: req.fit ?? 'regular', teeHex: req.teeHex, print: req.print }, req.width)
  } catch {
    return null
  }
}

/** Resolves to an object URL for the finished mockup, or null when this garment type has no map. */
export function renderMockup(req: MockupRequest): Promise<string | null> {
  const p = req.print
  const key = [req.type, req.fit ?? '', req.width, req.teeHex, p.printHex, p.font, p.printLines.join('/'), p.glyph, p.backdrop, p.backdropHex].join('|')
  let result = results.get(key)
  if (!result) {
    result = compose(req).catch(() => null)
    results.set(key, result)
  }
  return result
}

async function compose(req: MockupRequest): Promise<string | null> {
  const spec = (await loadMockupManifest())[req.type]
  if (!spec) return bake3d(req)

  await acquire()
  try {
    const { width: w, height: h, shade, alpha } = await layerFor(spec, req.width)
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!
    const out = ctx.createImageData(w, h)
    const px = out.data

    // Fabric: multiply the colour by the fold shading. On dark colours, add a little of the
    // shading back so folds and highlights don't disappear into flat black.
    const [cr, cg, cb] = rgb(req.teeHex)
    const lift = 0.22 * (1 - (0.2126 * cr + 0.7152 * cg + 0.0722 * cb) / 255)
    for (let j = 0, i = 0; j < shade.length; j++, i += 4) {
      const a = alpha[j]
      if (!a) continue
      const s = shade[j]
      const extra = (s - 1) * 255 * lift
      px[i] = cr * s + extra
      px[i + 1] = cg * s + extra
      px[i + 2] = cb * s + extra
      px[i + 3] = a
    }

    if (hasPrint(req.print)) {
      const sample = req.print.printLines.join(' ') || 'BKC'
      await document.fonts.load(`40px ${req.print.font}`, sample).catch(() => undefined)

      const boxW = Math.round(spec.print.w * w)
      const boxH = Math.round(spec.print.h * h)
      const bx = Math.round(spec.print.x * w - boxW / 2)
      const by = Math.round(spec.print.y * h - boxH / 2)
      if (boxW > 4 && boxH > 4) {
        const inkCanvas = document.createElement('canvas')
        inkCanvas.width = boxW
        inkCanvas.height = boxH
        const ictx = inkCanvas.getContext('2d', { willReadFrequently: true })!
        const anchor = { x: 200, y: 200, w: req.type === 'shirt' ? 150 : 184 }
        const b = printBounds(req.print, anchor)
        const k = Math.min(boxW / b.w, boxH / b.h)
        ictx.setTransform(k, 0, 0, k, boxW / 2 - (b.x + b.w / 2) * k, boxH / 2 - (b.y + b.h / 2) * k)
        drawPrint(ictx, req.print, anchor)
        const ink = ictx.getImageData(0, 0, boxW, boxH).data

        // Lay the ink onto the fabric: folds darken it and bend it slightly.
        const warp = ((spec.warp ?? 30) * w) / 1000
        for (let y = 0; y < boxH; y++) {
          const gy = by + y
          if (gy < 1 || gy >= h - 1) continue
          for (let x = 0; x < boxW; x++) {
            const gx = bx + x
            if (gx < 1 || gx >= w - 1) continue
            const g = gy * w + gx
            if (!alpha[g]) continue
            const sx = Math.round(x - (shade[g + 1] - shade[g - 1]) * warp)
            const sy = Math.round(y - (shade[g + w] - shade[g - w]) * warp)
            if (sx < 0 || sy < 0 || sx >= boxW || sy >= boxH) continue
            const p = (sy * boxW + sx) * 4
            const ia = (ink[p + 3] / 255) * 0.94 * (alpha[g] / 255)
            if (ia <= 0) continue
            const s = Math.min(shade[g] * 1.04, 1)
            const i = g * 4
            px[i] = px[i] * (1 - ia) + ink[p] * s * ia
            px[i + 1] = px[i + 1] * (1 - ia) + ink[p + 1] * s * ia
            px[i + 2] = px[i + 2] * (1 - ia) + ink[p + 2] * s * ia
          }
        }
      }
    }

    ctx.putImageData(out, 0, 0)
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.9))
    return blob ? URL.createObjectURL(blob) : null
  } finally {
    release()
  }
}
