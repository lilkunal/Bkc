import { useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CATEGORIES, filterProducts, type Product } from '../data/catalog'
import { money } from '../lib/format'
import { useDialog } from '../lib/useDialog'
import { STORE } from '../store.config'
import { GarmentImage } from './GarmentImage'
import { IconClose, IconSearch } from './Icons'

type Option = { key: string; label: string; to: string; hint?: string; product?: Product }

const RECENT_KEY = `${STORE.name.toLowerCase()}_searches`
const POPULAR = ['chai', 'oversized', 'punjab', 'shirt', 'monogram', 'animals']

function recentSearches(): string[] {
  try {
    const list = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]')
    return Array.isArray(list) ? list.filter((v): v is string => typeof v === 'string').slice(0, 5) : []
  } catch {
    return []
  }
}

function rememberSearch(term: string) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify([term, ...recentSearches().filter((t) => t !== term)].slice(0, 5)))
  } catch {
    // Storage blocked.
  }
}

/** Predictive search: products, categories and a full-results link as you type; recent and popular searches before. */
export function SearchDialog({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useDialog(true, ref, onClose)
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const q = query.trim()

  const options = useMemo<Option[]>(() => {
    if (!q) {
      const recent = recentSearches()
      return [
        ...recent.map((t): Option => ({ key: `recent-${t}`, label: t, hint: 'Recent', to: `/shop?q=${encodeURIComponent(t)}` })),
        ...POPULAR.filter((t) => !recent.includes(t)).map((t): Option => ({ key: `popular-${t}`, label: t, hint: 'Popular', to: `/shop?q=${encodeURIComponent(t)}` })),
      ]
    }
    const lower = q.toLowerCase()
    const products = filterProducts({ q }).slice(0, 6)
    const categories = CATEGORIES.filter((c) => c.label.toLowerCase().includes(lower)).slice(0, 3)
    return [
      ...products.map((p): Option => ({ key: p.id, label: p.name, to: `/product/${p.id}`, product: p })),
      ...categories.map((c): Option => ({ key: `cat-${c.key}`, label: c.label, hint: 'Category', to: `/shop?cat=${c.key}` })),
      { key: 'all', label: `See all results for “${q}”`, to: `/shop?q=${encodeURIComponent(q)}` },
    ]
  }, [q])

  const go = (option: Option | undefined) => {
    if (!option) return
    if (q) rememberSearch(q)
    else if (option.hint) rememberSearch(option.label)
    onClose()
    navigate(option.to)
  }

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!options.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => (i + 1) % options.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => (i - 1 + options.length) % options.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      go(options[active])
    }
  }

  const productCount = options.filter((o) => o.product).length

  return createPortal(
    <div className="fixed inset-0 z-[85] grid items-start justify-items-center p-3 pt-[min(12vh,120px)] sm:p-6 sm:pt-[min(14vh,140px)]">
      <button type="button" tabIndex={-1} aria-label="Close search" className="absolute inset-0 bg-night/80 backdrop-blur-[3px]" onClick={onClose} />
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className="search-panel"
        initial={{ opacity: 0, y: -10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <IconSearch className="h-5 w-5 shrink-0 text-muted" />
          <input
            data-autofocus
            type="search"
            role="combobox"
            aria-label="Search the catalogue"
            aria-expanded={options.length > 0}
            aria-controls="search-options"
            aria-autocomplete="list"
            aria-activedescendant={options[active] ? `search-option-${active}` : undefined}
            className="search-input"
            placeholder="Search designs, colours, states…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActive(0)
            }}
            onKeyDown={onKey}
          />
          <button type="button" className="icon-btn -mr-2 shrink-0" aria-label="Close search" onClick={onClose}>
            <IconClose />
          </button>
        </div>

        <p className="micro px-4 pt-4" aria-live="polite">
          {q ? `${productCount} design${productCount === 1 ? '' : 's'} match` : 'Recent and popular'}
        </p>
        <ul id="search-options" role="listbox" aria-label="Suggestions" className="grid max-h-[60vh] overflow-y-auto p-2">
          <AnimatePresence initial={false}>
            {options.map((o, i) => (
              <motion.li
                key={o.key}
                id={`search-option-${i}`}
                role="option"
                aria-selected={i === active}
                className="search-option"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(i * 0.02, 0.12) }}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(o)}
              >
                {o.product ? (
                  <span className="spot block w-11 shrink-0 p-0.5">
                    <GarmentImage product={o.product} detail="flat" alt="" />
                  </span>
                ) : (
                  <IconSearch className="h-4 w-4 shrink-0 text-muted" />
                )}
                <span className="min-w-0 flex-1 truncate">{o.label}</span>
                {o.product ? <span className="text-sm tabular-nums text-muted">{money(o.product.price)}</span> : o.hint && <span className="micro">{o.hint}</span>}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        <p className="hidden border-t border-line px-4 py-3 text-xs text-muted sm:block">
          <kbd className="kbd">↑</kbd> <kbd className="kbd">↓</kbd> to move · <kbd className="kbd">Enter</kbd> to open · <kbd className="kbd">Esc</kbd> to close
        </p>
      </motion.div>
    </div>,
    document.body,
  )
}
