import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

type ToastAction = { label: string; to: string }
type Toast = { id: number; message: string; action?: ToastAction }
type Notify = (message: string, action?: ToastAction) => void

const ToastContext = createContext<Notify>(() => undefined)

/** Short confirmations ("Saved to wishlist") in a polite live region, bottom centre. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const seq = useRef(0)
  const timers = useRef(new Map<number, number>())

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id))
    window.clearTimeout(timers.current.get(id))
    timers.current.delete(id)
  }, [])

  const notify = useCallback<Notify>(
    (message, action) => {
      const id = ++seq.current
      setToasts((list) => [...list.slice(-2), { id, message, action }])
      timers.current.set(id, window.setTimeout(() => dismiss(id), 4200))
    },
    [dismiss],
  )

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach((t) => window.clearTimeout(t))
  }, [])

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div className="toast-region" role="status" aria-live="polite">
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
              className="toast"
            >
              <span>{t.message}</span>
              {t.action && (
                <Link to={t.action.to} className="u micro text-gold" onClick={() => dismiss(t.id)}>
                  {t.action.label}
                </Link>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
