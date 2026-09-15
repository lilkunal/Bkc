/**
 * The home page, as data: switch sections on or off, reorder them, and change their copy here.
 * Product rows pull from the product sheet, so they update when the sheet does.
 */
import type { ProductFilter, ProductSource } from '../data/catalog'

type Cta = { label: string; to: string }

export type HomeSection =
  | {
      type: 'hero'
      enable: boolean
      eyebrow: string
      title: string
      accent: string
      lede: string
      primary: Cta
      secondary?: Cta
      /** Animated backdrop behind the hero: three.js silk or a generated shape scene, depending on the theme. */
      backdrop3d: boolean
    }
  | { type: 'tiles'; enable: boolean; label: string; tiles: { label: string; to: string; productId?: string; filter?: ProductFilter }[] }
  | {
      type: 'collections'
      enable: boolean
      eyebrow: string
      title: string
      note: string
      cards: { label: string; note: string; to: string; productId?: string; filter?: ProductFilter }[]
    }
  | { type: 'ring'; enable: boolean; eyebrow: string; title: string; note: string; source: ProductSource; filter?: ProductFilter; count: number }
  | { type: 'products'; enable: boolean; title: string; count: number; tabs: { label: string; to: string; source: ProductSource; filter?: ProductFilter }[] }
  | { type: 'ornament'; enable: boolean }
  | { type: 'quote'; enable: boolean; quote: string; by: string }
  | { type: 'atlas'; enable: boolean; eyebrow: string; title: string; cta: Cta }
  | { type: 'reviews'; enable: boolean; eyebrow: string; title: string }
  | { type: 'audiences'; enable: boolean; eyebrow: string; title: string; items: { title: string; note: string; to: string }[] }
  | { type: 'marquee'; enable: boolean; eyebrow: string; title: string; source: ProductSource; count: number }
  | { type: 'journal'; enable: boolean; eyebrow: string; title: string; count: number }
  | { type: 'band'; enable: boolean; eyebrow: string; title: string; text: string; cta: Cta }
  | { type: 'trust'; enable: boolean }

export type SectionOf<T extends HomeSection['type']> = Extract<HomeSection, { type: T }>

export const HOME: HomeSection[] = [
  {
    type: 'hero',
    enable: true,
    eyebrow: 'Welcome to BKC · Drop 01',
    title: 'From gaali',
    accent: 'to habit.',
    lede: 'Premium 240 GSM tees printed the way India actually talks. Soft-censored, never softened.',
    primary: { label: 'Shop the collection', to: '/shop' },
    secondary: { label: 'Explore the slang atlas', to: '/states' },
    backdrop3d: true,
  },
  {
    type: 'tiles',
    enable: false,
    label: 'Shop by category',
    tiles: [
      { label: 'Desi Humour', to: '/shop?cat=humour', filter: { cat: 'humour' } },
      { label: 'State Slang', to: '/states', filter: { cat: 'slang' } },
      { label: 'Shirts', to: '/shop?type=shirt', filter: { type: 'shirt' } },
      { label: 'The Monogram', to: '/product/BKC-1002', productId: 'BKC-1002' },
    ],
  },
  {
    type: 'collections',
    enable: true,
    eyebrow: 'Collections',
    title: 'Pick your dialect',
    note: 'Three ways into the drop. Every card counts its designs straight from the product sheet.',
    cards: [
      { label: 'Desi Humour', note: 'Aunties, exams, jugaad', to: '/shop?cat=humour', filter: { cat: 'humour' } },
      { label: 'State Slang', note: 'Say it like home', to: '/states', filter: { cat: 'regional' } },
      { label: 'Shirts', note: 'Office-safe, barely', to: '/shop?type=shirt', filter: { type: 'shirt' } },
    ],
  },
  {
    type: 'ring',
    enable: true,
    eyebrow: 'The drop in 3D',
    title: 'Spin the collection',
    note: 'Drag or swipe to turn the ring. Tap the card in front to open it.',
    source: 'bestsellers',
    count: 10,
  },
  {
    type: 'products',
    enable: true,
    title: 'Shop the drop',
    count: 8,
    tabs: [
      { label: 'New arrivals', source: 'newest', to: '/shop?sort=newest' },
      { label: 'Best sellers', source: 'bestsellers', to: '/shop?sort=reviews' },
      { label: 'Under ₹700', source: 'bestsellers', filter: { under: 700 }, to: '/shop?under=700' },
      { label: 'Shirts', source: 'newest', filter: { type: 'shirt' }, to: '/shop?type=shirt' },
    ],
  },
  { type: 'ornament', enable: true },
  {
    type: 'quote',
    enable: true,
    quote: 'Everyone in India has called someone a ch**tiya. We just printed it on 240 GSM.',
    by: 'The first rule of BKC',
  },
  {
    type: 'atlas',
    enable: true,
    eyebrow: 'The India slang atlas',
    title: 'Shop by where you speak',
    cta: { label: 'Open the atlas', to: '/states' },
  },
  { type: 'reviews', enable: true, eyebrow: 'Worn and reviewed', title: 'What the bag says' },
  {
    type: 'audiences',
    enable: true,
    eyebrow: 'For everyone',
    title: 'Everyone gets one',
    items: [
      { to: '/shop?aud=men', title: 'Men', note: 'Oversized + classic' },
      { to: '/shop?aud=women', title: 'Women', note: 'Crop, oversized, regular' },
      { to: '/shop?cat=pride', title: 'Pride', note: 'Stocked all year' },
      { to: '/shop?fit=kids', title: 'Kids', note: 'Skin-safe inks' },
      { to: '/shop?cat=animals', title: 'Animals', note: 'Cows, strays, insects' },
    ],
  },
  { type: 'marquee', enable: true, eyebrow: 'Fresh off the press', title: 'Straight from the studio', source: 'newest', count: 14 },
  { type: 'journal', enable: true, eyebrow: 'The journal', title: 'Read before you print', count: 3 },
  {
    type: 'band',
    enable: true,
    eyebrow: 'Civic',
    title: 'Vote. Ask. Show up.',
    text: 'Non-partisan turnout and peaceful-assembly prints. No party names, colours or symbols. Ever.',
    cta: { label: 'Shop civic tees', to: '/shop?cat=civic' },
  },
  { type: 'trust', enable: true },
]
