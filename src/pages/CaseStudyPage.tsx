import { Link } from 'react-router-dom'
import { PRODUCTS } from '../data/catalog'
import { SectionHead } from '../components/ProductCard'

export function CaseStudyPage() {
  return (
    <div className="mx-auto max-w-3xl px-[clamp(1rem,0.5rem+2vw,3rem)] py-8 md:py-12">
      <p className="font-mono text-xs uppercase tracking-wider text-ink-45">Portfolio case study</p>
      <h1 className="mt-2 font-display text-[clamp(2.2rem,1rem+3vw,3.75rem)] uppercase leading-none">
        BKC — building a loud Indian tee brand as a shippable product
      </h1>
      <p className="mt-4 text-lg text-ink-70">
        Role: founder / designer / engineer · Stack: React, Vite, Tailwind, Framer Motion, procedural SVG garments ·
        Host: GitHub Pages
      </p>

      <SectionHead eyebrow="01 — The story" title="Why this exists" />
      <div className="space-y-3 text-sm text-ink-70">
        <p>
          India already has Bewakoof-scale meme fashion and Myntra-scale logistics. What it rarely has is a small label
          that treats Hinglish humour seriously as a design system — fits, occasions, civic policy, animals, pride —
          and ships the whole storefront as proof.
        </p>
        <p>
          <b>Chootiya</b> is not a slur in the living-room register; it is the soft insult that means “you absolute
          idiot, I love you.” BKC reclaims that register for print without punching at caste, religion, region or a
          named person.
        </p>
        <p>
          Manufacturing intuition from the Aligarh / Padma Lights world sits behind the case study: GSM, blanks, print
          cost, returns. The site is the storefront; the ops math lives on the Market page.
        </p>
      </div>

      <SectionHead eyebrow="02 — Product" title="What we shipped" />
      <ul className="list-disc space-y-2 pl-5 text-sm text-ink-70">
        <li>{PRODUCTS.length} designs across 16 categories, 4 fits, 20 colours, 24 occasions</li>
        <li>Live SVG garment renderer — colour, fit and typeface swap without photos</li>
        <li>Mobile-first PLP with filter bottom-sheet; PDP sticky ATC; accessible cart drawer</li>
        <li>Journal, market teardown, lookbook, civic policy, idiom glossary for अल्लाह की गाय</li>
      </ul>

      <SectionHead eyebrow="03 — Design" title="What we stole (on purpose)" />
      <p className="text-sm text-ink-70">
        Beyoung’s drops and sticky buy bar. Bewakoof’s graphic density. Myntra’s filter discipline. AJIO’s editorial
        capsules. Awwwards/Santoni restraint in the hero — one composition, brand-first, tee as the visual plane.
      </p>

      <SectionHead eyebrow="04 — Outcome" title="Open it" />
      <div className="flex flex-wrap gap-3">
        <Link to="/" className="min-h-12 border-2 border-ink bg-marigold px-5 font-bold uppercase">
          Home
        </Link>
        <Link to="/shop" className="min-h-12 border-2 border-ink bg-cream px-5 font-bold uppercase">
          Shop
        </Link>
        <Link to="/market" className="min-h-12 border-2 border-ink bg-cream px-5 font-bold uppercase">
          Market file
        </Link>
        <a
          href="https://github.com/lilkunal/Bkc"
          className="min-h-12 border-2 border-ink bg-ink px-5 font-bold uppercase text-cream"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </div>
    </div>
  )
}
