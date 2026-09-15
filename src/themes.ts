/**
 * Store themes: a full palette, type pairing, corner style and hero backdrop each.
 * The store opens in STORE.theme; in demo mode the theme picker lets visitors try the rest.
 *
 * The moods were chosen from public template previews on scrolltide.co (Rann Mahal, Obsidia, Dune,
 * Verdant, Glacier, Cinder). Palettes, fonts and code here are original. Every text pair meets WCAG AA.
 */

export type HeroBackdrop = 'silk' | 'dunes' | 'peaks' | 'blobs' | 'embers'

export interface ThemeColors {
  /** Page background. */
  night: string
  surface: string
  /** Studio tile behind garments. */
  tile: string
  line: string
  control: string
  /** Main text. */
  bone: string
  muted: string
  faint: string
  /** Accent. */
  gold: string
  goldHi: string
  goldDeep: string
  /** Text on accent-filled buttons and badges. */
  onGold: string
  success: string
  warning: string
  error: string
  info: string
}

export interface Theme {
  key: string
  name: string
  mood: string
  scheme: 'dark' | 'light'
  colors: ThemeColors
  fonts: {
    display: string
    sans: string
    /** Weight of display headings; section headings use one step heavier. */
    displayWeight: number
    /** Google Fonts stylesheet, loaded when the theme is first used. */
    href?: string
  }
  /** Corners of buttons, inputs and chips. */
  radius: string
  /** Corners of product tiles and panels. */
  cardRadius: string
  backdrop: HeroBackdrop
}

const GOOGLE = 'https://fonts.googleapis.com/css2?display=swap&family='

const DARK_STATUS = { success: '#74B38E', warning: '#D9A441', error: '#E0675C', info: '#8FA8C8' }
const LIGHT_STATUS = { success: '#2F7A4E', warning: '#8A5A00', error: '#B3261E', info: '#2D5D8F' }

