import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useReducedMotion } from '../lib/useMediaQuery'
import { cssColor, mixHex } from '../themes'
import type { SceneHandle } from '../three/types'

/**
 * Three.js silk-and-dust backdrop for the home hero, lit in the current theme's colours. three.js loads as its
 * own chunk after the page; without WebGL nothing renders and the CSS glow behind the garment stays.
 */
export function HeroBackdrop({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()
  const { theme } = useTheme()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let handle: SceneHandle | null = null
    let cancelled = false
    let visible = false
    const sync = () => handle?.setActive(visible && document.visibilityState === 'visible')
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync()
    })
    io.observe(canvas)
    document.addEventListener('visibilitychange', sync)

    import('../three/heroScene')
      .then(({ createHeroBackdrop }) => {
        if (cancelled) return
        const gold = cssColor('gold')
        handle = createHeroBackdrop(canvas, {
          reducedMotion: reduced,
          colors: { base: mixHex(cssColor('surface'), gold, 0.14), sheen: cssColor('goldHi'), rim: gold, dust: cssColor('goldHi') },
          onReady: () => setReady(true),
        })
        sync()
      })
      .catch(() => undefined)

    return () => {
      cancelled = true
      io.disconnect()
      document.removeEventListener('visibilitychange', sync)
      handle?.dispose()
    }
  }, [reduced, theme.key])

  return (
    <canvas
      // A disposed WebGL canvas can't be reused, so a motion or theme change gets a fresh element.
      key={`${reduced ? 'still' : 'moving'}-${theme.key}`}
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none transition-opacity duration-[1400ms] ease-lux ${ready ? 'opacity-100' : 'opacity-0'} ${className}`}
    />
  )
}
