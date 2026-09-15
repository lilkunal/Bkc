import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type CartItem = {
  key: string
  id: string
  name: string
  /** Garment type from the product sheet (tee, shirt…). */
  type?: string
  /** Product photo, when the sheet has one. */
  image?: string
  size: string
  color: string
  fit: string
  price: number
  qty: number
  teeHex: string
  printHex: string
  printLines: string[]
  glyph: string
  font: string
  backdrop?: string
  backdropHex?: string
  addedAt: string
}

type CartContextValue = {
  items: CartItem[]
  count: number
  total: number
  open: boolean
  setOpen: (v: boolean) => void
  addItem: (item: Omit<CartItem, 'key' | 'qty' | 'addedAt'> & { qty?: number }, options?: { openBag?: boolean }) => void
  removeItem: (key: string) => void
  setQty: (key: string, qty: number) => void
  clear: () => void
  /** Coupon code entered in the bag or at checkout. */
  coupon: string | null
  setCoupon: (code: string | null) => void
}

const STORAGE_KEY = 'bkc_cart_v1'
const COUPON_KEY = 'bkc_coupon'
const CartContext = createContext<CartContextValue | null>(null)

function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function loadCoupon(): string | null {
  try {
    return localStorage.getItem(COUPON_KEY)
  } catch {
    return null
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() =>
    typeof window === 'undefined' ? [] : load(),
  )
  const [coupon, setCoupon] = useState<string | null>(() => (typeof window === 'undefined' ? null : loadCoupon()))
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // Storage blocked: the bag still works for this visit.
    }
  }, [items])

  useEffect(() => {
    try {
      if (coupon) localStorage.setItem(COUPON_KEY, coupon)
      else localStorage.removeItem(COUPON_KEY)
    } catch {
      // Storage blocked.
    }
  }, [coupon])

  const addItem = useCallback(
    (item: Omit<CartItem, 'key' | 'qty' | 'addedAt'> & { qty?: number }, options: { openBag?: boolean } = {}) => {
      const key = `${item.id}|${item.size}|${item.color}|${item.fit}`
      setItems((prev) => {
        const existing = prev.find((p) => p.key === key)
        if (existing) {
          return prev.map((p) =>
            p.key === key ? { ...p, qty: p.qty + (item.qty ?? 1) } : p,
          )
        }
        return [
          ...prev,
          {
            ...item,
            key,
            qty: item.qty ?? 1,
            addedAt: new Date().toISOString(),
          },
        ]
      })
      if (options.openBag !== false) setOpen(true)
    },
    [],
  )

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((p) => p.key !== key))
  }, [])

  const setQty = useCallback((key: string, qty: number) => {
    setItems((prev) =>
      prev
        .map((p) => (p.key === key ? { ...p, qty } : p))
        .filter((p) => p.qty > 0),
    )
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      total: items.reduce((n, i) => n + i.price * i.qty, 0),
      open,
      setOpen,
      addItem,
      removeItem,
      setQty,
      clear,
      coupon,
      setCoupon,
    }),
    [items, open, addItem, removeItem, setQty, clear, coupon],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
