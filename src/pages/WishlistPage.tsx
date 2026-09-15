import { Link } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'
import { getProductById, type Product } from '../data/catalog'
import { usePageTitle } from '../lib/usePageTitle'
import { ProductCard, SectionHead } from '../components/ProductCard'

export function WishlistPage() {
  usePageTitle('Wishlist')
  const { ids, clear } = useWishlist()
  const products = ids.map((id) => getProductById(id)).filter((p): p is Product => !!p)

  return (
    <div className="shell py-10 md:py-14">
      <SectionHead
        level={1}
        eyebrow={`Saved · ${products.length}`}
        title="Your wishlist"
        note="Kept in this browser only. No account needed."
        action={
          products.length > 0 ? (
            <button type="button" className="u micro text-bone" onClick={clear}>
              Clear wishlist
            </button>
          ) : undefined
        }
      />
      {products.length === 0 ? (
        <div className="grid justify-items-center gap-4 border border-line bg-surface px-6 py-16 text-center">
          <p className="h-section">Nothing saved yet</p>
          <p className="lede">Tap the heart on any design to keep it here for later.</p>
          <Link to="/shop" className="btn btn-secondary">
            Browse the shop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
