import type { FormEvent, ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { COLORS } from '../data/catalog'
import { BRAND } from '../data/states'
import { money } from '../lib/format'
import { Wordmark } from './Brand'
import { IconBag, IconClose, IconMenu, IconSearch } from './Icons'
import { Tee } from './Tee'

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
  { to: '/market', label: 'Market file' },
  { to: '/case-study', label: 'Case study' },
]

const FOOTER_COLUMNS: { title: string; links: [to: string, label: string][] }[] = [
  {
    title: 'Shop',
    links: [
      ['/shop', 'All tees'],
      ['/states', 'States & slang'],
      ['/collections', 'Collections'],
      ['/occasions', 'Occasions'],
      ['/lookbook', 'Lookbook'],
    ],
  },
  {
    title: 'The label',
    links: [
      ['/about', 'About'],
      ['/blog', 'Journal'],
      ['/market', 'Market file'],
      ['/case-study', 'Case study'],
    ],
  },
  {
    title: 'Help',
    links: [
      ['/about#fits', 'Fits & GSM'],
      ['/about#contact', 'Contact'],
      ['/occasions#policy', 'Content policy'],
    ],
  },
]

const desktopNavClass = 'u hidden py-3 text-xs font-medium uppercase tracking-[0.2em] lg:inline-block'

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

export function Header() {
  const { count, setOpen } = useCart()
  const [menu, setMenu] = useState(false)
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
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[110] focus:bg-gold focus:px-4 focus:py-2 focus:text-night"
      >
        Skip to content
      </a>

      <div className="border-b border-line bg-surface px-4 py-2.5 text-center text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-gold">
        Ships in 48 hours
        <span aria-hidden="true" className="mx-3 text-faint">
          ·
        </span>
        240 GSM cotton
        <span className="hidden sm:inline">
          <span aria-hidden="true" className="mx-3 text-faint">
            ·
          </span>
          Water-based inks
        </span>
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
            {NAV_LEFT.map((n) => (
              <NavLink key={n.to} to={n.to} className={desktopNavClass}>
                {n.label}
              </NavLink>
            ))}
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
              <Link to="/shop#search" className="icon-btn" aria-label="Search the catalogue">
                <IconSearch />
              </Link>
              <button
                type="button"
                className="icon-btn -mr-2.5"
                onClick={() => setOpen(true)}
                aria-label={`Open bag, ${count} item${count === 1 ? '' : 's'}`}
              >
                <IconBag />
                {count > 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute right-0.5 top-1 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold leading-none text-night"
                  >
                    {count}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {menu && (
        <div id="mobile-nav" role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-[70] flex flex-col bg-night lg:hidden">
          <div className="shell flex h-[72px] shrink-0 items-center justify-between border-b border-line">
            <span className="eyebrow">Menu</span>
            <button ref={closeRef} type="button" className="icon-btn -mr-2.5" aria-label="Close menu" onClick={() => setMenu(false)}>
              <IconClose />
            </button>
          </div>
          <nav className="shell flex flex-1 flex-col overflow-y-auto py-4" aria-label="Mobile">
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
          <div className="grid sm:grid-cols-[1fr_auto]">
            <input
              id="club-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Enter your email"
              aria-invalid={status?.tone === 'err' ? true : undefined}
              aria-describedby="club-status"
              className="input sm:border-r-0"
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
            {['UPI', 'RuPay', 'Visa', 'Mastercard'].map((m) => (
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
          <p className="micro">{BRAND.full}</p>
        </div>
      </div>
    </footer>
  )
}

function colourName(key: string) {
  return (COLORS as Record<string, { name: string }>)[key]?.name ?? key
}

export function CartDrawer() {
  const { items, open, setOpen, total, count, setQty, removeItem, clear } = useCart()
  const [notice, setNotice] = useState('')
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) {
      setNotice('')
      return
    }
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
                    <Tee
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
          <div className="flex items-baseline justify-between font-display text-2xl font-semibold uppercase tracking-[0.06em]">
            <span>Total</span>
            <span className="tabular-nums">{money(total)}</span>
          </div>
          <button
            type="button"
            className="btn btn-primary w-full"
            disabled={!items.length}
            onClick={() => setNotice('Payments open at launch. Nothing was charged.')}
          >
            Checkout
          </button>
          <p role="status" className="min-h-[1.4em] text-center text-sm text-muted">
            {notice}
          </p>
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
  return (
    <div className="flex min-h-dvh flex-col">
      <ScrollManager />
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <ClubSignup />
      <Footer />
      <CartDrawer />
    </div>
  )
}
