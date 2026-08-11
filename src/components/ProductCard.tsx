import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Product } from '../data/catalog'
import { discount, money } from '../lib/format'
import { Tee } from './Tee'

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: Math.min(index * 0.03, 0.24), duration: 0.35 }}
      className="group flex flex-col border-2 border-ink bg-cream"
    >
      <Link to={`/product/${product.id}`} className="block bg-paper-2 p-3 sm:p-4">
        <Tee product={product} detail="card" className="mx-auto w-full max-w-[280px]" />
      </Link>
      <div className="flex flex-1 flex-col gap-1 border-t-2 border-ink p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium leading-snug sm:text-base">
            <Link to={`/product/${product.id}`} className="hover:underline">
              {product.name}
            </Link>
          </h3>
          {product.badge && (
            <span className="shrink-0 bg-marigold px-1.5 py-0.5 font-mono text-[10px] uppercase">
              {product.badge}
            </span>
          )}
        </div>
        <p className="text-xs uppercase tracking-wide text-ink-45">
          {product.fit} · {product.colorName}
        </p>
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="font-mono font-bold">{money(product.price)}</span>
          <span className="font-mono text-xs text-ink-45 line-through">{money(product.mrp)}</span>
          <span className="text-xs text-chilli">{discount(product.price, product.mrp)}% off</span>
        </div>
        <p className="text-xs text-ink-45">
          ★ {product.rating.toFixed(1)} · {product.reviews.toLocaleString('en-IN')} reviews
        </p>
      </div>
    </motion.article>
  )
}

export function Marquee() {
  const items = [
    'OVERSIZED 240 GSM',
    'CLASSIC 180 GSM',
    'KIDS 160 GSM',
    'BOXY CROP 200 GSM',
    'WATER-BASED INKS',
    'SHIPS IN 48 HRS',
  ]
  const loop = [...items, ...items]
  return (
    <div className="overflow-hidden border-y-2 border-ink bg-marigold py-3" aria-hidden>
      <div className="marquee-track font-display text-lg uppercase tracking-wider sm:text-2xl">
        {loop.map((t, i) => (
          <span key={i} className="px-2">
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

export function SectionHead({
  eyebrow,
  title,
  note,
}: {
  eyebrow: string
  title: ReactNode
  note?: string
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 md:mb-8 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ink-45">{eyebrow}</p>
        <h2 className="font-display text-[clamp(2rem,1.2rem+3vw,3.5rem)] uppercase leading-[0.95]">
          {title}
        </h2>
      </div>
      {note && <p className="max-w-md text-sm text-ink-70 md:text-right">{note}</p>}
    </div>
  )
}
