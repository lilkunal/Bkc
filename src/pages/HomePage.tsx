import { Component, Suspense, lazy, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { FITS, FONTS, PRODUCTS, bestsellers, filterProducts, getProductById, newest, type FontKey, type Product } from '../data/catalog'
import { STATES } from '../data/states'
import { useCart } from '../context/CartContext'
import { Tee } from '../components/Tee'
import { Ornament, Price, ProductCard, RowHead, SectionHead, TrustBar } from '../components/ProductCard'

const Tee3D = lazy(() => import('../components/Tee3D'))

const FONT_KEYS = Object.keys(FONTS) as FontKey[]
const FONT_NAMES: Record<FontKey, string> = {
  anton: 'Anton',
  bebas: 'Bebas',
  rozha: 'Rozha',
  marker: 'Marker',
  playfair: 'Playfair',
  mono: 'Mono',
  grotesk: 'Grotesk',
}

const HERO = PRODUCTS[0]
const REGIONAL_COUNT = PRODUCTS.filter((p) => p.state).length
const REGION_COUNT = STATES.reduce((n, s) => n + s.regions.length, 0)

const firstOr = (list: Product[]) => list[0] ?? PRODUCTS[0]

const TILES = [
  { label: 'Desi Humour', to: '/shop?cat=humour', product: firstOr(filterProducts({ cat: 'humour' })) },
  { label: 'State Slang', to: '/states', product: firstOr(filterProducts({ cat: 'slang' })) },
  { label: 'Festival Drops', to: '/occasions', product: firstOr(filterProducts({ cat: 'festive' })) },
  { label: 'The Monogram', to: '/product/BKC-1002', product: getProductById('BKC-1002') ?? PRODUCTS[1] },
]

const AUDIENCES = [
  { to: '/shop?aud=men', title: 'Men', note: 'Oversized + classic' },
  { to: '/shop?aud=women', title: 'Women', note: 'Crop, oversized, regular' },
  { to: '/shop?cat=pride', title: 'Pride', note: 'Stocked all year' },
  { to: '/shop?fit=kids', title: 'Kids', note: 'Skin-safe inks' },
  { to: '/shop?cat=animals', title: 'Animals', note: 'Cows, strays, insects' },
]

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return matches
}

function canUseWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

/** If the 3D scene throws, fall back to the flat SVG tee instead of a blank hero. */
class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

