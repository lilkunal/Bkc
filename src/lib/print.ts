/**
 * Draws a product's print (backdrop, emoji glyph, up to three text lines) onto a canvas,
 * using the same layout rules as renderTee() in lib/tee.ts.
 */

export interface PrintSpec {
  printLines: string[]
  glyph: string
  /** CSS font-family for the print text. */
  font: string
  printHex: string
  backdrop: string
  backdropHex: string
}

export interface PrintAnchor {
  x: number
  y: number
  /** Width the text is fitted to. */
  w: number
}

export function fitSize(text: string, maxWidth: number, cap: number) {
  const len = Math.max(text.length, 1)
  return Math.max(11, Math.min(cap, (maxWidth / len) * 1.72))
}

function layout(spec: PrintSpec, pr: PrintAnchor) {
  const lines = spec.printLines.filter(Boolean).slice(0, 3)
  const glyphSize = lines.length ? 74 : 116
  const cap = pr.w > 160 ? 44 : 38
  const sizes = lines.map((line, i) => fitSize(line, pr.w, i === 0 ? cap : cap - 6))
  const totalH = sizes.reduce((sum, s) => sum + s * 1.06, 0) + (spec.glyph ? glyphSize * 0.92 : 0)
  return { lines, glyphSize, sizes, totalH }
}

export function hasPrint(spec: PrintSpec) {
  return spec.printLines.some(Boolean) || !!spec.glyph || (!!spec.backdrop && spec.backdrop !== 'none')
}

/** Box (in anchor units) that contains everything drawPrint() paints. */
export function printBounds(spec: PrintSpec, pr: PrintAnchor) {
  const { totalH } = layout(spec, pr)
  let left = pr.w / 2 + 6
  let right = left
  let top = totalH / 2 + 8
  let bottom = top
  const grow = (l: number, r: number, t: number, b: number) => {
    left = Math.max(left, l)
    right = Math.max(right, r)
    top = Math.max(top, t)
    bottom = Math.max(bottom, b)
  }
  switch (spec.backdrop) {
    case 'burst':
      grow(112, 112, 112, 112)
      break
    case 'ring':
      grow(111, 111, 111, 111)
      break
    case 'box':
      grow(102, 102, 84, 84)
      break
    case 'banner':
      grow(122, 122, 27, 27)
      break
    case 'star':
      grow(91, 91, 118, 90)
      break
  }
  return { x: pr.x - left, y: pr.y - top, w: left + right, h: top + bottom }
}

export function drawPrint(ctx: CanvasRenderingContext2D, spec: PrintSpec, pr: PrintAnchor) {
  const ink = spec.printHex
  const { lines, glyphSize, sizes, totalH } = layout(spec, pr)

  ctx.save()
  ctx.translate(pr.x, pr.y)
  ctx.rotate((-0.5 * Math.PI) / 180)
  ctx.translate(-pr.x, -pr.y)

  if (spec.backdrop && spec.backdrop !== 'none') {
    const colour = spec.backdropHex || ink
    ctx.fillStyle = colour
    ctx.strokeStyle = colour
    if (spec.backdrop === 'burst') {
      ctx.beginPath()
      ctx.arc(pr.x, pr.y, 112, 0, Math.PI * 2)
      ctx.fill()
    } else if (spec.backdrop === 'ring') {
      ctx.beginPath()
      ctx.lineWidth = 9
      ctx.arc(pr.x, pr.y, 106, 0, Math.PI * 2)
      ctx.stroke()
    } else if (spec.backdrop === 'box') {
      ctx.fillRect(pr.x - 102, pr.y - 84, 204, 168)
    } else if (spec.backdrop === 'banner') {
      ctx.fillRect(pr.x - 122, pr.y - 27, 244, 54)
    } else if (spec.backdrop === 'star') {
      ctx.fill(new Path2D(`M${pr.x} ${pr.y - 118}l17 68 66-19-49 49 57 42-70 2 9 66-30-55-30 55 9-66-70-2 57-42-49-49 66 19z`))
    }
  }

  let cursor = pr.y - totalH / 2
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = ink
  if (spec.glyph) {
    cursor += glyphSize * 0.78
    ctx.font = `${glyphSize}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`
    ctx.fillText(spec.glyph, pr.x, cursor)
    cursor += glyphSize * 0.2
  }
  ctx.letterSpacing = '0.5px'
  lines.forEach((line, i) => {
    cursor += sizes[i] * 0.96
    ctx.font = `${sizes[i].toFixed(1)}px ${spec.font}`
    ctx.fillText(line, pr.x, cursor)
    cursor += sizes[i] * 0.12
  })
  ctx.letterSpacing = '0px'
  ctx.restore()
}
