import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FONTS, PRODUCTS, CATEGORIES, bestsellers, newest, type FontKey } from '../data/catalog'
import { STATES, BRAND } from '../data/states'
import { useCart } from '../context/CartContext'
import { money } from '../lib/format'
import { Tee } from '../components/Tee'
import { Marquee, ProductCard, SectionHead } from '../components/ProductCard'

const FONT_KEYS = Object.keys(FONTS) as FontKey[]

export function HomePage() {
  const hero = PRODUCTS[0]
  const [fontKey, setFontKey] = useState<FontKey>((hero.fontKey as FontKey) || 'anton')
  const { addItem } = useCart()

  useEffect(() => {
    const id = window.setInterval(() => {
      setFontKey((prev) => {
        const i = FONT_KEYS.indexOf(prev)
        return FONT_KEYS[(i + 1) % FONT_KEYS.length]
      })
    }, 2400)
    return () => clearInterval(id)
  }, [])

  const best = useMemo(() => bestsellers(8), [])
  const fresh = useMemo(() => newest(8), [])

  return (
    <>
      <section className="relative overflow-hidden border-b-2 border-ink">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -z-0 -translate-x-1/2 -translate-y-1/2 select-none font-display text-[clamp(4rem,12vw,14rem)] uppercase leading-none text-transparent"
          style={{ WebkitTextStroke: '2px rgba(14,14,12,0.12)' }}
          aria-hidden
        >
          Ch**tiya
        </div>

        <div className="relative z-10 mx-auto grid max-w-[1440px] gap-6 px-[clamp(1rem,0.5rem+2vw,3rem)] py-8 md:grid-cols-[1fr_minmax(260px,42%)_1fr] md:items-center md:py-12 lg:min-h-[min(84vh,780px)]">
          <div className="order-1 flex flex-col gap-4 md:order-none">
            <span className="w-fit border-2 border-ink bg-marigold px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.2em]">
              Drop 01 · Live now
            </span>
            <h1 className="font-display text-[clamp(2.2rem,1rem+4vw,4.4rem)] uppercase leading-[1.04]">
              The tee
              <br />
              that says
              <br />
              <span className="inline-block bg-marigold px-2 py-1 leading-none">it out loud</span>
            </h1>
            <p className="max-w-[32ch] text-sm text-ink-70 sm:text-base">
              One white 240 GSM canvas. Soft-censor brand name: {BRAND.softWord}. Hinglish lockup{' '}
              <span className="font-deva text-chilli">{BRAND.hinglishLockup}</span>. Tap a font — the shirt
              changes live.
            </p>
            <Link
              to="/shop"
              className="inline-flex min-h-12 w-fit items-center border-2 border-ink bg-ink px-5 font-bold uppercase text-cream hard-shadow"
            >
              Shop the full catalogue →
            </Link>
          </div>

          <div className="order-2 flex flex-col items-center md:order-none">
            <div className="tee-float w-full max-w-[420px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={fontKey}
                  initial={{ opacity: 0.4, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.4 }}
                  transition={{ duration: 0.25 }}
                >
                  <Tee
                    product={hero}
                    font={FONTS[fontKey]}
                    detail="high"
                    className="w-full"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2" role="group" aria-label="Choose print typeface">
              {FONT_KEYS.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setFontKey(k)}
                  className={`min-h-11 min-w-11 border-2 border-ink px-2 text-xs uppercase ${
                    fontKey === k ? 'bg-chilli text-cream' : 'bg-cream'
                  }`}
                >
                  {k.slice(0, 3)}
                </button>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <span className="font-mono text-lg">
                {money(hero.price)} <s className="text-ink-45">{money(hero.mrp)}</s>
              </span>
              <button
                type="button"
                className="min-h-12 border-2 border-ink bg-marigold px-5 font-bold uppercase hard-shadow-sm"
                onClick={() =>
                  addItem({
                    id: hero.id,
                    name: hero.name,
                    size: 'L',
                    color: hero.color,
                    fit: hero.fit,
                    price: hero.price,
                    teeHex: hero.teeHex,
                    printHex: hero.printHex,
                    printLines: hero.printLines,
                    glyph: hero.glyph,
                    font: FONTS[fontKey],
                    backdrop: hero.backdrop,
                    backdropHex: hero.backdropHex,
                  })
                }
              >
                Add this one to bag
              </button>
            </div>
            <p className="mt-2 text-center font-mono text-xs text-ink-45">
              Oversized · Drop shoulder · Chalk white · S–3XL
            </p>
          </div>

          <div className="order-3 grid grid-cols-2 gap-3 md:order-none md:grid-cols-1 md:justify-items-end md:text-right">
            {[
              [String(PRODUCTS.length), 'Designs live'],
              ['23', 'Occasion drops'],
              ['20', 'Garment colours'],
              ['4', 'Fits, incl. kids'],
            ].map(([n, l]) => (
              <div key={l} className="border-2 border-ink bg-cream px-3 py-2 md:w-40">
                <b className="font-display text-2xl">{n}</b>
                <span className="block text-xs text-ink-45">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Marquee />

      <section className="mx-auto max-w-[1440px] px-[clamp(1rem,0.5rem+2vw,3rem)] py-12 md:py-16">
        <SectionHead
          eyebrow="01 — Different taste, different tee"
          title={<>Pick your<br />flavour</>}
          note="Sixteen taste categories, from group-chat humour to pure typography."
        />
        <div className="flex gap-3 overflow-x-auto pb-3 snap-x">
          {CATEGORIES.map((c) => (
            <Link
              key={c.key}
              to={`/shop?cat=${c.key}`}
              className="min-w-[148px] snap-start border-2 border-ink bg-cream p-4 hover:bg-marigold"
            >
              <span className="text-2xl" aria-hidden>
                {c.glyph}
              </span>
              <h3 className="mt-2 font-display text-lg uppercase">{c.label}</h3>
              <p className="mt-1 text-xs text-ink-45">{c.note}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y-2 border-ink bg-paper-2 py-12 md:py-16">
        <div className="mx-auto max-w-[1440px] px-[clamp(1rem,0.5rem+2vw,3rem)]">
          <SectionHead
            eyebrow="02 — The gap nobody else fills"
            title={
              <>
                Shop by where
                <br />
                you speak
              </>
            }
            note={BRAND.differentiator}
          />
          <div className="mb-4 max-w-2xl text-sm text-ink-70">
            From Kumaoni <i>चाल जालुं</i> to Malayalam <i>എടാ</i> — day-to-day slang by state and region, one storefront.
          </div>
          <div className="flex gap-3 overflow-x-auto pb-3 snap-x">
            {STATES.slice(0, 10).map((s) => (
              <Link
                key={s.key}
                to={`/shop?state=${s.key}`}
                className="min-w-[140px] snap-start border-2 border-ink bg-cream p-4 hover:bg-marigold"
              >
                <span className="text-2xl">{s.glyph}</span>
                <h3 className="mt-2 font-display text-lg uppercase">{s.label}</h3>
                <p className="text-xs text-ink-45">{s.regions.map((r) => r.lang).join(' · ')}</p>
              </Link>
            ))}
          </div>
          <Link to="/states" className="mt-4 inline-flex min-h-11 font-bold uppercase underline">
            Full India atlas →
          </Link>
        </div>
      </section>

      <section className="border-y-2 border-ink bg-paper-2 py-12 md:py-16">
        <div className="mx-auto max-w-[1440px] px-[clamp(1rem,0.5rem+2vw,3rem)]">
          <SectionHead
            eyebrow="03 — Tshirt of everyone"
            title={
              <>
                Everyone
                <br />
                gets one
              </>
            }
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { href: '/shop?aud=men', g: '🧔', t: 'Men', d: 'Oversized + classic' },
              { href: '/shop?aud=women', g: '👩', t: 'Women', d: 'Crop, oversized, regular' },
              { href: '/shop?cat=pride', g: '🏳️‍🌈', t: 'Pride', d: 'Stocked all year' },
              { href: '/shop?fit=kids', g: '🧒', t: 'Kids', d: 'Skin-safe inks' },
              { href: '/shop?cat=animals', g: '🐄', t: 'Animals', d: 'Cows, strays, insects' },
            ].map((a) => (
              <Link key={a.t} to={a.href} className="border-2 border-ink bg-cream p-5 hover:bg-marigold">
                <span className="text-3xl">{a.g}</span>
                <h3 className="mt-2 font-display text-xl uppercase">{a.t}</h3>
                <p className="text-sm text-ink-45">{a.d}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-[clamp(1rem,0.5rem+2vw,3rem)] py-12 md:py-16">
        <SectionHead eyebrow="04 — Bestsellers" title="Loudest in the room" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 md:gap-4">
          {best.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      <section className="border-t-2 border-ink bg-indigo py-12 text-cream md:py-16">
        <div className="mx-auto max-w-[1440px] px-[clamp(1rem,0.5rem+2vw,3rem)]">
          <SectionHead
            eyebrow="05 — Civic"
            title={<span className="text-cream">Vote. Ask. Show up.</span>}
            note="Non-partisan turnout and peaceful-assembly prints. No party names, colours or symbols — ever."
          />
          <Link
            to="/shop?cat=civic"
            className="inline-flex min-h-12 items-center border-2 border-cream bg-marigold px-5 font-bold uppercase text-ink"
          >
            Shop civic tees →
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-[clamp(1rem,0.5rem+2vw,3rem)] py-12 md:py-16">
        <SectionHead eyebrow="06 — New drops" title="Just landed" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {fresh.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>
    </>
  )
}
