// Adapted from motion-primitives (MIT, © 2024 ibelick). See ./README.md.
import { useRef, type ReactNode } from 'react'
import { motion, useInView, type Transition, type Variant } from 'framer-motion'

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

/** Animates its content in once it scrolls into view. */
export function InView({
  children,
  variants = FADE_UP,
  transition = { duration: 0.7, ease: [0.2, 0.7, 0.2, 1] },
  once = true,
  className,
}: {
  children: ReactNode
  variants?: { hidden: Variant; visible: Variant }
  transition?: Transition
  once?: boolean
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once, margin: '0px 0px -10% 0px' })
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={variants} transition={transition} className={className}>
      {children}
    </motion.div>
  )
}
