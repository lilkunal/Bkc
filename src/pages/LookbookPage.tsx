import { Link } from 'react-router-dom'
import { PRODUCTS, type Product } from '../data/catalog'
import { Tee } from '../components/Tee'
import { SectionHead } from '../components/ProductCard'

type Look = {
  label: string
  note: string
  id?: string
  slugMatch?: string
}

const LOOKS: Look[] = [
  { id: 'BKC-1001', label: 'Hero white · studio', note: 'The original. Font-cycled on the home page.' },
  { id: 'BKC-1002', label: 'Monogram black', note: 'Night shift energy.' },
  { slugMatch: 'gaay-nikli-hai', label: 'Gaay Nikli Hai', note: 'Traffic override bestseller.' },
  { slugMatch: 'allah-ki-gaay', label: 'Allah Ki Gaay', note: 'Idiom: bhola-bhala, harmless.' },
  { slugMatch: 'pehle-matdaan', label: 'Polling day', note: 'Non-partisan turnout.' },
  { slugMatch: 'maggi-is-a-meal', label: 'Maggi Is A Meal', note: 'Food capsule king.' },
]

function resolve(look: Look): Product {
  if (look.id) {
    return PRODUCTS.find((p) => p.id === look.id) || PRODUCTS[0]
  }
  if (look.slugMatch) {
    return PRODUCTS.find((p) => p.slug.includes(look.slugMatch!)) || PRODUCTS[0]
  }
  return PRODUCTS[0]
}

export function LookbookPage() {
  const shots = LOOKS.map((look) => ({ ...look, product: resolve(look) }))

  return (
    <div className="mx-auto max-w-[1440px] px-[clamp(1rem,0.5rem+2vw,3rem)] py-8 md:py-12">
      <SectionHead
        eyebrow="Lookbook"
        title={
          <>
            Worn, not
            <br />
            clip-art
          </>
        }
        note="Phase 1 uses the procedural garment engine as the product shot. Face-based photographic mockups slot into this grid as assets land."
      />

      <div className="mb-8 border-2 border-ink bg-paper-2 p-4 text-sm text-ink-70 md:p-5">
        Model direction: South Asian, thick mustache, wavy black hair — identity reference used for the hero lookbook
        still. Friend face pending for a second model slot.
      </div>

      <figure className="mb-8 overflow-hidden border-2 border-ink bg-cream">
        <img
          src={`${import.meta.env.BASE_URL}lookbook/hero-kunal.png`}
          alt="Model wearing Bharat Ka Chootiya oversized white tee"
          width={900}
          height={1200}
          className="mx-auto max-h-[70vh] w-full object-cover object-top"
          loading="eager"
        />
        <figcaption className="border-t-2 border-ink p-4">
          <h3 className="font-display text-xl uppercase">Hero drop — photographic</h3>
          <p className="text-sm text-ink-70">Generated lookbook still from the founder face reference · white oversized</p>
          <Link to="/product/BKC-1001" className="mt-2 inline-block text-sm underline">
            Shop this tee →
          </Link>
        </figcaption>
      </figure>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shots.map((s) => (
          <figure key={s.label} className="border-2 border-ink bg-cream">
            <div className="bg-gradient-to-b from-paper-3 to-paper-2 p-6">
              <Tee product={s.product} detail="high" className="mx-auto max-w-[280px]" />
            </div>
            <figcaption className="border-t-2 border-ink p-4">
              <h3 className="font-display text-lg uppercase">{s.label}</h3>
              <p className="text-sm text-ink-70">{s.note}</p>
              <Link to={`/product/${s.product.id}`} className="mt-2 inline-block text-sm underline">
                View product →
              </Link>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}
