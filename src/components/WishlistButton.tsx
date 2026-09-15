import type { Product } from '../data/catalog'
import { useToast } from '../context/ToastContext'
import { useWishlist } from '../context/WishlistContext'
import { IconHeart } from './Icons'

/** Heart toggle. Icon-only on cards; `withLabel` shows the word next to it. */
export function WishlistButton({ product, className = 'card-action', withLabel = false }: { product: Product; className?: string; withLabel?: boolean }) {
  const { has, toggle } = useWishlist()
  const notify = useToast()
  const saved = has(product.id)
  return (
    <button
      type="button"
      className={className}
      aria-pressed={saved}
      aria-label={withLabel ? undefined : `Save ${product.name} to wishlist`}
      onClick={() => {
        toggle(product.id)
        if (saved) notify('Removed from your wishlist.')
        else notify('Saved to your wishlist.', { label: 'View', to: '/wishlist' })
      }}
    >
      <IconHeart filled={saved} className="h-[18px] w-[18px]" />
      {withLabel && <span>Wishlist</span>}
    </button>
  )
}
