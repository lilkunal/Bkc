import { useCallback, useEffect, useRef, useState } from 'react'

/** Callback ref plus the element's current size, kept up to date with a ResizeObserver. */
export function useMeasure<T extends HTMLElement>(): [(node: T | null) => void, { width: number; height: number }] {
  const [size, setSize] = useState({ width: 0, height: 0 })
  const observer = useRef<ResizeObserver | null>(null)

  const ref = useCallback((node: T | null) => {
    observer.current?.disconnect()
    observer.current = null
    if (!node) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.target.getBoundingClientRect()
      setSize((s) => (s.width === width && s.height === height ? s : { width, height }))
    })
    ro.observe(node)
    observer.current = ro
  }, [])

  useEffect(() => () => observer.current?.disconnect(), [])

  return [ref, size]
}
