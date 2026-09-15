import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

type WishlistValue = {
  ids: string[]
  count: number
  has: (id: string) => boolean
  toggle: (id: string) => void
  remove: (id: string) => void
  clear: () => void
}

const STORAGE_KEY = 'bkc_wishlist_v1'
const WishlistContext = createContext<WishlistValue | null>(null)

function load(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === 'string') : []
  } catch {
    return []
  }
}

/** Saved products, kept in this browser only. */
export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(() => (typeof window === 'undefined' ? [] : load()))

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
    } catch {
      // Private mode or storage blocked: the list still works for this visit.
    }
  }, [ids])

  const toggle = useCallback((id: string) => {
    setIds((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [id, ...prev]))
  }, [])
  const remove = useCallback((id: string) => setIds((prev) => prev.filter((v) => v !== id)), [])
  const clear = useCallback(() => setIds([]), [])

  const value = useMemo(
    () => ({ ids, count: ids.length, has: (id: string) => ids.includes(id), toggle, remove, clear }),
    [ids, toggle, remove, clear],
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