function Hero() {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const finePointer = useMediaQuery('(pointer: fine)')
  const webgl = useMemo(canUseWebGL, [])
  const { addItem } = useCart()

  const [fontKey, setFontKey] = useState<FontKey>(HERO.fontKey)
  const [paused, setPaused] = useState(false)
  const sizes = FITS[HERO.fit].sizes
  const [size, setSize] = useState(sizes.includes('L') ? 'L' : sizes[0])
  const rotating = !paused && !reduced

  useEffect(() => {
    if (!rotating) return
    const id = window.setInterval(() => {
      setFontKey((prev) => FONT_KEYS[(FONT_KEYS.indexOf(prev) + 1) % FONT_KEYS.length])
    }, 3500)
    return () => window.clearInterval(id)
  }, [rotating])

  const flat = (
    <div className="grid h-full place-items-center">
      <Tee product={HERO} font={FONTS[fontKey]} detail="high" className="w-[78%]" />
    </div>
  )

  return (
    <section className="grid border-b border-line md:grid-cols-2" aria-labelledby="hero-title">
      <div className="flex flex-col justify-center gap-6 px-[clamp(1rem,0.5rem+3vw,4rem)] py-12 md:min-h-[min(82vh,720px)] md:py-16">
        <p className="eyebrow">Welcome to BKC · Drop 01</p>
        <h1 id="hero-title" className="h-display">
          From gaali <span className="block text-gold">to habit.</span>
        </h1>
        <p className="lede">Premium 240 GSM tees printed the way India actually talks. Soft-censored, never softened.</p>
        <div className="flex flex-wrap items-center gap-x-7 gap-y-4 pt-1">
          <Link to="/shop" className="btn btn-primary">
            Shop the collection
          </Link>
          <Link to="/states" className="u micro text-bone">
            Explore the slang atlas →
          </Link>
        </div>
      </div>

      <div className="hero-glow grid content-center gap-5 border-t border-line px-[clamp(1rem,0.5rem+3vw,3rem)] py-8 md:border-l md:border-t-0 md:py-12">
        <div className="relative mx-auto aspect-[400/470] w-full max-w-[460px]">
          {webgl ? (
            <SceneBoundary fallback={flat}>
              <Suspense fallback={flat}>
                <Tee3D
                  product={HERO}
                  font={FONTS[fontKey]}
                  animate={!reduced}
                  interactive={finePointer}
                  label={`${HERO.name}, oversized tee, shown in 3D with the ${FONT_NAMES[fontKey]} print face`}
                />
              </Suspense>
            </SceneBoundary>
          ) : (
            flat
          )}
        </div>

        <div className="grid justify-items-center gap-4">
          {webgl && finePointer && <p className="micro">Drag to turn the tee</p>}
          <div className="flex flex-wrap items-center justify-center gap-2" role="group" aria-label="Print face">
            {FONT_KEYS.map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={fontKey === k}
                className="chip-btn"
                onClick={() => {
                  setFontKey(k)
                  setPaused(true)
                }}
              >
                {FONT_NAMES[k]}
              </button>
            ))}
            {!reduced && (
              <button type="button" className="u micro ml-2 min-h-11 text-bone" onClick={() => setPaused((p) => !p)}>
                {paused ? 'Resume rotation' : 'Pause rotation'}
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to={`/product/${HERO.id}`} className="u micro text-bone">
              The Original
            </Link>
            <Price price={HERO.price} mrp={HERO.mrp} />
            <label htmlFor="hero-size" className="sr-only">
              Size
            </label>
            <select id="hero-size" className="select w-24" value={size} onChange={(e) => setSize(e.target.value)}>
              {sizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                addItem({
                  id: HERO.id,
                  name: HERO.name,
                  size,
                  color: HERO.color,
                  fit: HERO.fit,
                  price: HERO.price,
                  teeHex: HERO.teeHex,
                  printHex: HERO.printHex,
                  printLines: HERO.printLines,
                  glyph: HERO.glyph,
                  font: FONTS[fontKey],
                  backdrop: HERO.backdrop,
                  backdropHex: HERO.backdropHex,
                })
              }
            >
              Add to bag
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export function HomePage() {
  const fresh = useMemo(() => newest(4), [])
  const best = useMemo(() => bestsellers(4), [])

  return (
    <>
      <Hero />

      <section className="shell pt-10 md:pt-14" aria-label="Shop by category">
        <div className="grid grid-cols-2 border-l border-t border-line lg:grid-cols-4">
          {TILES.map((t) => (
            <Link
              key={t.label}
              to={t.to}
              className="group grid items-center justify-items-center gap-3 border-b border-r border-line p-3 text-center transition-colors duration-500 hover:bg-surface sm:grid-cols-[92px_1fr] sm:justify-items-start sm:p-4 sm:text-left"
            >
              <div className="spot w-24 p-1.5 sm:w-auto">
                <Tee product={t.product} detail="card" />
              </div>
              <div className="grid gap-1.5">
                <h2 className="h-label transition-colors group-hover:text-gold">{t.label}</h2>
                <span className="micro text-gold">Explore</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="shell py-12">
        <Ornament />
      </div>

      <section className="shell" aria-labelledby="new-title">
        <RowHead title="New arrivals" id="new-title" to="/shop" />
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
          {fresh.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      <section className="shell pt-14 md:pt-20" aria-labelledby="best-title">
        <RowHead title="Best sellers" id="best-title" to="/shop?sort=reviews" />
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
          {best.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      <section className="shell mt-16 grid gap-12 border-t border-line py-16 md:mt-24 md:grid-cols-[1fr_1.1fr] md:py-24" aria-labelledby="atlas-title">
        <div className="grid content-start gap-5">
          <p className="eyebrow">The India slang atlas</p>
          <h2 id="atlas-title" className="h-section">
            Shop by where
            <br />
            you speak
          </h2>
          <p className="lede">
            {REGIONAL_COUNT} regional designs across {STATES.length} states and {REGION_COUNT} regional tongues. One atlas. One
            cart.
          </p>
          <div>
            <Link to="/states" className="btn btn-secondary">
              Open the atlas
            </Link>
          </div>
        </div>
        <ul className="atlas-list">
          {STATES.slice(0, 8).map((s) => (
            <li key={s.key}>
              <Link to={`/shop?state=${s.key}`}>
                <b>{s.label}</b>
                <small>{[...new Set(s.regions.map((r) => r.lang))].join(' · ')}</small>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="shell pb-16 md:pb-24" aria-labelledby="everyone-title">
        <SectionHead eyebrow="For everyone" title="Everyone gets one" id="everyone-title" />
        <div className="grid grid-cols-2 border-l border-t border-line lg:grid-cols-5">
          {AUDIENCES.map((a) => (
            <Link key={a.title} to={a.to} className="group grid content-start gap-1.5 border-b border-r border-line p-5 transition-colors duration-500 hover:bg-surface">
              <span className="font-display text-2xl font-semibold uppercase tracking-[0.06em] transition-colors group-hover:text-gold">{a.title}</span>
              <span className="text-sm text-muted">{a.note}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-surface" aria-labelledby="civic-title">
        <div className="shell grid gap-6 py-14 md:grid-cols-[1fr_auto] md:items-end">
          <div className="grid gap-4">
            <p className="eyebrow">Civic</p>
            <h2 id="civic-title" className="h-section">
              Vote. Ask. Show up.
            </h2>
            <p className="lede">Non-partisan turnout and peaceful-assembly prints. No party names, colours or symbols. Ever.</p>
          </div>
          <Link to="/shop?cat=civic" className="btn btn-secondary justify-self-start">
            Shop civic tees
          </Link>
        </div>
      </section>

      <section className="shell py-14 md:py-20" aria-label="Why BKC">
        <TrustBar />
      </section>
    </>
  )
}
