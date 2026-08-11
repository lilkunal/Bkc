/** Procedural SVG tee renderer — no photos, no CDN. */

import type { FitKey, Product } from '../data/catalog'

export type TeeDetail = 'high' | 'card' | 'flat'

export type BackdropKind = 'none' | 'burst' | 'ring' | 'box' | 'banner' | 'star'

export interface RenderOpts {
  fit?: FitKey | string
  teeHex?: string
  printHex?: string
  glyph?: string
  lines?: string[]
  font?: string
  backdrop?: BackdropKind | string
  backdropHex?: string
  detail?: TeeDetail
  flat?: boolean
  alt?: string
}

interface PrintAnchor {
  x: number
  y: number
  w: number
}

interface TeeShape {
  body: string
  collar: string
  neckLine: string
  hem: string
  cuffs: string[]
  armholes: string[]
  folds: string[]
  lights: string[]
  ao: [number, number, number, number]
  print: PrintAnchor
}

const SHAPES: Record<string, TeeShape> = {
  regular: {
    body:
      'M166 60 C152 62 136 64 124 68 C106 78 84 90 68 102 L58 128 L96 168 ' +
      'C104 158 112 152 118 146 C116 240 114 336 112 428 ' +
      'C142 435 258 435 288 428 C286 336 284 240 282 146 ' +
      'C288 152 296 158 304 168 L342 128 L332 102 ' +
      'C316 90 294 78 276 68 C264 64 248 62 234 60 ' +
      'C231 80 217 90 200 90 C183 90 169 80 166 60 Z',
    collar:
      'M166 60 C169 80 183 90 200 90 C217 90 231 80 234 60 L243 62 ' +
      'C240 85 221 99 200 99 C179 99 160 85 157 62 Z',
    neckLine: 'M157 62 C160 85 179 99 200 99 C221 99 240 85 243 62',
    hem: 'M112 428 C142 435 258 435 288 428',
    cuffs: ['M58 128 L96 168', 'M342 128 L304 168'],
    armholes: ['M124 68 C116 96 112 122 118 146', 'M276 68 C284 96 288 122 282 146'],
    folds: [
      'M136 176 C130 260 132 344 128 422',
      'M264 176 C270 260 268 344 272 422',
      'M176 216 C170 290 172 358 168 424',
      'M228 224 C234 296 232 362 236 424',
    ],
    lights: ['M200 140 C197 240 199 336 200 424', 'M156 190 C152 270 154 348 150 422'],
    ao: [200, 106, 84, 30],
    print: { x: 200, y: 214, w: 152 },
  },

  oversized: {
    body:
      'M164 62 C148 64 126 69 104 76 C84 88 58 104 38 118 L28 152 L70 196 ' +
      'C78 186 85 178 90 172 C88 252 86 332 84 412 ' +
      'C120 420 280 420 316 412 C314 332 312 252 310 172 ' +
      'C315 178 322 186 330 196 L372 152 L362 118 ' +
      'C342 104 316 88 296 76 C274 69 252 64 236 62 ' +
      'C233 82 218 92 200 92 C182 92 167 82 164 62 Z',
    collar:
      'M164 62 C167 82 182 92 200 92 C218 92 233 82 236 62 L246 64 ' +
      'C243 88 222 101 200 101 C178 101 157 88 154 64 Z',
    neckLine: 'M154 64 C157 88 178 101 200 101 C222 101 243 88 246 64',
    hem: 'M84 412 C120 420 280 420 316 412',
    cuffs: ['M28 152 L70 196', 'M372 152 L330 196'],
    armholes: ['M104 76 C96 104 92 140 90 172', 'M296 76 C304 104 308 140 310 172'],
    folds: [
      'M114 200 C108 276 110 348 106 406',
      'M286 200 C292 276 290 348 294 406',
      'M162 240 C156 306 158 360 154 408',
      'M240 248 C246 312 244 364 248 408',
      'M200 272 C197 328 199 372 200 408',
    ],
    lights: ['M200 150 C197 246 199 332 200 406', 'M138 212 C134 284 136 350 132 404'],
    ao: [200, 118, 94, 32],
    print: { x: 200, y: 224, w: 184 },
  },

  crop: {
    body:
      'M166 60 C152 62 136 64 124 68 C106 78 84 90 68 102 L58 128 L96 168 ' +
      'C104 158 112 152 118 146 C117 210 115 268 114 322 ' +
      'C144 329 256 329 286 322 C285 268 283 210 282 146 ' +
      'C288 152 296 158 304 168 L342 128 L332 102 ' +
      'C316 90 294 78 276 68 C264 64 248 62 234 60 ' +
      'C231 80 217 90 200 90 C183 90 169 80 166 60 Z',
    collar:
      'M166 60 C169 80 183 90 200 90 C217 90 231 80 234 60 L243 62 ' +
      'C240 85 221 99 200 99 C179 99 160 85 157 62 Z',
    neckLine: 'M157 62 C160 85 179 99 200 99 C221 99 240 85 243 62',
    hem: 'M114 322 C144 329 256 329 286 322',
    cuffs: ['M58 128 L96 168', 'M342 128 L304 168'],
    armholes: ['M124 68 C116 96 112 122 118 146', 'M276 68 C284 96 288 122 282 146'],
    folds: [
      'M138 176 C132 230 134 280 130 316',
      'M262 176 C268 230 266 280 270 316',
      'M180 206 C174 254 176 292 172 318',
    ],
    lights: ['M200 140 C197 210 199 270 200 318'],
    ao: [200, 106, 84, 30],
    print: { x: 200, y: 200, w: 142 },
  },

  kids: {
    body:
      'M176 110 C166 111 155 113 148 116 C134 124 118 133 108 142 L100 162 L128 192 ' +
      'C134 185 140 180 144 176 C143 248 141 320 140 392 ' +
      'C162 398 238 398 260 392 C259 320 257 248 256 176 ' +
      'C260 180 266 185 272 192 L300 162 L292 142 ' +
      'C282 133 266 124 252 116 C245 113 234 111 224 110 ' +
      'C222 125 213 133 200 133 C187 133 178 125 176 110 Z',
    collar:
      'M176 110 C178 125 187 133 200 133 C213 133 222 125 224 110 L231 112 ' +
      'C229 129 216 140 200 140 C184 140 171 129 169 112 Z',
    neckLine: 'M169 112 C171 129 184 140 200 140 C216 140 229 129 231 112',
    hem: 'M140 392 C162 398 238 398 260 392',
    cuffs: ['M100 162 L128 192', 'M300 162 L272 192'],
    armholes: ['M148 116 C142 138 140 158 144 176', 'M252 116 C258 138 260 158 256 176'],
    folds: [
      'M158 200 C154 260 156 326 153 386',
      'M242 200 C246 260 244 326 247 386',
      'M186 224 C182 276 184 332 181 388',
    ],
    lights: ['M200 176 C197 244 199 312 200 388'],
    ao: [200, 146, 58, 22],
    print: { x: 200, y: 258, w: 112 },
  },
}

