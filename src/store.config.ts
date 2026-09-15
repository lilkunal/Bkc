/**
 * Store settings. Together with catalog/products.csv, this is what you change
 * to turn the template into a different store.
 */
export const STORE = {
  name: 'BKC',
  fullName: 'Bharat Ka Ch**tiya',
  /** Shown in policies and the footer. */
  legalName: 'BKC Demo Store',
  tagline: 'Printed tees for every Indian tongue.',
  siteUrl: 'https://lilkunal.github.io/Bkc/',
  supportEmail: 'hello@bkc.example',
  supportHours: 'Monday to Saturday, 10am–7pm IST',
  address: 'Demo storefront, not a registered business address',
  country: 'India',

  /** Look and feel: a theme key from src/themes.ts (midnight, garnet, sandstone, monsoon, frost, ember). */
  theme: 'midnight',

  currency: { code: 'INR', locale: 'en-IN' },

  /** Short lines in the bar above the header. */
  announcement: ['Ships in 48 hours', '240 GSM cotton', 'Water-based inks'],

  shipping: {
    /** Business days to pack and hand over to the courier. */
    dispatchDays: 2,
    deliveryDaysMin: 3,
    deliveryDaysMax: 6,
    freeAbove: 999,
    fee: 79,
    /** Express delivery: extra charge, and how many days sooner it arrives. */
    expressFee: 99,
    expressDaysFaster: 2,
  },

  giftWrapFee: 49,
  /** Handling fee for cash on delivery. */
  codFee: 29,

  /** Prices include tax. Each item's rate comes from the first slab its price fits (apparel GST). */
  tax: {
    label: 'GST',
    slabs: [{ upTo: 2500, rate: 5 }, { rate: 18 }] as { upTo?: number; rate: number }[],
  },

  /** Codes shoppers can enter in the bag or at checkout. kind: percent | flat | shipping. */
  coupons: [
    { code: 'BKC10', kind: 'percent', value: 10, minSubtotal: 0, note: '10% off your bag' },
    { code: 'FIRST150', kind: 'flat', value: 150, minSubtotal: 999, note: '₹150 off bags of ₹999 or more' },
    { code: 'FREESHIP', kind: 'shipping', value: 0, minSubtotal: 0, note: 'free shipping on any bag' },
  ],

  returns: {
    days: 7,
    summary: 'Free size exchanges within 7 days of delivery, and full refunds for anything that arrives damaged. Unworn, unwashed, tags on.',
  },

  payments: ['UPI', 'RuPay', 'Visa', 'Mastercard'],

  seo: {
    description: 'BKC — Bharat Ka Ch**tiya. Premium printed tees in the way India actually talks. Shop by state, region and day-to-day slang.',
    /** 1200×630 image in public/, used for link previews. */
    shareImage: 'og-image.png',
  },

  /** Optional sections. Pages with no data (e.g. no state column in the sheet) hide themselves too. */
  features: {
    marketFile: false,
    caseStudy: true,
    /** Floating picker that lets visitors try every theme (handy for a demo; switch off for a live store). */
    themePicker: true,
  },

  /** Demo mode: checkout takes no payment and forms send nothing. */
  demo: true,
}
