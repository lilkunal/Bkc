// AnimatedNumber and SlidingNumber, adapted from motion-primitives (MIT, © 2024 ibelick). See ./README.md.
import { useEffect } from 'react'
import { motion, useReducedMotion, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { useMeasure } from '../../lib/useMeasure'

/** A number that springs to its new value, e.g. a total after a quantity change. */
export function AnimatedNumber({
  value,
  format = (n: number) => Math.round(n).toLocaleString(),
  className = '',
}: {
  value: number
  format?: (n: number) => string
  className?: string
}) {
  const reduced = useReducedMotion()
  const spring = useSpring(value, { stiffness: 140, damping: 24, mass: 0.6 })
  const display = useTransform(spring, (v) => format(v))

  useEffect(() => {
    if (reduced) spring.jump(value)
    else spring.set(value)
  }, [spring, value, reduced])

  return <motion.span className={`tabular-nums ${className}`}>{display}</motion.span>
}

const DIGIT_SPRING = { stiffness: 280, damping: 18, mass: 0.3 }

function Numeral({ mv, n }: { mv: MotionValue<number>; n: number }) {
  const [ref, { height }] = useMeasure<HTMLSpanElement>()
  const y = useTransform(mv, (latest) => {
    if (!height) return 0
    const offset = (10 + n - (latest % 10)) % 10
    let shift = offset * height
    if (offset > 5) shift -= 10 * height
    return shift
  })

  if (!height) {
    return (
      <span ref={ref} className="invisible absolute">
        {n}
      </span>
    )
  }
  return (
    <motion.span ref={ref} style={{ y }} className="absolute inset-0 flex items-center justify-center">
      {n}
    </motion.span>
  )
}

function Digit({ value, place }: { value: number; place: number }) {
  const digit = Math.floor(value / place) % 10
  const animated = useSpring(digit, DIGIT_SPRING)
  useEffect(() => {
    animated.set(digit)
  }, [animated, digit])

  return (
    <span className="relative inline-block w-[1ch] overflow-y-clip leading-none tabular-nums">
      <span className="invisible">0</span>
      {Array.from({ length: 10 }, (_, i) => (
        <Numeral key={i} mv={animated} n={i} />
      ))}
    </span>
  )
}

/** A whole number whose digits roll like an odometer. */
export function SlidingNumber({ value, className = '' }: { value: number; className?: string }) {
  const reduced = useReducedMotion()
  const whole = Math.max(0, Math.floor(value))
  if (reduced) return <span className={`tabular-nums ${className}`}>{whole}</span>
  const digits = String(whole).split('')
  return (
    <span className={`inline-flex items-center ${className}`}>
      <span className="sr-only">{whole}</span>
      <span aria-hidden="true" className="inline-flex">
        {digits.map((_, i) => (
          <Digit key={digits.length - i} value={whole} place={10 ** (digits.length - i - 1)} />
        ))}
      </span>
    </span>
  )
}