const BACKDROPS: Record<string, string> = {
  none: '',
  burst: '<circle cx="200" cy="{cy}" r="112" fill="{c}"/>',
  ring: '<circle cx="200" cy="{cy}" r="106" fill="none" stroke="{c}" stroke-width="9"/>',
  box: '<rect x="98" y="{by}" width="204" height="168" fill="{c}"/>',
  banner: '<rect x="78" y="{ry}" width="244" height="54" fill="{c}"/>',
  star: '<path d="M200 {sy}l17 68 66-19-49 49 57 42-70 2 9 66-30-55-30 55 9-66-70-2 57-42-49-49 66 19z" fill="{c}"/>',
}

const DEFS_ID = 'bkc-tee-defs'

function defsMarkup(): string {
  return (
    '' +
    '<svg id="' +
    DEFS_ID +
    '" aria-hidden="true" focusable="false" ' +
    'style="position:absolute;width:0;height:0;overflow:hidden;pointer-events:none"><defs>' +
    '<linearGradient id="bkcSide" x1="0" y1="0" x2="1" y2="0">' +
    '<stop offset="0" stop-color="#000" stop-opacity=".30"/>' +
    '<stop offset=".10" stop-color="#000" stop-opacity=".13"/>' +
    '<stop offset=".26" stop-color="#fff" stop-opacity=".13"/>' +
    '<stop offset=".46" stop-color="#fff" stop-opacity=".07"/>' +
    '<stop offset=".70" stop-color="#000" stop-opacity=".05"/>' +
    '<stop offset=".89" stop-color="#000" stop-opacity=".15"/>' +
    '<stop offset="1" stop-color="#000" stop-opacity=".32"/>' +
    '</linearGradient>' +
    '<linearGradient id="bkcVert" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0" stop-color="#000" stop-opacity=".20"/>' +
    '<stop offset=".16" stop-color="#000" stop-opacity="0"/>' +
    '<stop offset=".78" stop-color="#000" stop-opacity="0"/>' +
    '<stop offset="1" stop-color="#000" stop-opacity=".20"/>' +
    '</linearGradient>' +
    '<radialGradient id="bkcNeckAO">' +
    '<stop offset="0" stop-color="#000" stop-opacity=".20"/>' +
    '<stop offset=".55" stop-color="#000" stop-opacity=".07"/>' +
    '<stop offset="1" stop-color="#000" stop-opacity="0"/>' +
    '</radialGradient>' +
    '<pattern id="bkcWeave" width="3" height="3" patternUnits="userSpaceOnUse">' +
    '<path d="M0 .5H3" stroke="#000" stroke-width=".6" opacity=".07"/>' +
    '<path d="M.5 0V3" stroke="#fff" stroke-width=".6" opacity=".09"/>' +
    '</pattern>' +
    '<filter id="bkcGrain" x="0" y="0" width="100%" height="100%">' +
    '<feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/>' +
    '<feColorMatrix type="saturate" values="0"/>' +
    '</filter>' +
    '<filter id="bkcSoft" x="-30%" y="-30%" width="160%" height="160%">' +
    '<feGaussianBlur stdDeviation="6"/>' +
    '</filter>' +
    '<filter id="bkcSofter" x="-30%" y="-30%" width="160%" height="160%">' +
    '<feGaussianBlur stdDeviation="11"/>' +
    '</filter>' +
    '<filter id="bkcInkWarp" x="-25%" y="-25%" width="150%" height="150%">' +
    '<feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="2" seed="9" result="w"/>' +
    '<feDisplacementMap in="SourceGraphic" in2="w" scale="5" ' +
    'xChannelSelector="R" yChannelSelector="G"/>' +
    '</filter>' +
    '<filter id="bkcSpeckle" x="0" y="0" width="100%" height="100%">' +
    '<feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="4"/>' +
    '<feColorMatrix type="matrix" values="' +
    '0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.7 1.02"/>' +
    '</filter>' +
    '<mask id="bkcInkMask" maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="470">' +
    '<rect width="400" height="470" fill="#fff"/>' +
    '<rect width="400" height="470" filter="url(#bkcSpeckle)" opacity=".55"/>' +
    '</mask>' +
    '<filter id="bkcCast" x="-25%" y="-20%" width="150%" height="150%">' +
    '<feDropShadow dx="0" dy="12" stdDeviation="12" flood-color="#0E0E0C" flood-opacity=".24"/>' +
    '</filter>' +
    '</defs></svg>'
  )
}

