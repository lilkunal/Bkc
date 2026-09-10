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
  if (look.id) return PRODUCTS.find((p) => p.id === look.id) || PRODUCTS[0]
  if (look.slugMatch) return PRODUCTS.find((p) => p.slug.includes(look.slugMatch!)) || PRODUCTS[0]
  return PRODUCTS[0]
}

export function LookbookPage() {
  const shots = LOOKS.map((look) => ({ ...look, product: resolve(look) }))

  return (
    <div className="shell py-10 md:py-14">
      <SectionHead
        level={1}
        eyebrow="Lookbook"
        title={
          <>
            Worn, not
            <br />
            clip-art
          </>
        }
        note="The first photographic still, plus studio renders of the drop's loudest prints."
      />

      <figure className="mb-14 grid overflow-hidden border border-line bg-surface md:grid-cols-[1.1fr_1fr]">
        <div className="relative h-[520px] md:h-[640px]">
          <img
            src={`${import.meta.env.BASE_URL}lookbook/hero-kunal.webp`}
            width={1024}
            height={1536}
            alt="Model wearing the white oversized Bharat Ka Ch**tiya tee"
            className="absolute inset-0 h-full w-full object-cover object-[50%_42%]"
            fetchPriority="high"
          />
        </div>
        <figcaption className="grid content-center justify-items-start gap-4 p-8 md:p-12">
          <p className="eyebrow">Hero drop · photographic</p>
          <h2 className="h-section">The Original, worn</h2>
          <p className="lede">
            White oversized, 240 GSM. A generated still made from the founder’s face reference. More photography lands here
            as the drop grows.
          </p>
          <Link to="/product/BKC-1001" className="btn btn-secondary">
            Shop this tee
          </Link>
        </figcaption>
      </figure>

      <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {shots.map((s) => (
          <figure key={s.label} className="group m-0 grid content-start gap-4">
            <Link to={`/product/${s.product.id}`} tabIndex={-1} aria-hidden="true" className="spot block overflow-hidden p-8">
              <Tee
                product={s.product}
                detail="high"
                className="mx-auto max-w-[280px] transition-transform duration-700 ease-lux group-hover:scale-[1.03]"
              />
            </Link>
            <figcaption className="grid gap-1.5">
              <h2 className="font-display text-2xl font-semibold uppercase tracking-[0.05em]">{s.label}</h2>
              <p className="text-sm text-muted">{s.note}</p>
              <Link to={`/product/${s.product.id}`} className="u micro mt-1 justify-self-start text-gold">
                View product →
              </Link>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}
