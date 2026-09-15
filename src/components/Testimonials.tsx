import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProductById } from '../data/catalog'
import type { Review } from '../data/reviews'
import { useReducedMotion } from '../lib/useMediaQuery'
import { IconChevron } from './Icons'
import { SectionHead } from './ProductCard'
import { Stars } from './Stars'

/** Review cards in a swipeable row: three across on desktop, advancing on its own until hovered, focused or paused. */
export function Testimonials({ reviews, eyebrow, title }: { reviews: Review[]; eyebrow: string; title: string }) {
  const track = useRef<HTMLUListElement>(null)
  const reduced = useReducedMotion()
  const [paused, setPaused] = useState(false)
  const [holding, setHolding] = useState(false)

  const move = useCallback((dir: 1 | -1) => {
    const el = track.current
    if (!el) return
    const card = el.firstElementChild as HTMLElement | null
    const gap = parseFloat(getComputedStyle(el).columnGap) || 16
    const distance = card ? card.offsetWidth + gap : el.clientWidth
    const behavior: ScrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    const max = el.scrollWidth - el.clientWidth
    if (dir > 0 && el.scrollLeft >= max - 4) el.scrollTo({ left: 0, behavior })
    else if (dir < 0 && el.scrollLeft <= 4) el.scrollTo({ left: max, behavior })
    else el.scrollBy({ left: dir * distance, behavior })
  }, [])

  useEffect(() => {
    if (reduced || paused || holding) return
    const timer = window.setInterval(() => move(1), 6000)
    return () => window.clearInterval(timer)
  }, [reduced, paused, holding, move])

  return (
    <section className="shell pb-16 md:pb-24" aria-labelledby="reviews-title">
      <SectionHead
        eyebrow={eyebrow}
        title={title}
        id="reviews-title"
        action={
          <div className="flex items-center gap-2">
            {!reduced && (
              <button type="button" className="u micro mr-3 text-bone" onClick={() => setPaused((p) => !p)}>
                {paused ? 'Play' : 'Pause'}
              </button>
            )}
            <button type="button" className="icon-btn border border-line" aria-label="Previous reviews" onClick={() => move(-1)}>
              <IconChevron dir="left" />
            </button>
            <button type="button" className="icon-btn border border-line" aria-label="Next reviews" onClick={() => move(1)}>
              <IconChevron dir="right" />
            </button>
          </div>
        }
      />
      <ul
        ref={track}
        className="t-track"
        tabIndex={0}
        aria-label={title}
        onPointerEnter={() => setHolding(true)}
        onPointerLeave={() => setHolding(false)}
        onFocus={() => setHolding(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHolding(false)
        }}
      >
        {reviews.map((r) => {
          const product = r.product ? getProductById(r.product) : undefined
          return (
            <li key={r.id} className="grid content-between gap-6 border border-line bg-surface p-6 md:p-8">
              <figure className="grid gap-4">
                <Stars rating={r.rating} />
                {r.title && <p className="h-label text-bone">{r.title}</p>}
                <blockquote className="font-display text-[1.35rem] leading-snug text-bone">
                  <p>“{r.body}”</p>
                </blockquote>
                <figcaption className="micro">
                  {r.name}
                  {r.city && ` · ${r.city}`}
                </figcaption>
              </figure>
              {product && (
                <Link to={`/product/${product.id}`} className="u micro justify-self-start text-gold">
                  {product.name}
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
