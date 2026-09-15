/**
 * Garment types the store can sell, and the fits each one comes in.
 * The product sheet's `type` and `fit` columns must match the keys here.
 * To sell a new garment (hoodies, polos…), add an entry and a blank mockup photo.
 */

export type GarmentType = 'tee' | 'shirt'

export interface FitInfo {
  key: string
  label: string
  blurb: string
  weight: string
  sizes: string[]
  /** Garment measurements in cm, laid flat and doubled: [chest, length]. */
  measurements: Record<string, [chest: number, length: number]>
}

export interface GarmentInfo {
  key: GarmentType
  label: string
  plural: string
  defaultFit: string
  care: string[]
  fits: Record<string, FitInfo>
}

export const GARMENTS: Record<GarmentType, GarmentInfo> = {
  tee: {
    key: 'tee',
    label: 'T-shirt',
    plural: 'T-shirts',
    defaultFit: 'oversized',
    care: ['Machine wash cold, inside out', 'Do not bleach', 'Dry in the shade', 'Iron inside out; never iron over the print'],
    fits: {
      oversized: {
        key: 'oversized',
        label: 'Oversized',
        blurb: 'Boxy 240 GSM drop-shoulder. Falls 2–3 inches below the shoulder point.',
        weight: '240 GSM cotton',
        sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
        measurements: { S: [106, 70], M: [112, 72], L: [118, 74], XL: [124, 76], XXL: [130, 78], '3XL': [136, 80] },
      },
      regular: {
        key: 'regular',
        label: 'Regular / Classic',
        blurb: 'Everyday 180 GSM bio-washed cotton. True to size, straight hem.',
        weight: '180 GSM cotton',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
        measurements: { XS: [92, 66], S: [97, 68], M: [102, 70], L: [107, 72], XL: [112, 74], XXL: [117, 76], '3XL': [122, 78] },
      },
      crop: {
        key: 'crop',
        label: 'Boxy Crop',
        blurb: 'Cropped 200 GSM boxy cut. Sits at the high waist.',
        weight: '200 GSM cotton',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        measurements: { XS: [98, 48], S: [104, 50], M: [110, 52], L: [116, 54], XL: [122, 56] },
      },
      kids: {
        key: 'kids',
        label: 'Kids',
        blurb: 'Soft 160 GSM combed cotton, no-scratch neck tape, skin-safe inks.',
        weight: '160 GSM combed cotton',
        sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y', '12-13Y'],
        measurements: { '2-3Y': [64, 40], '4-5Y': [70, 44], '6-7Y': [76, 48], '8-9Y': [82, 52], '10-11Y': [88, 56], '12-13Y': [94, 60] },
      },
    },
  },
  shirt: {
    key: 'shirt',
    label: 'Shirt',
    plural: 'Shirts',
    defaultFit: 'regular',
    care: ['Machine wash cold with similar colours', 'Hang to dry', 'Warm iron', 'Do not bleach'],
    fits: {
      regular: {
        key: 'regular',
        label: 'Regular',
        blurb: 'Classic button-down cut with room through the chest and a straight hem.',
        weight: '120 GSM cotton poplin',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        measurements: { S: [102, 72], M: [108, 74], L: [114, 76], XL: [120, 78], XXL: [126, 80] },
      },
      slim: {
        key: 'slim',
        label: 'Slim',
        blurb: 'Tapered through the waist for a sharper line under a jacket.',
        weight: '110 GSM cotton poplin',
        sizes: ['S', 'M', 'L', 'XL'],
        measurements: { S: [98, 71], M: [104, 73], L: [110, 75], XL: [116, 77] },
      },
      relaxed: {
        key: 'relaxed',
        label: 'Relaxed',
        blurb: 'Dropped shoulder, boxy body and a camp collar. Wear it open.',
        weight: '140 GSM linen blend',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        measurements: { S: [112, 72], M: [118, 74], L: [124, 76], XL: [130, 78], XXL: [136, 80] },
      },
    },
  },
}

export function isGarmentType(value: string): value is GarmentType {
  return Object.prototype.hasOwnProperty.call(GARMENTS, value)
}

/** Fit details for a garment, falling back to that garment's default fit. */
export function fitInfo(type: GarmentType, fit: string): FitInfo {
  const garment = GARMENTS[type]
  return garment.fits[fit] ?? garment.fits[garment.defaultFit]
}
