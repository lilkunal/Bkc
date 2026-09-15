// Spotlight, BorderTrail, TextShimmer, ScrollProgress and ProgressiveBlur,
// adapted from motion-primitives (MIT, © 2024 ibelick). See ./README.md.
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'

/** Soft accent glow that follows the mouse over its parent (which should be `relative overflow-hidden`). */
export function Spotlight({ size = 240, className = '' }: { size?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [on, setOn] = useState(false)
  const mouseX = useSpring(0, { bounce: 0 })
  const mouseY = useSpring(0, { bounce: 0 })
  const left = useTransform(mouseX, (v) => `${v - size / 2}px`)
  const top = useTransform(mouseY, (v) => `${v - size / 2}px`)

  useEffect(() => {
    const parent = ref.current?.parentElement
    if (!parent) return
    const ac = new AbortController()
    const { signal } = ac
    parent.addEventListener(
      'pointermove',
      (e) => {
        if (e.pointerType !== 'mouse') return
        const r = parent.getBoundingClientRect()
        mouseX.set(e.clientX - r.left)
        mouseY.set(e.clientY - r.top)
      },
      { signal },
    )
    parent.addEventListener('pointerenter', (e) => e.pointerType === 'mouse' && setOn(true), { signal })
    parent.addEventListener('pointerleave', () => setOn(false), { signal })
    return () => ac.abort()
  }, [mouseX, mouseY])

  return <motion.span ref={ref} aria-hidden="true" className={`spotlight ${on ? 'opacity-100' : 'opacity-0'} ${className}`} style={{ width: size, height: size, left, top }} />
}

/** A point of light running around the border of its parent (which should be `relative`). */
export function BorderTrail({ size = 70, duration = 5, className = '' }: { size?: number; duration?: number; className?: string }) {
  const reduced = useReducedMotion()
  if (reduced) return null
  return (
    <span aria-hidden="true" className="border-trail">
      <motion.span
        className={`border-trail-dot ${className}`}
        style={{ width: size, offsetPath: `rect(0 auto auto 0 round ${size}px)` }}
        animate={{ offsetDistance: ['0%', '100%'] }}
        transition={{ repeat: Infinity, duration, ease: 'linear' }}
      />
    </span>
  )
}

/** Text with a band of light sweeping across it. */
export function TextShimmer({ children, duration = 2.2, spread = 2, className = '' }: { children: string; duration?: number; spread?: number; className?: string }) {
  const reduced = useReducedMotion()
  return (
    <motion.span
      className={`text-shimmer ${className}`}
      initial={{ backgroundPosition: '100% center' }}
      animate={reduced ? undefined : { backgroundPosition: '0% center' }}
      transition={{ repeat: Infinity, duration, ease: 'linear' }}
      style={{ '--spread': `${children.length * spread}px` } as CSSProperties}
    >
      {children}
    </motion.span>
  )
}

/** Thin accent bar across the top of the viewport showing how far the page has been read. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 50, restDelta: 0.001 })
  return <motion.div aria-hidden="true" className="scroll-progress" style={{ scaleX }} />
}

const ANGLES = { top: 0, right: 90, bottom: 180, left: 270 }

/** Blur that strengthens towards one edge, for captions over imagery. */
export function ProgressiveBlur({
  direction = 'bottom',
  layers = 8,
  intensity = 0.3,
  className = '',
  children,
}: {
  direction?: keyof typeof ANGLES
  layers?: number
  intensity?: number
  className?: string
  children?: ReactNode
}) {
  const count = Math.max(layers, 2)
  const segment = 1 / (count + 1)
  return (
    <div className={`relative ${className}`}>
      {Array.from({ length: count }, (_, index) => {
        const stops = [index, index + 1, index + 2, index + 3].map(
          (pos, i) => `rgba(255, 255, 255, ${i === 1 || i === 2 ? 1 : 0}) ${pos * segment * 100}%`,
        )
        const gradient = `linear-gradient(${ANGLES[direction]}deg, ${stops.join(', ')})`
        return (
          <div
            key={index}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{
              maskImage: gradient,
              WebkitMaskImage: gradient,
              backdropFilter: `blur(${index * intensity}px)`,
              WebkitBackdropFilter: `blur(${index * intensity}px)`,
            }}
          />
        )
      })}
      {children && <div className="relative">{children}</div>}
    </div>
  )
}
