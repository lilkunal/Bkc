// Adapted from motion-primitives (MIT, © 2024 ibelick). See ./README.md.
import { useEffect, useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

const SPRING = { stiffness: 26.7, damping: 4.1, mass: 0.2 }

/** Pulls its child a little towards the mouse while hovered. Mouse only; still for reduced motion. */
export function Magnetic({
  children,
  intensity = 0.35,
  range = 110,
  className = 'inline-block',
}: {
  children: ReactNode
  intensity?: number
  range?: number
  className?: string
}) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, SPRING)
  const springY = useSpring(y, SPRING)

  useEffect(() => {
    const el = ref.current
    if (reduced || !el) return
    let hovered = false
    const reset = () => {
      x.set(0)
      y.set(0)
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      const distance = Math.hypot(dx, dy)
      if (hovered && distance <= range) {
        const k = 1 - distance / range
        x.set(dx * intensity * k)
        y.set(dy * intensity * k)
      } else reset()
    }
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') hovered = true
    }
    const onLeave = () => {
      hovered = false
      reset()
    }
    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointerleave', onLeave)
    document.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      el.removeEventListener('pointerenter', onEnter)
      el.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('pointermove', onMove)
    }
  }, [reduced, intensity, range, x, y])

  return (
    <motion.span ref={ref} className={className} style={reduced ? undefined : { x: springX, y: springY }}>
      {children}
    </motion.span>
  )
}