let defsReady = false

export function ensureTeeDefs(): void {
  if (defsReady || typeof document === 'undefined') return
  if (document.getElementById(DEFS_ID)) {
    defsReady = true
    return
  }
  if (!document.body) return
  const host = document.createElement('div')
  host.innerHTML = defsMarkup()
  const node = host.firstChild
  if (node) document.body.insertBefore(node, document.body.firstChild)
  defsReady = true
}

function esc(s: unknown): string {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function fitSize(text: string, maxWidth: number, cap: number): number {
  const len = Math.max(String(text).length, 1)
  return Math.max(11, Math.min(cap, (maxWidth / len) * 1.72))
}

function rgb(hex: string): [number, number, number] {
  let h = String(hex).replace('#', '')
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
  return [
    parseInt(h.slice(0, 2), 16) || 0,
    parseInt(h.slice(2, 4), 16) || 0,
    parseInt(h.slice(4, 6), 16) || 0,
  ]
}

function luma(hex: string): number {
  const c = rgb(hex)
  return (c[0] * 299 + c[1] * 587 + c[2] * 114) / 1000
}

function shade(hex: string, f: number): string {
  const c = rgb(hex).map((v) => Math.max(0, Math.min(255, Math.round(v * f))))
  return '#' + c.map((v) => ('0' + v.toString(16)).slice(-2)).join('')
}

/** Render one garment as an inline SVG string. */
export function renderTee(o: RenderOpts = {}): string {
  ensureTeeDefs()

  const shape = SHAPES[o.fit || ''] || SHAPES.regular
  const tee = o.teeHex || '#FFFFFF'
  const ink = o.printHex || '#0E0E0C'
  const font = o.font || "'Anton', Impact, sans-serif"
  const lines = (o.lines || []).filter(Boolean).slice(0, 3)
  const detail: TeeDetail = o.detail || (o.flat ? 'flat' : 'card')
  const flat = detail === 'flat'
  const high = detail === 'high'
  const uid = 'r' + Math.random().toString(36).slice(2, 8)
  const pr = shape.print
  const light = luma(tee) > 150

  const thread = light ? 'rgba(0,0,0,.26)' : 'rgba(255,255,255,.30)'
  const edge = light ? 'rgba(0,0,0,.42)' : 'rgba(0,0,0,.55)'

  let backdrop = ''
  if (o.backdrop && BACKDROPS[o.backdrop] && o.backdrop !== 'none') {
    backdrop = BACKDROPS[o.backdrop]
      .replace(/\{c\}/g, o.backdropHex || ink)
      .replace(/\{cy\}/g, String(pr.y))
      .replace(/\{by\}/g, String(pr.y - 84))
      .replace(/\{ry\}/g, String(pr.y - 27))
      .replace(/\{sy\}/g, String(pr.y - 118))
  }

  const glyphSize = lines.length ? 74 : 116
  const hasGlyph = !!o.glyph
  const cap = pr.w > 160 ? 44 : 38
  const sizes = lines.map((l, i) => fitSize(l, pr.w, i === 0 ? cap : cap - 6))
  const totalH =
    sizes.reduce((a, s) => a + s * 1.06, 0) + (hasGlyph ? glyphSize * 0.92 : 0)
  let cursor = pr.y - totalH / 2

  let print = ''
  if (hasGlyph) {
    cursor += glyphSize * 0.78
    print +=
      '<text x="' +
      pr.x +
      '" y="' +
      cursor.toFixed(1) +
      '" font-size="' +
      glyphSize +
      '" text-anchor="middle">' +
      esc(o.glyph) +
      '</text>'
    cursor += glyphSize * 0.2
  }
  lines.forEach((l, i) => {
    cursor += sizes[i] * 0.96
    print +=
      '<text x="' +
      pr.x +
      '" y="' +
      cursor.toFixed(1) +
      '" font-size="' +
      sizes[i].toFixed(1) +
      '" font-family="' +
      esc(font) +
      '" fill="' +
      esc(ink) +
      '" text-anchor="middle" letter-spacing="0.5">' +
      esc(l) +
      '</text>'
    cursor += sizes[i] * 0.12
  })

  let printGroup = ''
  if (backdrop || print) {
    const inkAttrs = flat
      ? ''
      : ' filter="url(#bkcInkWarp)" mask="url(#bkcInkMask)" style="mix-blend-mode:multiply"'
    printGroup =
      '<g transform="rotate(-0.5 200 ' +
      pr.y +
      ')" opacity="' +
      (flat ? 1 : 0.93) +
      '"' +
      inkAttrs +
      '>' +
      backdrop +
      print +
      '</g>'
  }

  let folds = ''
  let lights = ''
  let weave = ''
  let grain = ''
  if (!flat) {
    folds =
      '<g filter="url(#bkcSoft)" opacity=".26">' +
      shape.folds
        .map((d, i) => {
          return (
            '<path d="' +
            d +
            '" fill="none" stroke="#000" stroke-width="' +
            (i % 2 ? 6 : 10) +
            '" stroke-linecap="round" opacity="' +
            (i % 3 ? 0.8 : 0.5) +
            '"/>'
          )
        })
        .join('') +
      '</g>'
    lights =
      '<g filter="url(#bkcSofter)" opacity=".2">' +
      shape.lights
        .map((d) => {
          return (
            '<path d="' +
            d +
            '" fill="none" stroke="#fff" stroke-width="20" stroke-linecap="round"/>'
          )
        })
        .join('') +
      '</g>'
    weave = '<rect width="400" height="470" fill="url(#bkcWeave)"/>'
    if (high) {
      grain =
        '<rect width="400" height="470" filter="url(#bkcGrain)" opacity=".13" ' +
        'style="mix-blend-mode:multiply"/>'
    }
  }

  let construction = ''
  if (!flat) {
    construction =
      '<path d="' +
      shape.collar +
      '" fill="' +
      shade(tee, light ? 0.93 : 1.16) +
      '"/>' +
      '<path d="' +
      shape.collar +
      '" fill="url(#bkcWeave)" opacity=".8"/>' +
      '<path d="' +
      shape.neckLine +
      '" fill="none" stroke="' +
      thread +
      '" stroke-width="1.1" stroke-dasharray="2.5 2.5"/>' +
      '<path d="' +
      shape.hem +
      '" fill="none" stroke="' +
      thread +
      '" stroke-width="1" stroke-dasharray="3 3" transform="translate(0,-9)"/>' +
      '<path d="' +
      shape.hem +
      '" fill="none" stroke="' +
      thread +
      '" stroke-width="1" stroke-dasharray="3 3" transform="translate(0,-5)"/>' +
      shape.cuffs
        .map((d) => {
          return (
            '<path d="' +
            d +
            '" fill="none" stroke="' +
            thread +
            '" stroke-width="1" stroke-dasharray="3 3"/>'
          )
        })
        .join('') +
      (shape.armholes || [])
        .map((d) => {
          return (
            '<path d="' +
            d +
            '" fill="none" stroke="' +
            thread +
            '" stroke-width="1" stroke-dasharray="3 2.5"/>'
          )
        })
        .join('') +
      (shape.armholes || [])
        .map((d) => {
          return (
            '<path d="' +
            d +
            '" fill="none" stroke="#000" stroke-opacity=".16" ' +
            'stroke-width="9" filter="url(#bkcSoft)"/>'
          )
        })
        .join('')
  }

  const ao = shape.ao || ([200, 110, 88, 32] as [number, number, number, number])
  const shading = flat
    ? ''
    : '<rect width="400" height="470" fill="url(#bkcSide)"/>' +
      '<rect width="400" height="470" fill="url(#bkcVert)"/>' +
      '<ellipse cx="' +
      ao[0] +
      '" cy="' +
      ao[1] +
      '" rx="' +
      ao[2] +
      '" ry="' +
      ao[3] +
      '" fill="url(#bkcNeckAO)"/>'

  const cast = flat ? '' : ' filter="url(#bkcCast)"'

  return (
    '' +
    '<svg class="tee-svg" viewBox="0 0 400 470" xmlns="http://www.w3.org/2000/svg" role="img" ' +
    'aria-label="' +
    esc(o.alt || 'T-shirt') +
    '">' +
    '<defs><clipPath id="' +
    uid +
    '"><path d="' +
    shape.body +
    '"/></clipPath></defs>' +
    '<g' +
    cast +
    '>' +
    '<path d="' +
    shape.body +
    '" fill="' +
    esc(tee) +
    '"/>' +
    '<g clip-path="url(#' +
    uid +
    ')">' +
    weave +
    printGroup +
    folds +
    lights +
    shading +
    grain +
    construction +
    '</g>' +
    '<path d="' +
    shape.body +
    '" fill="none" stroke="' +
    edge +
    '" stroke-width="1.6" ' +
    'stroke-linejoin="round"/>' +
    '</g>' +
    '</svg>'
  )
}

/** Convenience: render straight from a catalogue product record. */
export function renderProductTee(
  p: Product,
  overrides: Partial<RenderOpts> = {},
): string {
  const o = overrides
  return renderTee({
    fit: o.fit || p.fit,
    teeHex: o.teeHex || p.teeHex,
    printHex: o.printHex || p.printHex,
    glyph: p.glyph,
    lines: p.printLines,
    font: p.font,
    backdrop: p.backdrop,
    backdropHex: p.backdropHex,
    detail: o.detail,
    flat: o.flat,
    alt: p.name + ' — ' + p.fit + ' fit t-shirt in ' + p.colorName,
  })
}

export const teeFits = Object.keys(SHAPES)
export const teeBackdrops = Object.keys(BACKDROPS)
