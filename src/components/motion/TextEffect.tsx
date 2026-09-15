// Adapted from motion-primitives (MIT, © 2024 ibelick). See ./README.md.
import { memo, useRef, type CSSProperties, type JSX } from 'react'
import { motion, useInView, type TargetAndTransition, type Variants } from 'framer-motion'

export type PresetType = 'blur' | 'fade-in-blur' | 'scale' | 'fade' | 'slide'
export type PerType = 'word' | 'char' | 'line'

type Props = {
  children: string
  per?: PerType
  as?: keyof JSX.IntrinsicElements
  preset?: PresetType
  delay?: number
  speedReveal?: number
  speedSegment?: number
  /** Wait until the text scrolls into view (once). Otherwise it animates on mount. */
  inView?: boolean
  className?: string
  segmentClassName?: string
  style?: CSSProperties
  id?: string
}

const STAGGER: Record<PerType, number> = { char: 0.03, word: 0.05, line: 0.1 }

const PRESETS: Record<PresetType, { hidden: TargetAndTransition; visible: TargetAndTransition }> = {
  blur: { hidden: { opacity: 0, filter: 'blur(12px)' }, visible: { opacity: 1, filter: 'blur(0px)' } },
  'fade-in-blur': { hidden: { opacity: 0, y: 20, filter: 'blur(12px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)' } },
  scale: { hidden: { opacity: 0, scale: 0 }, visible: { opacity: 1, scale: 1 } },
  fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  slide: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } },
}

const Segment = memo(function Segment({ segment, variants, per, className = '' }: { segment: string; variants: Variants; per: PerType; className?: string }) {
  if (per === 'line') {
    return (
      <motion.span variants={variants} className={`block ${className}`}>
        {segment}
      </motion.span>
    )
  }
  if (per === 'word') {
    return (
      <motion.span aria-hidden="true" variants={variants} className={`inline-block whitespace-pre ${className}`}>
        {segment}
      </motion.span>
    )
  }
  return (
    <span className={`inline-block whitespace-pre ${className}`}>
      {segment.split('').map((char, i) => (
        <motion.span key={i} aria-hidden="true" variants={variants} className="inline-block whitespace-pre">
          {char}
        </motion.span>
      ))}
    </span>
  )
})

/** Text that reveals by word, character or line. The full text stays in the page for screen readers. */
export function TextEffect({
  children,
  per = 'word',
  as = 'p',
  preset = 'fade',
  delay = 0,
  speedReveal = 1,
  speedSegment = 1,
  inView = false,
  className,
  segmentClassName,
  style,
  id,
}: Props) {
  const ref = useRef<HTMLElement>(null)
  const seen = useInView(ref, { once: true, margin: '0px 0px -8% 0px' })
  const active = !inView || seen
  const segments = per === 'line' ? children.split('\n') : children.split(/(\s+)/)
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: STAGGER[per] / speedReveal, delayChildren: delay } },
  }
  const item: Variants = {
    hidden: PRESETS[preset].hidden,
    visible: { ...PRESETS[preset].visible, transition: { duration: 0.35 / speedSegment } },
  }

  return (
    <MotionTag
      ref={ref as never}
      id={id}
      initial="hidden"
      animate={active ? 'visible' : 'hidden'}
      variants={container}
      className={className}
      style={style}
    >
      {per !== 'line' && <span className="sr-only">{children}</span>}
      {segments.map((segment, i) => (
        <Segment key={`${i}-${segment}`} segment={segment} variants={item} per={per} className={segmentClassName} />
      ))}
    </MotionTag>
  )
}