export const THEMES: Theme[] = [
  {
    key: 'midnight',
    name: 'Midnight Gold',
    mood: 'Warm black and engraved gold. Palace at dusk.',
    scheme: 'dark',
    colors: {
      night: '#0B0A08', surface: '#14120F', tile: '#1D1A15', line: '#3A3227', control: '#7A7263',
      bone: '#F2ECE0', muted: '#A89F8E', faint: '#7A7263',
      gold: '#C9A24A', goldHi: '#E0BE72', goldDeep: '#9C7A2E', onGold: '#0B0A08',
      ...DARK_STATUS,
    },
    fonts: { display: '"Cormorant Garamond", Georgia, "Times New Roman", serif', sans: '"Jost", Futura, "Century Gothic", "Segoe UI", sans-serif', displayWeight: 500 },
    radius: '0px',
    cardRadius: '0px',
    backdrop: 'silk',
  },
  {
    key: 'garnet',
    name: 'Garnet',
    mood: 'Obsidian glass with one garnet flare. Jewellery-case quiet.',
    scheme: 'dark',
    colors: {
      night: '#0A0A0B', surface: '#121214', tile: '#1A1A1D', line: '#2E2E33', control: '#707078',
      bone: '#EDEBE8', muted: '#A6A4A9', faint: '#76747A',
      gold: '#E4606F', goldHi: '#EE8591', goldDeep: '#B23A4C', onGold: '#0A0A0B',
      ...DARK_STATUS,
    },
    fonts: {
      display: '"Bodoni Moda", Didot, "Times New Roman", serif',
      sans: '"Manrope", "Segoe UI", system-ui, sans-serif',
      displayWeight: 500,
      href: `${GOOGLE}Bodoni+Moda:opsz,wght@6..96,500;6..96,600&family=Manrope:wght@400;500;600`,
    },
    radius: '0px',
    cardRadius: '2px',
    backdrop: 'silk',
  },
  {
    key: 'sandstone',
    name: 'Sandstone',
    mood: 'Wind-shaped sand, terracotta ink, editorial calm.',
    scheme: 'light',
    colors: {
      night: '#F2EBE1', surface: '#E9DFD2', tile: '#E3D6C5', line: '#CDBFAC', control: '#8C7D6B',
      bone: '#2A2119', muted: '#65564A', faint: '#9A8A78',
      gold: '#A4461F', goldHi: '#BD5A2E', goldDeep: '#7F3414', onGold: '#FFF8F0',
      ...LIGHT_STATUS,
    },
    fonts: {
      display: '"Fraunces", Georgia, serif',
      sans: '"DM Sans", "Segoe UI", system-ui, sans-serif',
      displayWeight: 500,
      href: `${GOOGLE}Fraunces:opsz,wght@9..144,500;9..144,600&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600`,
    },
    radius: '999px',
    cardRadius: '18px',
    backdrop: 'dunes',
  },
  {
    key: 'monsoon',
    name: 'Monsoon',
    mood: 'Low green light and acid-lime detail. Built for the field.',
    scheme: 'dark',
    colors: {
      night: '#0B100D', surface: '#111914', tile: '#17211B', line: '#2A3A30', control: '#62756A',
      bone: '#E6EEE7', muted: '#9DB0A3', faint: '#6F8276',
      gold: '#B9E86A', goldHi: '#CFF291', goldDeep: '#8DBB45', onGold: '#0B100D',
      ...DARK_STATUS,
    },
    fonts: {
      display: '"Unbounded", "Segoe UI", system-ui, sans-serif',
      sans: '"Inter", "Segoe UI", system-ui, sans-serif',
      displayWeight: 500,
      href: `${GOOGLE}Unbounded:wght@500;600&family=Inter:wght@400;500;600`,
    },
    radius: '999px',
    cardRadius: '20px',
    backdrop: 'blobs',
  },
  {
    key: 'frost',
    name: 'Frost',
    mood: 'Cool exhibition light, glacier blue, monumental serif.',
    scheme: 'light',
    colors: {
      night: '#EEF2F5', surface: '#E3E9EE', tile: '#DAE2E9', line: '#C3CED8', control: '#7A8A98',
      bone: '#111B26', muted: '#4E5D6B', faint: '#8A98A5',
      gold: '#1F5FBF', goldHi: '#3674D1', goldDeep: '#164A96', onGold: '#FFFFFF',
      ...LIGHT_STATUS,
    },
    fonts: {
      display: '"Playfair Display", Georgia, serif',
      sans: '"Inter", "Segoe UI", system-ui, sans-serif',
      displayWeight: 600,
      href: `${GOOGLE}Inter:wght@400;500;600`,
    },
    radius: '4px',
    cardRadius: '8px',
    backdrop: 'peaks',
  },
  {
    key: 'ember',
    name: 'Ember',
    mood: 'Amber light through smoke, heavy grotesk type.',
    scheme: 'dark',
    colors: {
      night: '#120B07', surface: '#1B120C', tile: '#241810', line: '#3E2B1E', control: '#7E6655',
      bone: '#F6EDE4', muted: '#BCA897', faint: '#8A7462',
      gold: '#F2913D', goldHi: '#F7AE6B', goldDeep: '#C96E22', onGold: '#120B07',
      ...DARK_STATUS,
    },
    fonts: {
      display: '"Archivo", "Arial Narrow", "Segoe UI", sans-serif',
      sans: '"Inter", "Segoe UI", system-ui, sans-serif',
      displayWeight: 700,
      href: `${GOOGLE}Archivo:wght@500;700;800&family=Inter:wght@400;500;600`,
    },
    radius: '12px',
    cardRadius: '16px',
    backdrop: 'embers',
  },
]

export const DEFAULT_THEME = THEMES[0]

export function getTheme(key: string | null | undefined): Theme | undefined {
  return THEMES.find((t) => t.key === key)
}

