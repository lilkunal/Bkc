import type { ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import { money } from '../lib/format'
import { Tee } from './Tee'
import { BRAND } from '../data/states'

const NAV = [
  { to: '/shop', label: 'Shop' },
  { to: '/states', label: 'States' },
  { to: '/collections', label: 'Collections' },
  { to: '/occasions', label: 'Occasions' },
  { to: '/lookbook', label: 'Lookbook' },
  { to: '/blog', label: 'Journal' },
  { to: '/market', label: 'Market' },
  { to: '/about', label: 'About' },
]

export function Header() {
  const { count, setOpen } = useCart()
  const [menu, setMenu] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setHidden(y > last && y > 80)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menu])

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:bg-marigold focus:px-3 focus:py-2 focus:border-ink"
      >
        Skip to content
      </a>
      <header
        className={`sticky top-0 z-50 border-b-2 border-ink bg-paper/95 backdrop-blur-sm transition-transform duration-300 ${
          hidden && !menu ? '-translate-y-full' : ''
        }`}
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="mx-auto flex h-[62px] max-w-[1440px] items-center justify-between gap-3 px-[clamp(1rem,0.5rem+2vw,3rem)]">
          <Link to="/" className="flex items-center gap-2" aria-label="BKC home">
            <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="" className="h-9 w-auto sm:h-10" width={120} height={40} />
            <span className="sr-only">{BRAND.full}</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `min-h-11 px-3 py-2 text-sm font-medium uppercase tracking-wide ${
                    isActive ? 'bg-marigold' : 'hover:bg-paper-2'
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="relative flex min-h-11 min-w-11 items-center justify-center border-2 border-ink bg-cream hard-shadow-sm"
              onClick={() => setOpen(true)}
              aria-label={`Open bag, ${count} items`}
            >
              <span aria-hidden>Bag</span>
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center bg-chilli px-1 text-[10px] font-bold text-cream">
                  {count}
                </span>
              )}
            </button>
            <button
              type="button"
              className="flex min-h-11 min-w-11 items-center justify-center border-2 border-ink lg:hidden"
              aria-expanded={menu}
              aria-controls="mobile-nav"
              aria-label={menu ? 'Close menu' : 'Open menu'}
              onClick={() => setMenu((v) => !v)}
            >
              <span className="font-mono text-lg" aria-hidden>
                {menu ? '✕' : '☰'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {menu && (
        <div
          id="mobile-nav"
          className="fixed inset-0 z-40 bg-paper pt-[calc(62px+env(safe-area-inset-top))] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <nav className="flex flex-col gap-1 p-4">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                onClick={() => setMenu(false)}
                className="min-h-12 border-b border-ink/20 px-2 py-3 text-lg font-display uppercase tracking-wide"
              >
                {n.label}
              </NavLink>
            ))}
            <Link
              to="/case-study"
              onClick={() => setMenu(false)}
              className="min-h-12 px-2 py-3 text-lg font-display uppercase"
            >
              Case Study
            </Link>
          </nav>
        </div>
      )}
    </>
  )
}

export function Footer() {
  return (
    <footer className="mt-auto border-t-3 border-ink bg-ink text-cream">
      <div className="mx-auto grid max-w-[1440px] gap-8 px-[clamp(1rem,0.5rem+2vw,3rem)] py-10 md:grid-cols-3">
        <div>
          <p className="font-display text-3xl uppercase">BKC</p>
          <p className="mt-1 font-deva text-2xl text-marigold">
            चू<span className="font-display text-cream">tiya</span>
          </p>
          <p className="mt-2 max-w-xs text-sm text-cream/80">
            {BRAND.full} — {BRAND.motto} Printed tees for every Indian tongue.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Link to="/states" className="min-h-11 py-2 hover:text-marigold">
            States & slang
          </Link>
          <Link to="/shop" className="min-h-11 py-2 hover:text-marigold">
            Shop all
          </Link>
          <Link to="/occasions" className="min-h-11 py-2 hover:text-marigold">
            Occasions
          </Link>
          <Link to="/blog" className="min-h-11 py-2 hover:text-marigold">
            Journal
          </Link>
          <Link to="/market" className="min-h-11 py-2 hover:text-marigold">
            Market file
          </Link>
          <Link to="/about" className="min-h-11 py-2 hover:text-marigold">
            About
          </Link>
          <Link to="/case-study" className="min-h-11 py-2 hover:text-marigold">
            Case study
          </Link>
        </div>
        <form
          className="flex flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            alert('Thanks — demo only, no list stored.')
          }}
        >
          <label htmlFor="nl-email" className="text-xs uppercase tracking-widest text-cream/70">
            Drop updates
          </label>
          <div className="flex gap-2">
            <input
              id="nl-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@email.com"
              className="min-h-11 w-full border-2 border-cream bg-transparent px-3 text-cream placeholder:text-cream/40"
            />
            <button type="submit" className="min-h-11 border-2 border-marigold bg-marigold px-4 font-bold text-ink">
              Join
            </button>
          </div>
        </form>
      </div>
      <div className="border-t border-cream/20 px-[clamp(1rem,0.5rem+2vw,3rem)] py-4 text-xs text-cream/60">
        Demo storefront · No real payments · © {new Date().getFullYear()} BKC
      </div>
    </footer>
  )
}

export function CartDrawer() {
  const { items, open, setOpen, total, setQty, removeItem, clear } = useCart()

  useEffect(() => {
    if (!open) return
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
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Shopping bag">
      <button
        type="button"
        className="absolute inset-0 bg-ink/50"
        aria-label="Close bag"
        onClick={() => setOpen(false)}
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l-2 border-ink bg-paper shadow-2xl">
        <div className="flex items-center justify-between border-b-2 border-ink px-4 py-4">
          <h2 className="font-display text-2xl uppercase">Your bag</h2>
          <button type="button" className="min-h-11 min-w-11 border-2 border-ink" onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <p className="text-ink-70">Bag is empty. Go be a productive {BRAND.softWord}.</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li key={item.key} className="flex gap-3 border-2 border-ink bg-cream p-2">
                  <div className="w-20 shrink-0 bg-paper-2">
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
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{item.name}</p>
                    <p className="text-xs text-ink-45">
                      {item.size} · {item.fit} · {item.color}
                    </p>
                    <p className="mt-1 font-mono text-sm">{money(item.price)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        className="min-h-10 min-w-10 border border-ink"
                        onClick={() => setQty(item.key, item.qty - 1)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="min-w-6 text-center">{item.qty}</span>
                      <button
                        type="button"
                        className="min-h-10 min-w-10 border border-ink"
                        onClick={() => setQty(item.key, item.qty + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="ml-auto text-xs underline"
                        onClick={() => removeItem(item.key)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t-2 border-ink p-4">
          <div className="mb-3 flex justify-between font-display text-xl uppercase">
            <span>Total</span>
            <span>{money(total)}</span>
          </div>
          <button
            type="button"
            className="min-h-12 w-full border-2 border-ink bg-chilli font-bold uppercase text-cream hard-shadow"
            onClick={() => alert('Demo checkout — no payment taken.')}
            disabled={!items.length}
          >
            Checkout (demo)
          </button>
          {items.length > 0 && (
            <button type="button" className="mt-2 w-full min-h-11 text-sm underline" onClick={clear}>
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
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}
