import type { FormEvent, ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { CATEGORIES, COLORS, GARMENTS, PRODUCT_TYPES, featuredProduct, priceBands } from '../data/catalog'
import { BRAND } from '../data/states'
import { STORE } from '../store.config'
import { money } from '../lib/format'
import { computeTotals } from '../lib/pricing'
import { BackToTop } from './BackToTop'
import { Wordmark } from './Brand'
import { FreeShippingBar } from './CommerceBits'
import { IconBag, IconChevron, IconClose, IconHeart, IconMenu, IconSearch, IconUser } from './Icons'
import { GarmentImage } from './GarmentImage'
import { AnimatedNumber, ScrollProgress, SlidingNumber } from './motion'
import { Price } from './Price'
import { SearchDialog } from './SearchDialog'
import { ThemeOptionsInline, ThemePicker } from './ThemePicker'

const NAV_LEFT = [
  { to: '/shop', label: 'Shop' },
  { to: '/states', label: 'States' },
  { to: '/collections', label: 'Collections' },
]

const NAV_RIGHT = [
  { to: '/blog', label: 'Journal' },
  { to: '/about', label: 'About' },
]

const NAV_ALL = [
  ...NAV_LEFT,
  { to: '/occasions', label: 'Occasions' },
  { to: '/lookbook', label: 'Lookbook' },
  ...NAV_RIGHT,
  { to: '/wishlist', label: 'Wishlist' },
  { to: '/account', label: 'Your account' },
  { to: '/track', label: 'Track an order' },
  ...(STORE.features.marketFile ? [{ to: '/market', label: 'Market file' }] : []),
  ...(STORE.features.caseStudy ? [{ to: '/case-study', label: 'Case study' }] : []),
]

const FOOTER_COLUMNS: { title: string; links: [to: string, label: string][] }[] = [
  {
    title: 'Shop',
    links: [
      ['/shop', 'Shop everything'],
      ['/states', 'States & slang'],
      ['/collections', 'Collections'],
      ['/occasions', 'Occasions'],
      ['/lookbook', 'Lookbook'],
      ['/wishlist', 'Wishlist'],
    ],
  },
  {
    title: 'The label',
    links: [
      ['/about', 'About'],
      ['/blog', 'Journal'],
      ...(STORE.features.marketFile ? [['/market', 'Market file'] as [string, string]] : []),
      ...(STORE.features.caseStudy ? [['/case-study', 'Case study'] as [string, string]] : []),
    ],
  },
  {
    title: 'Help',
    links: [
      ['/track', 'Track an order'],
      ['/account', 'Your account'],
      ['/policies/shipping', 'Shipping'],
      ['/policies/returns', 'Returns & exchanges'],
      ['/about#fits', 'Fits & fabrics'],
      ['/about#contact', 'Contact'],
    ],
  },
]

const desktopNavClass = 'u hidden py-3 text-xs font-medium uppercase tracking-[0.2em] lg:inline-block'

const FEATURED = featuredProduct()
const PRICE_BANDS = priceBands()

const SHOP_COLUMNS: { title: string; links: [to: string, label: string][] }[] = [
  {
    title: 'Garments',
    links: [...PRODUCT_TYPES.map((t): [string, string] => [`/shop?type=${t}`, GARMENTS[t].plural]), ['/shop', 'Shop everything']],
  },
  {
    title: 'Shop by',
    links: [
      ['/shop?sort=newest', 'New arrivals'],
      ['/shop?sort=reviews', 'Best sellers'],
      ['/shop?sort=rating', 'Top rated'],
      ['/collections', 'Collections'],
      ['/wishlist', 'Your wishlist'],
    ],
  },
  ...(PRICE_BANDS.length
    ? [{ title: 'Price', links: PRICE_BANDS.map((b): [string, string] => [`/shop?under=${b.under}`, `Under ${money(b.under)}`]) }]
    : []),
  { title: 'Categories', links: CATEGORIES.slice(0, 7).map((c): [string, string] => [`/shop?cat=${c.key}`, c.label]) },
]

/** Desktop "Shop" link with a mega menu. Opens on hover or with the chevron button; Escape or leaving closes it. */
function ShopMenu() {
  const [open, setOpen] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  const timer = useRef(0)
  const { pathname, search } = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [pathname, search])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggle.current?.focus()
      }
    }
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false)
    }
    const onScroll = () => setOpen(false)
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
      window.removeEventListener('scroll', onScroll)
    }
  }, [open])

  const later = (next: boolean, ms: number) => {
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setOpen(next), ms)
  }

  return (
    <div
      ref={wrap}
      className="hidden items-center gap-0.5 lg:flex"
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') later(true, 120)
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse') later(false, 220)
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false)
      }}
    >
      <NavLink to="/shop" className="u py-3 text-xs font-medium uppercase tracking-[0.2em]">
        Shop
      </NavLink>
      <button
        ref={toggle}
        type="button"
        className="grid h-10 w-7 place-items-center text-muted transition-colors hover:text-gold"
        aria-expanded={open}
        aria-controls="shop-menu"
        aria-label="Shop menu"
        onClick={() => {
          window.clearTimeout(timer.current)
          setOpen((v) => !v)
        }}
      >
        <IconChevron dir="down" className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div id="shop-menu" hidden={!open} className="mega-menu">
        <div className="shell grid grid-cols-[repeat(4,minmax(0,1fr))_minmax(0,1.4fr)] gap-10 py-10">
          {SHOP_COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="eyebrow mb-3">{col.title}</p>
              <ul className="grid">
                {col.links.map(([to, label]) => (
                  <li key={to}>
                    <Link to={to} className="inline-flex min-h-9 items-center text-sm text-muted transition-colors hover:text-bone">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <Link to={`/product/${FEATURED.id}`} className="group grid grid-cols-[132px_minmax(0,1fr)] items-center gap-5 self-start">
            <div className="spot p-2">
              <GarmentImage product={FEATURED} detail="card" />
            </div>
            <div className="grid gap-2">
              <p className="eyebrow">Featured</p>
              <p className="font-display text-xl font-semibold uppercase leading-tight tracking-[0.04em] transition-colors group-hover:text-gold">
                {FEATURED.name}
              </p>
              <Price price={FEATURED.price} mrp={FEATURED.mrp} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

/** Route changes start at the top; hash links land on their section. */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (target) {
        target.scrollIntoView()
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

const countBadge =
  'absolute right-0.5 top-1 flex h-[17px] min-w-[17px] items-center justify-center overflow-hidden rounded-full bg-gold px-1 text-[10px] font-semibold leading-none text-[var(--color-on-gold)]'

export function Header() {
  const { count, setOpen } = useCart()
  const wishlist = useWishlist()
  const [menu, setMenu] = useState(false)
  const [search, setSearch] = useState(false)
  const [hidden, setHidden] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const { pathname } = useLocation()

  useEffect(() => {
    setMenu(false)
  }, [pathname])

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setHidden(y > last && y > 160)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // "/" opens search from anywhere that isn't a text field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return
      const target = e.target as HTMLElement | null
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return
      e.preventDefault()
      setSearch(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!menu) return
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenu(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [menu])

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[110] focus:bg-gold focus:px-4 focus:py-2 focus:text-[var(--color-on-gold)]"
      >
        Skip to content
      </a>

      <div className="border-b border-line bg-surface px-4 py-2.5 text-center text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-gold">
        {STORE.announcement.map((item, i) => (
          <span key={item} className={i > 1 ? 'hidden sm:inline' : undefined}>
            {i > 0 && (
              <span aria-hidden="true" className="mx-3 text-faint">
                ·
              </span>
            )}
            {item}
          </span>
        ))}
      </div>

      <header
        className={`sticky top-0 z-50 border-b border-line bg-night/90 backdrop-blur-md transition-transform duration-500 ease-lux ${
          hidden && !menu ? '-translate-y-full' : ''
        }`}
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="shell grid h-[88px] grid-cols-[1fr_auto_1fr] items-center gap-3">
          <nav className="flex items-center gap-8" aria-label="Primary">
            <button
              type="button"
              className="icon-btn -ml-2.5 lg:hidden"
              aria-expanded={menu}
              aria-controls="mobile-nav"
              aria-label="Open menu"
              onClick={() => setMenu(true)}
            >
              <IconMenu />
            </button>
            {NAV_LEFT.map((n) =>
              n.to === '/shop' ? (
                <ShopMenu key={n.to} />
              ) : (
                <NavLink key={n.to} to={n.to} className={desktopNavClass}>
                  {n.label}
                </NavLink>
              ),
            )}
          </nav>

          <Link to="/" aria-label={`${BRAND.short} home`}>
            <Wordmark />
          </Link>

          <div className="flex items-center justify-end gap-1 lg:gap-8">
            {NAV_RIGHT.map((n) => (
              <NavLink key={n.to} to={n.to} className={desktopNavClass}>
                {n.label}
              </NavLink>
            ))}
            <div className="flex items-center">
              <button type="button" className="icon-btn" aria-label="Search the catalogue" aria-haspopup="dialog" onClick={() => setSearch(true)}>
                <IconSearch />
              </button>
              <Link to="/account" className="icon-btn hidden lg:grid" aria-label="Your account">
                <IconUser />
              </Link>
              <Link to="/wishlist" className="icon-btn" aria-label={`Wishlist, ${wishlist.count} saved`}>
                <IconHeart />
                {wishlist.count > 0 && (
                  <span aria-hidden="true" className={countBadge}>
                    <SlidingNumber value={wishlist.count} />
                  </span>
                )}
              </Link>
              <button
                type="button"
                className="icon-btn -mr-2.5"
                onClick={() => setOpen(true)}
                aria-label={`Open bag, ${count} item${count === 1 ? '' : 's'}`}
              >
                <IconBag />
                {count > 0 && (
                  <span aria-hidden="true" className={countBadge}>
                    <SlidingNumber value={count} />
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {search && <SearchDialog onClose={() => setSearch(false)} />}

      {menu && (
        <div id="mobile-nav" role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-[70] flex flex-col bg-night lg:hidden">
          <div className="shell flex h-[72px] shrink-0 items-center justify-between border-b border-line">
            <span className="eyebrow">Menu</span>
            <button ref={closeRef} type="button" className="icon-btn -mr-2.5" aria-label="Close menu" onClick={() => setMenu(false)}>
              <IconClose />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="shell flex flex-col py-4" aria-label="Mobile">
              {NAV_ALL.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  className={({ isActive }) =>
                    `flex min-h-14 items-center justify-between border-b border-line font-display text-2xl font-semibold uppercase tracking-[0.06em] ${
                      isActive ? 'text-gold' : ''
                    }`
                  }
                >
                  {n.label}
                  <span aria-hidden="true" className="text-base text-gold">
                    →
                  </span>
                </NavLink>
              ))}
            </nav>
            <div className="shell pb-10 pt-4">
              <ThemeOptionsInline />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function ClubSignup() {
  const [status, setStatus] = useState<{ tone: 'ok' | 'err'; msg: string } | null>(null)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const input = form.elements.namedItem('email') as HTMLInputElement | null
    if (!input || !input.value || !input.checkValidity()) {
      setStatus({ tone: 'err', msg: 'Enter a valid email address.' })
      input?.focus()
      return
    }
    setStatus({ tone: 'ok', msg: 'You’re on the list. Demo store: no email was stored.' })
    form.reset()
  }

  return (
    <section className="border-y border-line bg-surface" aria-labelledby="club-title">
      <div className="shell grid gap-6 py-10 md:grid-cols-[1fr_1.2fr] md:items-center">
        <div className="grid gap-2">
          <h2 id="club-title" className="eyebrow">
            Join the BKC Club
          </h2>
          <p className="lede">First dibs on state capsules, festival drops and restocks.</p>
        </div>
        <form noValidate onSubmit={onSubmit}>
          <label htmlFor="club-email" className="sr-only">
            Email address
          </label>
          <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
            <input
              id="club-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Enter your email"
              aria-invalid={status?.tone === 'err' ? true : undefined}
              aria-describedby="club-status"
              className="input"
            />
            <button type="submit" className="btn btn-primary">
              Subscribe
            </button>
          </div>
          <p id="club-status" role="status" className={`mt-2 min-h-[1.4em] text-sm ${status?.tone === 'err' ? 'text-error' : 'text-success'}`}>
            {status?.msg}
          </p>
        </form>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer>
      <div className="shell grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_repeat(3,1fr)_1.3fr]">
        <div className="grid content-start justify-items-start gap-4">
          <Link to="/" aria-label={`${BRAND.short} home`}>
            <Wordmark align="start" tagline={false} />
          </Link>
          <p className="max-w-xs text-sm text-muted">{BRAND.motto} Printed tees for every Indian tongue.</p>
        </div>
        {FOOTER_COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="eyebrow mb-3">{col.title}</h2>
            <ul className="grid">
              {col.links.map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="inline-flex min-h-10 items-center text-sm text-muted transition-colors hover:text-bone">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <div>
          <h2 className="eyebrow mb-4">Payments at launch</h2>
          <ul className="flex flex-wrap gap-2" aria-label="Payment methods planned for launch">
            {STORE.payments.map((m) => (
              <li key={m} className="border border-line px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                {m}
              </li>
            ))}
          </ul>
          <p className="micro mt-4">Demo storefront · nothing is charged</p>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="shell flex flex-wrap justify-between gap-2 py-5">
          <p className="micro">© {new Date().getFullYear()} BKC</p>
          <nav aria-label="Legal" className="flex gap-5">
            <Link to="/policies/privacy" className="micro transition-colors hover:text-bone">
              Privacy
            </Link>
            <Link to="/policies/terms" className="micro transition-colors hover:text-bone">
              Terms
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}

function colourName(key: string) {
  return (COLORS as Record<string, { name: string }>)[key]?.name ?? key
}

export function CartDrawer() {
  const { items, open, setOpen, count, setQty, removeItem, clear, coupon } = useCart()
  const closeRef = useRef<HTMLButtonElement>(null)
  const totals = computeTotals(items, { coupon })

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, setOpen])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-labelledby="bag-title">
      <button
        type="button"
        tabIndex={-1}
        className="absolute inset-0 bg-night/75 backdrop-blur-[2px]"
        aria-label="Close bag"
        onClick={() => setOpen(false)}
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-line bg-surface">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 id="bag-title" className="h-label">
            Your bag ({count})
          </h2>
          <button ref={closeRef} type="button" className="icon-btn -mr-2.5" aria-label="Close bag" onClick={() => setOpen(false)}>
            <IconClose />
          </button>
        </div>

        {items.length > 0 && (
          <div className="border-b border-line px-5 py-4">
            <FreeShippingBar totals={totals} />
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="grid justify-items-center gap-4 px-6 py-16 text-center">
              <p className="font-display text-2xl font-semibold uppercase tracking-[0.05em]">Your bag is empty</p>
              <p className="text-sm text-muted">Go be a productive {BRAND.softWord}.</p>
              <Link to="/shop" className="btn btn-secondary mt-2" onClick={() => setOpen(false)}>
                Shop the collection
              </Link>
            </div>
          ) : (
            <ul>
              {items.map((item) => (
                <li key={item.key} className="grid grid-cols-[84px_1fr] gap-4 border-b border-line p-5">
                  <div className="spot p-1.5">
                    <GarmentImage
                      type={item.type}
                      image={item.image}
                      fit={item.fit}
                      teeHex={item.teeHex}
                      printHex={item.printHex}
                      lines={item.printLines}
                      glyph={item.glyph}
                      font={item.font}
                      backdrop={item.backdrop}
                      backdropHex={item.backdropHex}
                      detail="flat"
                      alt={item.name}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{item.name}</p>
                    <p className="mt-0.5 text-xs uppercase tracking-[0.08em] text-muted">
                      {item.size} · {item.fit} · {colourName(item.color)}
                    </p>
                    <p className="price mt-1">
                      <span>{money(item.price)}</span>
                    </p>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="stepper">
                        <button type="button" onClick={() => setQty(item.key, item.qty - 1)} aria-label={`Decrease quantity of ${item.name}`}>
                          −
                        </button>
                        <output aria-live="polite">{item.qty}</output>
                        <button type="button" onClick={() => setQty(item.key, item.qty + 1)} aria-label={`Increase quantity of ${item.name}`}>
                          +
                        </button>
                      </div>
                      <button type="button" className="u micro text-bone" onClick={() => removeItem(item.key)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="grid gap-3 border-t border-line p-5">
          {totals.discount > 0 && (
            <p className="flex justify-between text-sm text-muted">
              <span>Discount ({totals.coupon?.code})</span>
              <span className="tabular-nums text-success">−{money(totals.discount)}</span>
            </p>
          )}
          <div className="flex items-baseline justify-between font-display text-2xl font-semibold uppercase tracking-[0.06em]">
            <span>Total</span>
            <AnimatedNumber value={totals.subtotal - totals.discount} format={money} />
          </div>
          {items.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              <Link to="/cart" className="btn btn-secondary px-3" onClick={() => setOpen(false)}>
                View bag
              </Link>
              <Link to="/checkout" className="btn btn-primary px-3" onClick={() => setOpen(false)}>
                Checkout
              </Link>
            </div>
          ) : (
            <button type="button" className="btn btn-primary w-full" disabled>
              Checkout
            </button>
          )}
          {STORE.demo && <p className="text-center text-xs text-muted">Demo store: no payment is taken.</p>}
          {items.length > 0 && (
            <button type="button" className="u micro justify-self-center text-bone" onClick={clear}>
              Clear bag
            </button>
          )}
        </div>
      </aside>
    </div>
  )
}

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  return (
    <div className="flex min-h-dvh flex-col">
      <ScrollManager />
      {/^\/blog\/.+/.test(pathname) && <ScrollProgress />}
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <ClubSignup />
      <Footer />
      <CartDrawer />
      <BackToTop />
      <ThemePicker />
    </div>
  )
}
