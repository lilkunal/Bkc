import { useId, useMemo, type CSSProperties } from 'react'
import { VIEW, shapes, type ShapeKind } from '../lib/backgrounds'

/** Maps a 0–1 tone to the theme: surface colour at 0, accent at 1. */
const tone = (t: number, strength: number) =>
  `color-mix(in srgb, var(--color-gold) ${Math.round(Math.min(1, t * strength) * 100)}%, var(--color-surface))`

/** A generated SVG background (dunes, peaks, blobs or embers) in the current theme's colours, drifting slowly. */
export function ShapeBackdrop({
  kind,
  seed = 11,
  strength = 1,
  className = '',
}: {
  kind: ShapeKind
  seed?: number
  /** Scales how far layers lean towards the accent colour. */
  strength?: number
  className?: string
}) {
  const layers = useMemo(() => shapes(kind, seed), [kind, seed])
  const blurId = `blur-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`

  return (
    <svg aria-hidden="true" focusable="false" className={`shape-backdrop ${className}`} viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} preserveAspectRatio="xMidYMid slice">
      {kind === 'blobs' && (
        <defs>
          <filter id={blurId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="46" />
          </filter>
        </defs>
      )}
      {layers.map((layer, i) => (
        <g
          key={i}
          className="shape-layer"
          filter={kind === 'blobs' ? `url(#${blurId})` : undefined}
          style={{ '--drift': `${layer.drift}px`, '--dur': `${16 + i * 7}s`, opacity: layer.opacity } as CSSProperties}
        >
          {layer.d ? (
            <path d={layer.d} style={{ fill: tone(layer.tone, strength) }} />
          ) : (
            layer.circles?.map((c, j) => <circle key={j} cx={c.cx} cy={c.cy} r={c.r} style={{ fill: tone(layer.tone, strength) }} />)
          )}
        </g>
      ))}
    </svg>
  )
}
