// InfiniteSlider, AnimatedBackground and TransitionPanel, adapted from motion-primitives (MIT, © 2024 ibelick). See ./README.md.
import { Children, cloneElement, useEffect, useId, useState, type ReactElement, type ReactNode } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, type Transition, type Variant } from 'framer-motion'
import { useMeasure } from '../../lib/useMeasure'

/**
 * An endless horizontal row. `children(copy)` is called twice; the second call (copy = true) is hidden
 * from assistive tech and keyboard. Slows on hover, stops when paused, and becomes a plain scroller for reduced motion.
 */
export function InfiniteSlider({
  children,
  gap = 16,
  speed = 50,
  speedOnHover,
  reverse = false,
  paused = false,
  className = '',
}: {
  children: (copy: boolean) => ReactNode
  gap?: number
  /** Pixels per second. */
  speed?: number
  speedOnHover?: number
  reverse?: boolean
  paused?: boolean
  className?: string
}) {
  const reduced = useReducedMotion()
  const [ref, { width }] = useMeasure<HTMLDivElement>()
  const x = useMotionValue(0)
  const [hovering, setHovering] = useState(false)
  const current = hovering && speedOnHover !== undefined ? speedOnHover : speed

  useEffect(() => {
    if (reduced || paused || !width || current <= 0) return
    const half = (width + gap) / 2
    const from = reverse ? -half : 0
    const to = reverse ? 0 : -half
    const now = x.get()
    const start = now <= 0 && now >= -half ? now : from
    let loop: ReturnType<typeof animate> | undefined
    // Carry on from where the row is, so speed changes never jump.
    const first = animate(x, [start, to], {
      ease: 'linear',
      duration: Math.abs(to - start) / current,
      onComplete: () => {
        loop = animate(x, [from, to], { ease: 'linear', duration: half / current, repeat: Infinity, repeatType: 'loop' })
      },
    })
    return () => {
      first.stop()
      loop?.stop()
    }
  }, [x, width, gap, current, reverse, reduced, paused])

  if (reduced) {
    return (
      <div className={`overflow-x-auto ${className}`}>
        <div className="flex w-max" style={{ gap }}>
          {children(false)}
        </div>
      </div>
    )
  }

  return (
    <div className={`overflow-hidden ${className}`} onPointerEnter={() => setHovering(true)} onPointerLeave={() => setHovering(false)}>
      <motion.div ref={ref} className="flex w-max" style={{ x, gap }}>
        {children(false)}
        {children(true)}
      </motion.div>
    </div>
  )
}

type ItemProps = {
  'data-id': string
  className?: string
  children?: ReactNode
  'data-checked'?: string
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

/** A highlight that slides between its children: the one matching `value`, or the hovered one with `enableHover`. */
export function AnimatedBackground({
  children,
  value,
  enableHover = false,
  className = '',
  transition = { type: 'spring', bounce: 0.18, duration: 0.45 },
}: {
  children: ReactElement<ItemProps> | ReactElement<ItemProps>[]
  value?: string | null
  enableHover?: boolean
  className?: string
  transition?: Transition
}) {
  const [hovered, setHovered] = useState<string | null>(null)
  const layoutId = `bg-${useId()}`
  const active = enableHover ? (hovered ?? value ?? null) : (value ?? null)

  return (
    <>
      {Children.map(children, (child) => {
        const key = child.props['data-id']
        return cloneElement(
          child,
          {
            className: `relative ${child.props.className ?? ''}`,
            'data-checked': active === key ? 'true' : 'false',
            ...(enableHover ? { onMouseEnter: () => setHovered(key), onMouseLeave: () => setHovered(null) } : {}),
          },
          <>
            <AnimatePresence initial={false}>
              {active === key && (
                <motion.span
                  layoutId={layoutId}
                  aria-hidden="true"
                  className={`absolute inset-0 ${className}`}
                  transition={transition}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>
            <span className="relative z-10 inline-flex items-center gap-2">{child.props.children}</span>
          </>,
        )
      })}
    </>
  )
}

/** Shows one child at a time, animating between them. */
export function TransitionPanel({
  children,
  activeIndex,
  className = '',
  variants,
  transition,
  custom,
}: {
  children: ReactNode[]
  activeIndex: number
  className?: string
  variants?: { enter: Variant; center: Variant; exit: Variant }
  transition?: Transition
  custom?: unknown
}) {
  return (
    <div className={`relative ${className}`}>
      <AnimatePresence initial={false} mode="popLayout" custom={custom}>
        <motion.div key={activeIndex} custom={custom} variants={variants} transition={transition} initial="enter" animate="center" exit="exit">
          {children[activeIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
