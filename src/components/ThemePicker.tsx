import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { useToast } from '../context/ToastContext'
import { STORE } from '../store.config'
import { themeCss } from '../themes'
import { IconClose, IconPalette } from './Icons'

/** Loads every theme's fonts, so the "Aa" previews render in their real faces. */
function preloadThemeFonts(hrefs: (string | undefined)[]) {
  for (const href of hrefs) {
    if (!href || document.querySelector(`link[href="${CSS.escape(href)}"]`)) continue
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    document.head.appendChild(link)
  }
}

/** Radio list of themes with live swatches. Arrow keys move between themes. */
function ThemeOptions({ compact = false }: { compact?: boolean }) {
  const { theme, themes, setTheme } = useTheme()
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return
    e.preventDefault()
    const index = themes.findIndex((t) => t.key === theme.key)
    const step = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1
    const next = themes[(index + step + themes.length) % themes.length]
    setTheme(next.key)
    refs.current[themes.indexOf(next)]?.focus()
  }

  return (
    <div role="radiogroup" aria-label="Store theme" className={compact ? 'grid grid-cols-2 gap-2' : 'grid gap-2'} onKeyDown={onKey}>
      {themes.map((t, i) => {
        const checked = t.key === theme.key
        return (
          <button
            key={t.key}
            ref={(el) => {
              refs.current[i] = el
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            className={`theme-option ${compact ? 'is-compact' : ''}`}
            onClick={() => setTheme(t.key)}
            style={
              {
                '--t-bg': t.colors.night,
                '--t-surface': t.colors.surface,
                '--t-fg': t.colors.bone,
                '--t-accent': t.colors.gold,
                '--t-line': t.colors.line,
                '--t-radius': t.radius === '999px' ? '999px' : t.cardRadius,
              } as CSSProperties
            }
          >
            <span className="theme-swatch" aria-hidden="true">
              <span style={{ fontFamily: t.fonts.display, fontWeight: t.fonts.displayWeight }}>Aa</span>
              <i />
            </span>
            <span className="grid min-w-0 text-left">
              <span className="truncate text-sm font-medium">{t.name}</span>
              {!compact && <span className="text-xs leading-snug text-muted">{t.mood}</span>}
            </span>
          </button>
        )
      })}
    </div>
  )
}

/** Theme choices laid out inline, for the mobile menu. */
export function ThemeOptionsInline() {
  if (!STORE.features.themePicker) return null
  return (
    <div className="grid gap-3">
      <p className="eyebrow">Store theme</p>
      <ThemeOptions compact />
    </div>
  )
}

/** Floating theme button (desktop) with a panel of every theme. */
export function ThemePicker() {
  const { theme, themes } = useTheme()
  const notify = useToast()
  const [open, setOpen] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)
  const button = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    preloadThemeFonts(themes.map((t) => t.fonts.href))
    wrap.current?.querySelector<HTMLButtonElement>('[role="radio"][aria-checked="true"]')?.focus()
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        button.current?.focus()
      }
    }
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [open, themes])

  if (!STORE.features.themePicker) return null

  const copyTokens = async () => {
    try {
      await navigator.clipboard.writeText(themeCss(theme))
      notify(`${theme.name} tokens copied as CSS.`)
    } catch {
      notify('Copying isn’t allowed in this browser.')
    }
  }

  return (
    <div ref={wrap} className="theme-picker">
      <AnimatePresence>
        {open && (
          <motion.div
            id="theme-panel"
            role="dialog"
            aria-label="Choose a store theme"
            className="theme-panel"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="grid gap-1">
                <p className="h-label">Store theme</p>
                <p className="text-xs text-muted">Six complete looks for the same store. Your pick is saved in this browser.</p>
              </div>
              <button type="button" className="icon-btn -mr-2 -mt-2 shrink-0" aria-label="Close themes" onClick={() => setOpen(false)}>
                <IconClose />
              </button>
            </div>
            <ThemeOptions />
            <button type="button" className="u micro justify-self-start text-bone" onClick={copyTokens}>
              Copy {theme.name} as CSS tokens
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        ref={button}
        type="button"
        className="theme-fab"
        aria-expanded={open}
        aria-controls="theme-panel"
        onClick={() => setOpen((v) => !v)}
      >
        <IconPalette className="h-[18px] w-[18px]" />
        <span>Theme</span>
        <span className="theme-fab-dots" aria-hidden="true">
          <i style={{ background: theme.colors.gold }} />
          <i style={{ background: theme.colors.bone }} />
          <i style={{ background: theme.colors.surface }} />
        </span>
      </button>
    </div>
  )
}
