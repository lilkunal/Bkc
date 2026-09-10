import { Link } from 'react-router-dom'
import { PRODUCTS } from '../data/catalog'
import { BRAND } from '../data/states'
import { SectionHead } from '../components/ProductCard'

export function CaseStudyPage() {
  return (
    <article className="mx-auto max-w-3xl px-[clamp(1rem,0.5rem+2.5vw,3rem)] py-10 md:py-14">
      <p className="eyebrow">Portfolio case study</p>
      <h1 className="mt-4 font-display text-[clamp(2.2rem,1.2rem+3vw,3.75rem)] font-medium uppercase leading-[1.02] tracking-[0.02em]">
        BKC: soft-censor humour + India slang atlas
      </h1>
      <p className="lede mt-5 max-w-none">
        Role: founder / designer / engineer · Stack: React, Vite, Tailwind, Framer Motion, three.js · Host: GitHub Pages
      </p>

      <section className="mt-14" aria-labelledby="cs-gap">
        <SectionHead eyebrow="01 · The gap" title="What ecommerce wasn’t giving" id="cs-gap" />
        <div className="grid gap-4 text-muted">
          <p>
            <b className="font-medium text-bone">{BRAND.differentiator}</b>
          </p>
          <p>
            City slang brands go deep on one tongue. National D2C goes wide on Hindi/English memes. Nobody shipped a
            filterable state → region → day-to-day language atlas in one cart. That is BKC’s wedge.
          </p>
        </div>
      </section>

      <section className="mt-14" aria-labelledby="cs-word">
        <SectionHead eyebrow="02 · The word" title="Ch**tiya / चूtiya" id="cs-word" />
        <p className="text-muted">
          Gaali → habit. Soft censor on surfaces, Hinglish logo lockup (Devanagari चू + Latin tiya), motto: {BRAND.motto}
        </p>
      </section>

      <section className="mt-14" aria-labelledby="cs-product">
        <SectionHead eyebrow="03 · Product" title="What we shipped" id="cs-product" />
        <ul className="grid gap-3 border-t border-line">
          {[
            `${PRODUCTS.length}+ designs including Uttarakhand Kumaon/Garhwal and pan-India vernacular`,
            'States atlas page + shop filters for state and region',
            'Chooser blogs: fit, slang atlas, soft-censor brand, how to pick',
            'Mobile-first PLP, sticky ATC, procedural SVG garments',
            'Dark-luxury redesign with a documented design system and WCAG AA contrast',
          ].map((item) => (
            <li key={item} className="border-b border-line py-3 text-muted">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link to="/states" className="btn btn-primary">
          States atlas
        </Link>
        <Link to="/shop?state=uttarakhand" className="btn btn-secondary">
          Uttarakhand tees
        </Link>
        <a href="https://github.com/lilkunal/Bkc" className="btn btn-ghost u" target="_blank" rel="noreferrer">
          GitHub ↗
        </a>
      </div>
    </article>
  )
}