const COLOR_VARS: Record<keyof ThemeColors, string> = {
  night: '--color-night',
  surface: '--color-surface',
  tile: '--color-tile',
  line: '--color-line',
  control: '--color-control',
  bone: '--color-bone',
  muted: '--color-muted',
  faint: '--color-faint',
  gold: '--color-gold',
  goldHi: '--color-gold-hi',
  goldDeep: '--color-gold-deep',
  onGold: '--color-on-gold',
  success: '--color-success',
  warning: '--color-warning',
  error: '--color-error',
  info: '--color-info',
}

/** CSS custom properties for a theme. */
export function themeVars(theme: Theme): Record<string, string> {
  const vars: Record<string, string> = {}
  for (const [key, name] of Object.entries(COLOR_VARS)) vars[name] = theme.colors[key as keyof ThemeColors]
  vars['--font-display'] = theme.fonts.display
  vars['--font-sans'] = theme.fonts.sans
  vars['--display-weight'] = String(theme.fonts.displayWeight)
  vars['--radius'] = theme.radius
  vars['--radius-card'] = theme.cardRadius
  return vars
}

/** Tokens as a pasteable CSS block, for handing a palette to a developer. */
export function themeCss(theme: Theme) {
  const lines = Object.entries(themeVars(theme)).map(([k, v]) => `  ${k}: ${v};`)
  return `/* ${theme.name} */\n:root {\n${lines.join('\n')}\n}\n`
}

export const THEME_STORAGE_KEY = 'bkc_theme'
export const THEME_VARS_STORAGE_KEY = 'bkc_theme_vars'

/** Applies a theme to the page: custom properties, colour scheme, fonts and the browser theme colour. */
export function applyTheme(theme: Theme, remember: boolean) {
  const root = document.documentElement
  const vars = themeVars(theme)
  for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v)
  root.dataset.theme = theme.key
  root.style.colorScheme = theme.scheme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.colors.night)

  if (theme.fonts.href && !document.querySelector(`link[data-theme-font="${theme.key}"]`)) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = theme.fonts.href
    link.dataset.themeFont = theme.key
    document.head.appendChild(link)
  }

  try {
    if (remember) {
      localStorage.setItem(THEME_STORAGE_KEY, theme.key)
      // Read by the inline script in index.html, so a reload paints in this theme straight away.
      localStorage.setItem(THEME_VARS_STORAGE_KEY, JSON.stringify(vars))
    } else {
      localStorage.removeItem(THEME_STORAGE_KEY)
      localStorage.removeItem(THEME_VARS_STORAGE_KEY)
    }
  } catch {
    // Storage blocked: the theme still applies for this visit.
  }
}

/** Theme to open with: a ?theme= link, then the visitor's saved choice (both only when visitors may choose), then the store's. */
export function initialTheme(storeKey: string, visitorsMayChoose: boolean): Theme {
  const fallback = getTheme(storeKey) ?? DEFAULT_THEME
  if (!visitorsMayChoose || typeof window === 'undefined') return fallback
  const fromLink = getTheme(new URLSearchParams(window.location.search).get('theme'))
  if (fromLink) return fromLink
  try {
    return getTheme(localStorage.getItem(THEME_STORAGE_KEY)) ?? fallback
  } catch {
    return fallback
  }
}

function rgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', '').slice(0, 6), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/** Blend two hex colours; t = 0 gives `a`, 1 gives `b`. */
export function mixHex(a: string, b: string, t: number) {
  const [ar, ag, ab] = rgb(a)
  const [br, bg, bb] = rgb(b)
  const c = (x: number, y: number) => Math.round(x + (y - x) * t).toString(16).padStart(2, '0')
  return `#${c(ar, br)}${c(ag, bg)}${c(ab, bb)}`
}

export function withAlpha(hex: string, alpha: number) {
  const [r, g, b] = rgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/** Current value of a theme colour token, for canvas and WebGL code. */
export function cssColor(name: keyof ThemeColors) {
  if (typeof document === 'undefined') return DEFAULT_THEME.colors[name]
  return getComputedStyle(document.documentElement).getPropertyValue(COLOR_VARS[name]).trim() || DEFAULT_THEME.colors[name]
}
