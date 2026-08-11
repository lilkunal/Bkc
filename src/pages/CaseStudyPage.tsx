import { Link } from 'react-router-dom'
import { PRODUCTS } from '../data/catalog'
import { BRAND } from '../data/states'
import { SectionHead } from '../components/ProductCard'

export function CaseStudyPage() {
  return (
    <div className="mx-auto max-w-3xl px-[clamp(1rem,0.5rem+2vw,3rem)] py-8 md:py-12">
      <p className="font-mono text-xs uppercase tracking-wider text-ink-45">Portfolio case study</p>
      <h1 className="mt-2 font-display text-[clamp(2.2rem,1rem+3vw,3.75rem)] uppercase leading-none">
        BKC — soft-censor humour + India slang atlas
      </h1>
      <p className="mt-4 text-lg text-ink-70">
        Role: founder / designer / engineer · Stack: React, Vite, Tailwind, Framer Motion · Host: GitHub Pages
      </p>

      <SectionHead eyebrow="01 — The gap" title="What ecommerce wasn’t giving" />
      <div className="space-y-3 text-sm text-ink-70">
        <p>
          <b>{BRAND.differentiator}</b>
        </p>
        <p>
          City slang brands go deep on one tongue. National D2C goes wide on Hindi/English memes. Nobody shipped a
          filterable state → region → day-to-day language atlas in one cart. That is BKC’s wedge.
        </p>
      </div>

      <SectionHead eyebrow="02 — The word" title="Ch**tiya / चूtiya" />
      <p className="text-sm text-ink-70">
        Gaali → habit. Soft censor on surfaces, Hinglish logo lockup (Devanagari चू + Latin tiya), motto:{' '}
        {BRAND.motto}
      </p>

      <SectionHead eyebrow="03 — Product" title="What we shipped" />
      <ul className="list-disc space-y-2 pl-5 text-sm text-ink-70">
        <li>{PRODUCTS.length}+ designs including Uttarakhand Kumaon/Garhwal and pan-India vernacular</li>
        <li>States atlas page + shop filters for state and region</li>
        <li>Chooser blogs: fit, slang atlas, soft-censor brand, how to pick</li>
        <li>Mobile-first PLP, sticky ATC, procedural SVG garments</li>
      </ul>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/states" className="min-h-12 border-2 border-ink bg-marigold px-5 font-bold uppercase">
          States atlas
        </Link>
        <Link
          to="/shop?state=uttarakhand"
          className="min-h-12 border-2 border-ink bg-cream px-5 font-bold uppercase"
        >
          Uttarakhand tees
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
