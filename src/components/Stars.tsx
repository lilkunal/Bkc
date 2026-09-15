import { IconStar } from './Icons'

export function Stars({ rating, className = '' }: { rating: number; className?: string }) {
  const full = Math.round(rating)
  return (
    <span className={`inline-flex gap-0.5 text-gold ${className}`} role="img" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <IconStar key={i} filled={i < full} />
      ))}
    </span>
  )
}
