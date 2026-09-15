/**
 * Named garment colours. In the product sheet, `colour` and `other_colours`
 * accept a key ("mustard"), a name ("Haldi Mustard") or a hex code ("#1C5B49").
 */

export interface Colour {
  key: string
  name: string
  hex: string
  /** Print colour that reads well on this garment colour. */
  ink: string
}

export const PALETTE: Record<string, Omit<Colour, 'key'>> = {
  white: { name: 'Chalk White', hex: '#FFFFFF', ink: '#0E0E0C' },
  black: { name: 'Kajal Black', hex: '#131313', ink: '#F6F1E6' },
  offwhite: { name: 'Khadi Off-White', hex: '#F1EADB', ink: '#0E0E0C' },
  mustard: { name: 'Haldi Mustard', hex: '#E7B325', ink: '#17150B' },
  chilli: { name: 'Mirchi Red', hex: '#D22B2B', ink: '#FFF6E8' },
  bottle: { name: 'Bottle Green', hex: '#1C5B49', ink: '#F4EFE4' },
  indigo: { name: 'Neel Indigo', hex: '#27356C', ink: '#F4EFE4' },
  powder: { name: 'Powder Blue', hex: '#AFCBE3', ink: '#14213D' },
  lilac: { name: 'Lilac Haze', hex: '#C6ACE4', ink: '#221436' },
  sand: { name: 'Desert Sand', hex: '#DAC7A6', ink: '#2A2013' },
  coral: { name: 'Coral Crush', hex: '#F4795B', ink: '#2A0F07' },
  mint: { name: 'Pudina Mint', hex: '#A6E2C6', ink: '#0C2E22' },
  charcoal: { name: 'Charcoal Grey', hex: '#3A3B3F', ink: '#F4EFE4' },
  maroon: { name: 'Maroon Velvet', hex: '#6E1F31', ink: '#F7E9D5' },
  olive: { name: 'Olive Fatigue', hex: '#6B7A4A', ink: '#F6F3E4' },
  rose: { name: 'Rose Pink', hex: '#F0A5B8', ink: '#3A1220' },
  acid: { name: 'Acid Wash Grey', hex: '#B8B4AA', ink: '#1B1A16' },
  saffron: { name: 'Kesari Saffron', hex: '#FF7A18', ink: '#2A1000' },
  teal: { name: 'Peacock Teal', hex: '#12808C', ink: '#F1FAFB' },
  lavender: { name: 'Lavender Ice', hex: '#DCD6F2', ink: '#26204A' },
}

const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i

export function normaliseHex(value: string): string | null {
  const m = HEX.exec(value.trim())
  if (!m) return null
  const h = m[1].length === 3 ? m[1].split('').map((c) => c + c).join('') : m[1]
  return '#' + h.toUpperCase()
}

function luma(hex: string) {
  const n = parseInt(hex.slice(1), 16)
  return (((n >> 16) & 255) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000
}

/** Resolve a sheet colour value to a colour, or null if it can't be understood. */
export function resolveColour(value: string): Colour | null {
  const v = value.trim()
  if (!v) return null
  const key = v.toLowerCase()
  if (PALETTE[key]) return { key, ...PALETTE[key] }
  const named = Object.entries(PALETTE).find(([, c]) => c.name.toLowerCase() === key)
  if (named) return { key: named[0], ...named[1] }
  const hex = normaliseHex(v)
  if (hex) {
    return { key: 'hex-' + hex.slice(1).toLowerCase(), name: hex, hex, ink: luma(hex) > 150 ? '#0E0E0C' : '#F4EFE4' }
  }
  return null
}
