import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useReducedMotion } from 'framer-motion'
import type { Product } from '../data/catalog'
import { GarmentImage } from './GarmentImage'
import { InfiniteSlider } from './motion'

/** A slow, endless strip of products. Slows on hover, stops while focused or paused; a plain scroller with reduced motion. */
export function Marquee({ products, label }: { products: Product[]; label: string }) {
  const [paused, setPaused] = useState(false)
  const [focused, setFocused] = useState(false)
  const reduced = useReducedMotion()

  return (
    <div className="grid gap-5">
      <div
        className="marquee-mask"
        role="region"
        aria-label={label}
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false)
        }}
      >
        <InfiniteSlider gap={16} speed={36} speedOnHover={8} paused={paused || focused}>
          {(copy) =>
            products.map((p) => (
              <div key={`${copy ? 'copy' : 'main'}-${p.id}`} className="w-[168px] shrink-0 sm:w-[210px]" aria-hidden={copy || undefined} inert={copy || undefined}>
                <Link to={`/product/${p.id}`} className="group grid gap-2.5">
                  <div className="spot overflow-hidden p-3">
                    <GarmentImage product={p} detail="card" className="transition-transform duration-700 ease-lux group-hover:scale-[1.04]" />
                  </div>
                  <span className="truncate text-sm text-muted transition-colors group-hover:text-bone">{p.name}</span>
                </Link>
              </div>
            ))
          }
        </InfiniteSlider>
      </div>
      {!reduced && (
        <button type="button" className="u micro justify-self-center text-bone" onClick={() => setPaused((p) => !p)}>
          {paused ? 'Play the strip' : 'Pause the strip'}
        </button>
      )}
    </div>
  )
}
