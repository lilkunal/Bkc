import { Link } from 'react-router-dom'
import { usePageTitle } from '../lib/usePageTitle'

export function NotFoundPage() {
  usePageTitle('Page not found')

  return (
    <div className="shell grid justify-items-center gap-5 py-24 text-center md:py-32">
      <p className="eyebrow">404</p>
      <h1 className="h-section">This page doesn’t exist</h1>
      <p className="lede">The link may be old or mistyped. Everything we sell is one click away.</p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn btn-primary">
          Back to home
        </Link>
        <Link to="/shop" className="btn btn-secondary">
          Shop everything
        </Link>
      </div>
    </div>
  )
}
