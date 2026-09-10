import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Product } from '../data/catalog'
import { discount, money } from '../lib/format'
import { Tee } from './Tee'
import { IconDrop, IconLayers, IconLock, IconTruck } from './Icons'

export function Price({ price, mrp, className = '' }: { price: number; mrp: number; className?: string }) {
  return (
    <p className={`price ${className}`}>
      <span>{money(price)}</span>
      {mrp > price && (
        <>
          <s>
            <span className="sr-only">was </span>
            {money(mrp)}
          </s>
          <em>{discount(price, mrp)}% off</em>
        </>
      )}
    </p>
  )
}

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const href = `/product/${product.id}`
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: Math.min(index * 0.04, 0.24), duration: 0.5, ease: 'easeOut' }}
      className="group flex min-w-0 flex-col"
    >
      <Link to={href} tabIndex={-1} aria-hidden="true" className="spot relative block overflow-hidden p-3 sm:p-5">
        <Tee
          product={product}
          detail="card"
          className="mx-auto w-full max-w-[300px] transition-transform duration-700 ease-lux group-hover:scale-[1.03]"
        />
        {product.badge && <span className="badge">{product.badge}</span>}
      </Link>
      <div className="grid gap-1 px-0.5 pt-3.5">
        <h3 className="text-[0.9375rem] font-medium leading-snug">
          <Link to={href} className="transition-colors hover:text-gold">
            {product.name}
          </Link>
        </h3>
        <p className="text-xs uppercase tracking-[0.08em] text-muted">
          {product.fit} · {product.colorName}
        </p>
        <Price price={product.price} mrp={product.mrp} className="mt-0.5" />
      </div>
    </motion.article>
  )
}

export function SectionHead({
  eyebrow,
  title,
  note,
  action,
  id,
  level = 2,
  flush = false,
}: {
  eyebrow?: string
  title: ReactNode
  note?: ReactNode
  action?: ReactNode
  id?: string
  level?: 1 | 2
  flush?: boolean
}) {
  const Heading = level === 1 ? 'h1' : 'h2'
  return (
    <div className={`flex flex-col gap-4 md:flex-row md:items-end md:justify-between ${flush ? '' : 'mb-8 md:mb-10'}`}>
      <div className="grid gap-3">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <Heading id={id} className="h-section">
          {title}
        </Heading>
      </div>
      {(note || action) && (
        <div className="grid gap-4 md:max-w-md md:justify-items-end md:text-right">
          {note && <p className="lede">{note}</p>}
          {action}
        </div>
      )}
    </div>
  )
}

export function RowHead({
  title,
  to,
  id,
  linkLabel = 'View all',
}: {
  title: string
  to?: string
  id?: string
  linkLabel?: string
}) {
  return (
    <div className="mb-5 flex items-baseline justify-between gap-4">
      <h2 id={id} className="h-label">
        {title}
      </h2>
      {to && (
        <Link to={to} className="u micro text-gold">
          {linkLabel}
        </Link>
      )}
    </div>
  )
}

/** The ** divider. Signature rule 2 in DESIGN.md caps ** at three placements. */
export function Ornament() {
  return (
    <p className="ornament" aria-hidden="true">
      **
    </p>
  )
}

const TRUST = [
  { Icon: IconLayers, title: '240 GSM cotton', note: 'Boxy, drop-shoulder, heavy' },
  { Icon: IconDrop, title: 'Water-based inks', note: 'Skin-safe, soft hand-feel' },
  { Icon: IconTruck, title: 'Ships in 48 hours', note: 'Across India' },
  { Icon: IconLock, title: 'UPI & cards', note: 'Secure checkout at launch' },
]

export function TrustBar() {
  return (
    <ul className="grid grid-cols-1 border-l border-t border-line sm:grid-cols-2 lg:grid-cols-4" aria-label="Why BKC">
      {TRUST.map(({ Icon, title, note }) => (
        <li key={title} className="flex items-center gap-4 border-b border-r border-line p-5">
          <span className="text-gold">
            <Icon />
          </span>
          <span className="grid gap-0.5">
            <span className="h-label">{title}</span>
            <span className="text-[0.8125rem] text-muted">{note}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}
