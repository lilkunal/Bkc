import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import type { Product } from '../data/catalog'
import { useReducedMotion } from '../lib/useMediaQuery'
import { cssColor } from '../themes'
import type { RingHandle } from '../three/ringScene'
import { IconChevron } from './Icons'
import { Price } from './Price'
import { ProductCard } from './ProductCard'

type Props = { products: Product[]; eyebrow: string; title: string; note: string }

/** The collection as a ring of 3D cards (three.js), in theme colours. Without WebGL it shows a normal product row. */
export function CollectionRing({ products, eyebrow, title, note }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ring = useRef<RingHandle | null>(null)
  const navigate = useNavigate()
  const go = useRef(navigate)
  useEffect(() => {
    go.current = navigate
  })
  const reduced = useReducedMotion()
  const { theme } = useTheme()
  const [front, setFront] = useState(0)
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>('loading')
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !products.length) return
    let cancelled = false
    let visible = false
    let handle: RingHandle | null = null
    const sync = () => handle?.setActive(visible && document.visibilityState === 'visible')
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        sync()
      },
      { rootMargin: '120px' },
    )
    io.observe(canvas)
    document.addEventListener('visibilitychange', sync)

    Promise.all([import('../three/ringScene'), import('../three/garmentCard')])
      .then(([{ createCollectionRing }, { garmentCard }]) => {
        if (cancelled) return
        handle = createCollectionRing(canvas, {
          count: products.length,
          reducedMotion: reduced,
          colors: { back: cssColor('surface'), accent: cssColor('gold'), tile: cssColor('tile') },
          onFront: setFront,
          onSelect: (i) => go.current(`/product/${products[i].id}`),
          onReady: () => setStatus('ready'),
        })
        ring.current = handle
        sync()
        products.forEach((p, i) => {
          garmentCard(p).then(
            (card) => {
              if (!cancelled) handle?.setTexture(i, card)
            },
            () => undefined,
          )
        })
      })
      .catch(() => {
        if (!cancelled) setStatus('failed')
      })

    return () => {
      cancelled = true
      io.disconnect()
      document.removeEventListener('visibilitychange', sync)
      handle?.dispose()
      ring.current = null
    }
  }, [products, reduced, theme.key])

  useEffect(() => {
    ring.current?.setAutoplay(!paused)
  }, [paused, status])

  if (!products.length) return null
  const current = products[front] ?? products[0]

  return (
    <section className="overflow-hidden pt-16 md:pt-24" aria-labelledby="ring-title">
      <div className="shell grid justify-items-center gap-3 text-center">
        <p className="eyebrow">{eyebrow}</p>
        <h2 id="ring-title" className="h-section">
          {title}
        </h2>
        <p className="lede">{note}</p>
      </div>

      {status === 'failed' ? (
        <div className="shell mt-10 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
          {products.slice(0, 4).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      ) : (
        <>
          <div className="ring-stage mt-2">
            <canvas
              key={`${reduced ? 'still' : 'moving'}-${theme.key}`}
              ref={canvasRef}
              aria-hidden="true"
              className={`ring-canvas transition-opacity duration-1000 ease-lux ${status === 'ready' ? 'opacity-100' : 'opacity-0'}`}
            />
          </div>
          <div className="shell -mt-4 flex items-center justify-center gap-3 sm:gap-8">
            <button type="button" className="icon-btn shrink-0 border border-line" aria-label="Previous design" onClick={() => ring.current?.step(-1)}>
              <IconChevron dir="left" />
            </button>
            <div className="grid min-w-0 flex-1 justify-items-center gap-1.5 text-center sm:max-w-[26rem]">
              <p className="micro tabular-nums">
                {String(front + 1).padStart(2, '0')} / {String(products.length).padStart(2, '0')}
              </p>
              <Link
                to={`/product/${current.id}`}
                className="font-display text-[1.5rem] font-semibold uppercase leading-tight tracking-[0.04em] transition-colors hover:text-gold"
              >
                {current.name}
              </Link>
              <Price price={current.price} mrp={current.mrp} className="justify-center" />
            </div>
            <button type="button" className="icon-btn shrink-0 border border-line" aria-label="Next design" onClick={() => ring.current?.step(1)}>
              <IconChevron dir="right" />
            </button>
          </div>
          {!reduced && (
            <div className="mt-4 flex justify-center">
              <button type="button" className="u micro text-bone" onClick={() => setPaused((p) => !p)}>
                {paused ? 'Resume spinning' : 'Pause spinning'}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
