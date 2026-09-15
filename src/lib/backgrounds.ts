/**
 * Generated SVG backgrounds: layered dunes, low-poly peaks, soft blobs and embers.
 * The idea comes from haikei.app (codeawy/haikei); this code is original. Seeded, so a seed always
 * draws the same shapes, and colour-free: layers carry a 0–1 tone that the component maps to theme colours.
 */

export const VIEW = { w: 1440, h: 900 }

export type ShapeKind = 'dunes' | 'peaks' | 'blobs' | 'embers'

export interface ShapeLayer {
  /** Path for filled layers. */
  d?: string
  /** Circles for scatter layers. */
  circles?: { cx: number; cy: number; r: number }[]
  /** 0 = surface colour, 1 = accent colour. */
  tone: number
  opacity: number
  /** Horizontal drift in viewBox units. */
  drift: number
}

/** Small, fast, seeded PRNG (mulberry32). */
export function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const f = (n: number) => n.toFixed(1)

/** Smooth open curve through points (Catmull-Rom as cubic Béziers), closed down to the bottom edge. */
function curveToBottom(points: [number, number][], bottom: number) {
  let d = `M${f(points[0][0])},${f(points[0][1])}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[Math.min(i + 2, points.length - 1)]
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${f(c1[0])},${f(c1[1])} ${f(c2[0])},${f(c2[1])} ${f(p2[0])},${f(p2[1])}`
  }
  const last = points[points.length - 1]
  return `${d} L${f(last[0])},${bottom} L${f(points[0][0])},${bottom} Z`
}

/** Smooth closed curve through points. */
function closedCurve(points: [number, number][]) {
  const n = points.length
  let d = `M${f(points[0][0])},${f(points[0][1])}`
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n]
    const p1 = points[i]
    const p2 = points[(i + 1) % n]
    const p3 = points[(i + 2) % n]
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${f(c1[0])},${f(c1[1])} ${f(c2[0])},${f(c2[1])} ${f(p2[0])},${f(p2[1])}`
  }
  return `${d} Z`
}

// Layers run 160 units past each side, so drifting never shows an edge.
const PAD = 160

export function dunes(seed: number, layers = 5): ShapeLayer[] {
  const r = rng(seed)
  return Array.from({ length: layers }, (_, i) => {
    const baseY = VIEW.h * (0.38 + i * 0.12)
    const amp = 70 - i * 8
    const steps = 5
    const points = Array.from({ length: steps + 1 }, (_, j): [number, number] => {
      const x = -PAD + ((VIEW.w + PAD * 2) / steps) * j
      return [x, baseY + (r() - 0.5) * 2 * amp]
    })
    return { d: curveToBottom(points, VIEW.h + 20), tone: 0.12 + (i / (layers - 1)) * 0.5, opacity: 1, drift: 18 + i * 12 }
  })
}

export function peaks(seed: number, layers = 4): ShapeLayer[] {
  const r = rng(seed)
  return Array.from({ length: layers }, (_, i) => {
    const baseY = VIEW.h * (0.4 + i * 0.13)
    const steps = 9 - i
    let d = ''
    for (let j = 0; j <= steps; j++) {
      const x = -PAD + ((VIEW.w + PAD * 2) / steps) * j
      const y = baseY - (j % 2 ? r() * (150 - i * 25) : r() * 30)
      d += `${j ? 'L' : 'M'}${f(x)},${f(y)} `
    }
    d += `L${VIEW.w + PAD},${VIEW.h + 20} L${-PAD},${VIEW.h + 20} Z`
    return { d, tone: 0.1 + (i / (layers - 1)) * 0.45, opacity: 1, drift: 10 + i * 10 }
  })
}

export function blobs(seed: number, count = 6): ShapeLayer[] {
  const r = rng(seed)
  return Array.from({ length: count }, () => {
    const cx = r() * VIEW.w
    const cy = r() * VIEW.h
    const radius = 140 + r() * 220
    const n = 8
    const points = Array.from({ length: n }, (_, k): [number, number] => {
      const a = (k / n) * Math.PI * 2
      const rr = radius * (0.72 + r() * 0.5)
      return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]
    })
    return { d: closedCurve(points), tone: 0.35 + r() * 0.65, opacity: 0.22 + r() * 0.3, drift: 30 + r() * 50 }
  })
}

export function embers(seed: number, count = 70): ShapeLayer[] {
  const r = rng(seed)
  const groups = 3
  return Array.from({ length: groups }, (_, g) => ({
    circles: Array.from({ length: Math.round(count / groups) }, () => ({
      cx: r() * VIEW.w,
      cy: VIEW.h * (0.25 + r() * 0.75),
      r: 1.2 + r() * (g === 2 ? 7 : 3.5),
    })),
    tone: 0.7 + g * 0.15,
    opacity: 0.35 + g * 0.2,
    drift: 14 + g * 16,
  }))
}

export function shapes(kind: ShapeKind, seed: number): ShapeLayer[] {
  if (kind === 'dunes') return dunes(seed)
  if (kind === 'peaks') return peaks(seed)
  if (kind === 'blobs') return blobs(seed)
  return embers(seed)
}
