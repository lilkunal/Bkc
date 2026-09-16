import { useEffect, useMemo, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { usePageTitle } from '../lib/usePageTitle'
import { useMediaQuery, useReducedMotion } from '../lib/useMediaQuery'
import { FONTS, PRODUCTS, featuredProduct, filterProducts, getProductById, pickProducts, varied, type FontKey } from '../data/catalog'
import { STATES } from '../data/states'
import { POSTS } from '../data/blog'
import { featuredReviews } from '../data/reviews'
import { HOME, type HomeSection, type SectionOf } from '../content/home'
import { STORE } from '../store.config'
import { useCart } from '../context/CartContext'
import { useTheme } from '../context/ThemeContext'
import type { ShapeKind } from '../lib/backgrounds'
import { MOCKUP_WIDTH, renderMockup } from '../lib/mockup'
import { GarmentImage } from '../components/GarmentImage'
import { HeroBackdrop } from '../components/HeroBackdrop'
import { CollectionRing } from '../components/CollectionRing'
import { Marquee } from '../components/Marquee'
import { ShapeBackdrop } from '../components/ShapeBackdrop'
import { Testimonials } from '../components/Testimonials'
import { AnimatedBackground, InView, Magnetic, ProgressiveBlur, Spotlight, TextEffect } from '../components/motion'
import { Ornament, Price, ProductCard, SectionHead, TrustBar } from '../components/ProductCard'

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

const HERO = featuredProduct()
const EASE = [0.2, 0.7, 0.2, 1] as const

/** Tilts its card a few degrees towards the mouse. Mouse only, so touch scrolling is untouched. */
function TiltStage({ enabled, children }: { enabled: boolean; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!enabled || e.pointerType !== 'mouse' || !el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty('--rx', `${(-y * 8).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${(x * 10).toFixed(2)}deg`)
  }

  const reset = () => {
    ref.current?.style.setProperty('--rx', '0deg')
    ref.current?.style.setProperty('--ry', '0deg')
  }

  return (
    <div ref={ref} className="tilt-stage" onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </div>
  )
}

function Hero({ section }: { section: SectionOf<'hero'> }) {
  const reduced = useReducedMotion()
  const finePointer = useMediaQuery('(pointer: fine)')
  const { addItem } = useCart()
  const { theme } = useTheme()

  const [fontKey, setFontKey] = useState<FontKey>((HERO.fontKey in FONTS ? HERO.fontKey : 'anton') as FontKey)
  const [paused, setPaused] = useState(false)
  const sizes = HERO.sizes
  const [size, setSize] = useState(sizes.includes('L') ? 'L' : sizes[0])
  const rotating = !paused && !reduced

  // Build every print-face version up front, so the rotation swaps instantly.
  useEffect(() => {
    for (const key of FONT_KEYS) {
      renderMockup({
        type: HERO.type,
        teeHex: HERO.teeHex,
        width: MOCKUP_WIDTH.high,
        print: { printLines: HERO.printLines, glyph: HERO.glyph, font: FONTS[key], printHex: HERO.printHex, backdrop: HERO.backdrop, backdropHex: HERO.backdropHex },
      })
    }
  }, [])

  useEffect(() => {
    if (!rotating) return
    const id = window.setInterval(() => {
      setFontKey((prev) => FONT_KEYS[(FONT_KEYS.indexOf(prev) + 1) % FONT_KEYS.length])
    }, 3500)
    return () => window.clearInterval(id)
  }, [rotating])

  return (
    <section className="relative isolate grid overflow-hidden border-b border-line md:grid-cols-2" aria-labelledby="hero-title">
      {section.backdrop3d &&
        (theme.backdrop === 'silk' ? <HeroBackdrop className="hero-canvas" /> : <ShapeBackdrop kind={theme.backdrop} seed={23} className="hero-canvas" />)}
      <div aria-hidden="true" className="hero-scrim" />

      <div className="flex flex-col justify-center gap-6 px-[clamp(1rem,0.5rem+3vw,4rem)] py-12 md:min-h-[min(82vh,720px)] md:py-16">
        <p className="eyebrow">{section.eyebrow}</p>
        <h1 id="hero-title" className="h-display">
          <TextEffect as="span" per="word" preset="fade-in-blur" speedReveal={0.8} className="block">
            {section.title}
          </TextEffect>
          <TextEffect as="span" per="word" preset="fade-in-blur" speedReveal={0.8} delay={0.35} className="block text-gold">
            {section.accent}
          </TextEffect>
        </h1>
        <InView transition={{ duration: 0.8, delay: 0.55, ease: EASE }} className="grid gap-6">
          <p className="lede">{section.lede}</p>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-4 pt-1">
            <Magnetic>
              <Link to={section.primary.to} className="btn btn-primary">
                {section.primary.label}
              </Link>
            </Magnetic>
            {section.secondary && (
              <Link to={section.secondary.to} className="u micro text-bone">
                {section.secondary.label} →
              </Link>
            )}
          </div>
        </InView>
      </div>

      <div className="hero-glow grid content-center gap-5 px-[clamp(1rem,0.5rem+3vw,3rem)] py-8 md:py-12">
        <TiltStage enabled={finePointer && !reduced}>
          <div className="tilt-card relative mx-auto w-full max-w-[480px]">
            <GarmentImage
              product={HERO}
              font={FONTS[fontKey]}
              detail="high"
              priority
              alt={`${HERO.name}, shown with the ${FONT_NAMES[fontKey]} print face`}
              className="w-full"
            />
          </div>
          <div aria-hidden="true" className="tilt-shadow" />
        </TiltStage>

        <div className="grid justify-items-center gap-4">
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
              {HERO.name.split(' — ').pop()}
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
                  type: HERO.type,
                  image: HERO.image,
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

function Tiles({ section }: { section: SectionOf<'tiles'> }) {
  const tiles = useMemo(
    () =>
      section.tiles.map((t) => ({
        ...t,
        product: (t.productId ? getProductById(t.productId) : undefined) ?? filterProducts(t.filter)[0] ?? PRODUCTS[0],
      })),
    [section],
  )
  return (
    <section className="shell pt-10 md:pt-14" aria-label={section.label}>
      <div className="grid grid-cols-2 border-l border-t border-line lg:grid-cols-4">
        {tiles.map((t) => (
          <Link
            key={t.label}
            to={t.to}
            className="group grid items-center justify-items-center gap-3 border-b border-r border-line p-3 text-center transition-colors duration-500 hover:bg-surface sm:grid-cols-[92px_1fr] sm:justify-items-start sm:p-4 sm:text-left"
          >
            <div className="spot w-24 p-1.5 sm:w-auto">
              <GarmentImage product={t.product} detail="card" />
            </div>
            <div className="grid gap-1.5">
              <h2 className="h-label transition-colors group-hover:text-gold">{t.label}</h2>
              <span className="micro text-gold">Explore</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

const CARD_SHAPES: ShapeKind[] = ['dunes', 'blobs', 'peaks']

function Collections({ section }: { section: SectionOf<'collections'> }) {
  const cards = useMemo(
    () =>
      section.cards.map((c) => {
        const list = filterProducts(c.filter)
        return { ...c, count: list.length, product: (c.productId ? getProductById(c.productId) : undefined) ?? varied(list, 1)[0] ?? PRODUCTS[0] }
      }),
    [section],
  )
  return (
    <section className="shell pt-12 md:pt-16" aria-labelledby="collections-title">
      <SectionHead eyebrow={section.eyebrow} title={section.title} note={section.note} id="collections-title" />
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((c, i) => (
          <InView key={c.label} transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}>
            <Link to={c.to} className="collection-card group">
              <ShapeBackdrop kind={CARD_SHAPES[i % CARD_SHAPES.length]} seed={17 + i * 9} strength={0.9} />
              <Spotlight size={340} />
              <div className="collection-garment">
                <GarmentImage product={c.product} detail="card" alt="" className="w-full transition-transform duration-700 ease-lux group-hover:-translate-y-1 group-hover:scale-[1.05]" />
              </div>
              <div className="collection-caption">
                <ProgressiveBlur intensity={0.5}>
                  <div className="grid gap-1 p-5">
                    <span className="micro">{c.count} designs</span>
                    <span className="font-display text-2xl font-semibold uppercase tracking-[0.04em] transition-colors group-hover:text-gold">{c.label}</span>
                    <span className="flex items-center justify-between gap-3 text-sm text-muted">
                      <span>{c.note}</span>
                      <span className="micro text-gold">Shop →</span>
                    </span>
                  </div>
                </ProgressiveBlur>
              </div>
            </Link>
          </InView>
        ))}
      </div>
    </section>
  )
}

function Ring({ section }: { section: SectionOf<'ring'> }) {
  const products = useMemo(() => varied(pickProducts(section.source, section.filter, 80), section.count), [section])
  return <CollectionRing products={products} eyebrow={section.eyebrow} title={section.title} note={section.note} />
}

function ProductTabs({ section }: { section: SectionOf<'products'> }) {
  const [tab, setTab] = useState(0)
  const active = section.tabs[tab] ?? section.tabs[0]
  const products = useMemo(() => pickProducts(active.source, active.filter, section.count), [active, section.count])

  return (
    <section className="shell pt-14 md:pt-20" aria-labelledby="drop-title">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <TextEffect as="h2" id="drop-title" per="word" preset="fade-in-blur" inView className="h-section">
          {section.title}
        </TextEffect>
        <Link to={active.to} className="u micro text-gold">
          View all {active.label.toLowerCase()}
        </Link>
      </div>
      <div className="tab-row mb-8" role="group" aria-label="Show">
        <AnimatedBackground value={String(tab)} className="tab-highlight">
          {section.tabs.map((t, i) => (
            <button key={t.label} data-id={String(i)} type="button" className="tab-btn" aria-pressed={i === tab} onClick={() => setTab(i)}>
              {t.label}
            </button>
          ))}
        </AnimatedBackground>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
        {products.map((p, i) => (
          <ProductCard key={`${active.label}-${p.id}`} product={p} index={i} />
        ))}
      </div>
    </section>
  )
}

function Quote({ section }: { section: SectionOf<'quote'> }) {
  const { theme } = useTheme()
  return (
    <section className="relative isolate overflow-hidden border-y border-line bg-surface" aria-label="From the label">
      <ShapeBackdrop kind={theme.backdrop === 'silk' ? 'dunes' : theme.backdrop} seed={5} strength={0.55} className="-z-10 opacity-60" />
      <figure className="shell grid justify-items-center gap-6 py-16 text-center md:py-24">
        <blockquote className="max-w-4xl font-display text-[clamp(1.9rem,1.1rem+2.8vw,3.5rem)] font-medium uppercase leading-[1.08] tracking-[0.03em]">
          <TextEffect as="p" per="word" preset="blur" inView speedReveal={1.4}>
            {`“${section.quote}”`}
          </TextEffect>
        </blockquote>
        <figcaption className="eyebrow">{section.by}</figcaption>
      </figure>
    </section>
  )
}

function Atlas({ section }: { section: SectionOf<'atlas'> }) {
  const regional = PRODUCTS.filter((p) => p.state).length
  if (!regional) return null
  const regions = STATES.reduce((n, s) => n + s.regions.length, 0)
  return (
    <section className="shell grid gap-12 py-16 md:grid-cols-[1fr_1.1fr] md:py-24" aria-labelledby="atlas-title">
      <div className="grid content-start gap-5">
        <p className="eyebrow">{section.eyebrow}</p>
        <TextEffect as="h2" id="atlas-title" per="word" preset="fade-in-blur" inView className="h-section max-w-[12ch]">
          {section.title}
        </TextEffect>
        <p className="lede">
          {regional} regional designs across {STATES.length} states and {regions} regional tongues. One atlas. One cart.
        </p>
        <div>
          <Link to={section.cta.to} className="btn btn-secondary">
            {section.cta.label}
          </Link>
        </div>
      </div>
      <InView>
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
      </InView>
    </section>
  )
}

function Reviews({ section }: { section: SectionOf<'reviews'> }) {
  const reviews = useMemo(() => featuredReviews(9), [])
  if (!reviews.length) return null
  return <Testimonials reviews={reviews} eyebrow={STORE.demo ? `${section.eyebrow} · sample reviews` : section.eyebrow} title={section.title} />
}

function Audiences({ section }: { section: SectionOf<'audiences'> }) {
  return (
    <section className="shell pb-16 md:pb-24" aria-labelledby="everyone-title">
      <SectionHead eyebrow={section.eyebrow} title={section.title} id="everyone-title" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {section.items.map((a) => (
          <Link key={a.title} to={a.to} className="group grid content-start gap-1.5 border border-line p-5 transition-colors duration-500 hover:bg-surface">
            <span className="font-display text-2xl font-semibold uppercase tracking-[0.06em] transition-colors group-hover:text-gold">{a.title}</span>
            <span className="text-sm text-muted">{a.note}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

function MarqueeRow({ section }: { section: SectionOf<'marquee'> }) {
  const products = useMemo(() => varied(pickProducts(section.source, undefined, 80), section.count), [section])
  return (
    <section className="border-t border-line py-14 md:py-20" aria-labelledby="marquee-title">
      <div className="shell">
        <SectionHead eyebrow={section.eyebrow} title={section.title} id="marquee-title" />
      </div>
      <Marquee products={products} label={section.title} />
    </section>
  )
}

function Journal({ section }: { section: SectionOf<'journal'> }) {
  const posts = POSTS.slice(0, section.count)
  if (!posts.length) return null
  return (
    <section className="shell pb-16 md:pb-24" aria-labelledby="journal-title">
      <SectionHead
        eyebrow={section.eyebrow}
        title={section.title}
        id="journal-title"
        action={
          <Link to="/blog" className="btn btn-secondary">
            All stories
          </Link>
        }
      />
      <div className="grid gap-4 md:grid-cols-3">
        {posts.map((p, i) => (
          <InView key={p.slug} transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }} className="overflow-hidden border border-line">
            <Link to={`/blog/${p.slug}`} className="group grid h-full content-start gap-3 p-6 transition-colors duration-500 hover:bg-surface md:p-8">
              <p className="micro">
                {p.cat} · {p.read} min
              </p>
              <h3 className="font-display text-[1.6rem] font-semibold uppercase leading-[1.08] tracking-[0.03em] transition-colors group-hover:text-gold">
                {p.title}
              </h3>
              <p className="text-sm text-muted">{p.dek}</p>
              <span className="micro mt-2 text-gold">Read →</span>
            </Link>
          </InView>
        ))}
      </div>
    </section>
  )
}

function Band({ section }: { section: SectionOf<'band'> }) {
  return (
    <section className="border-y border-line bg-surface" aria-labelledby="band-title">
      <div className="shell grid gap-6 py-14 md:grid-cols-[1fr_auto] md:items-end">
        <div className="grid gap-4">
          <p className="eyebrow">{section.eyebrow}</p>
          <TextEffect as="h2" id="band-title" per="word" preset="fade-in-blur" inView className="h-section">
            {section.title}
          </TextEffect>
          <p className="lede">{section.text}</p>
        </div>
        <Link to={section.cta.to} className="btn btn-secondary justify-self-start">
          {section.cta.label}
        </Link>
      </div>
    </section>
  )
}

function Section({ section }: { section: HomeSection }) {
  switch (section.type) {
    case 'hero':
      return <Hero section={section} />
    case 'tiles':
      return <Tiles section={section} />
    case 'collections':
      return <Collections section={section} />
    case 'ring':
      return <Ring section={section} />
    case 'products':
      return <ProductTabs section={section} />
    case 'ornament':
      return (
        <div className="shell py-12 md:py-16">
          <Ornament />
        </div>
      )
    case 'quote':
      return <Quote section={section} />
    case 'atlas':
      return <Atlas section={section} />
    case 'reviews':
      return <Reviews section={section} />
    case 'audiences':
      return <Audiences section={section} />
    case 'marquee':
      return <MarqueeRow section={section} />
    case 'journal':
      return <Journal section={section} />
    case 'band':
      return <Band section={section} />
    case 'trust':
      return (
        <section className="shell py-14 md:py-20" aria-label={`Why ${STORE.name}`}>
          <TrustBar />
        </section>
      )
  }
}

export function HomePage() {
  usePageTitle()
  return (
    <>
      {HOME.filter((s) => s.enable).map((s, i) => (
        <Section key={`${s.type}-${i}`} section={s} />
      ))}
    </>
  )
}
