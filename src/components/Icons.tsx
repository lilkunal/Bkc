type IconProps = { className?: string }

const stroke = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'aria-hidden': true,
  focusable: false,
} as const

export function IconSearch({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg className={className} {...stroke} strokeWidth={1.4}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  )
}

export function IconBag({ className = 'h-[21px] w-[21px]' }: IconProps) {
  return (
    <svg className={className} {...stroke} strokeWidth={1.4}>
      <path d="M5.5 8.5h13l-1 12h-11z" />
      <path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" />
    </svg>
  )
}

export function IconMenu({ className = 'h-[22px] w-[22px]' }: IconProps) {
  return (
    <svg className={className} {...stroke} strokeWidth={1.4}>
      <path d="M3 7h18M3 12h18M3 17h18" />
    </svg>
  )
}

export function IconClose({ className = 'h-[18px] w-[18px]' }: IconProps) {
  return (
    <svg className={className} {...stroke} strokeWidth={1.4}>
      <path d="m5 5 14 14M19 5 5 19" />
    </svg>
  )
}

export function IconLayers({ className = 'h-[30px] w-[30px]' }: IconProps) {
  return (
    <svg className={className} {...stroke} strokeWidth={1.2}>
      <path d="M12 3 3 7.5 12 12l9-4.5z" />
      <path d="m3 12 9 4.5 9-4.5" />
      <path d="m3 16.5 9 4.5 9-4.5" />
    </svg>
  )
}

export function IconDrop({ className = 'h-[30px] w-[30px]' }: IconProps) {
  return (
    <svg className={className} {...stroke} strokeWidth={1.2}>
      <path d="M12 3.5s6 6.4 6 10.5a6 6 0 0 1-12 0c0-4.1 6-10.5 6-10.5z" />
    </svg>
  )
}

export function IconTruck({ className = 'h-[30px] w-[30px]' }: IconProps) {
  return (
    <svg className={className} {...stroke} strokeWidth={1.2}>
      <path d="M2.5 6.5h11v9h-11z" />
      <path d="M13.5 9.5h4l3 3v3h-7z" />
      <circle cx="7" cy="17.5" r="1.6" />
      <circle cx="17" cy="17.5" r="1.6" />
    </svg>
  )
}

export function IconLock({ className = 'h-[30px] w-[30px]' }: IconProps) {
  return (
    <svg className={className} {...stroke} strokeWidth={1.2}>
      <rect x="5" y="10.5" width="14" height="10" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
    </svg>
  )
}

export function IconHeart({ className = 'h-5 w-5', filled = false }: IconProps & { filled?: boolean }) {
  return (
    <svg className={className} {...stroke} fill={filled ? 'currentColor' : 'none'} strokeWidth={1.4}>
      <path d="M12 19.5s-7.2-4.4-8.8-8.7C2.2 8 4 4.8 7.2 4.8c1.9 0 3.3 1 4.8 2.9 1.5-1.9 2.9-2.9 4.8-2.9 3.2 0 5 3.2 4 6-1.6 4.3-8.8 8.7-8.8 8.7z" />
    </svg>
  )
}

export function IconEye({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg className={className} {...stroke} strokeWidth={1.4}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="2.8" />
    </svg>
  )
}

export function IconArrowUp({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg className={className} {...stroke} strokeWidth={1.4}>
      <path d="M12 19V5M6 11l6-6 6 6" />
    </svg>
  )
}

export function IconChevron({ className = 'h-5 w-5', dir = 'right' }: IconProps & { dir?: 'left' | 'right' | 'down' }) {
  const d = { left: 'm15 5-7 7 7 7', right: 'm9 5 7 7-7 7', down: 'm5 9 7 7 7-7' }[dir]
  return (
    <svg className={className} {...stroke} strokeWidth={1.4}>
      <path d={d} />
    </svg>
  )
}

export function IconExpand({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg className={className} {...stroke} strokeWidth={1.4}>
      <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
    </svg>
  )
}

export function IconUser({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg className={className} {...stroke} strokeWidth={1.4}>
      <circle cx="12" cy="8.5" r="3.8" />
      <path d="M4.5 20.5c1.2-3.7 4-5.6 7.5-5.6s6.3 1.9 7.5 5.6" />
    </svg>
  )
}

export function IconShare({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg className={className} {...stroke} strokeWidth={1.4}>
      <path d="M12 3.5v12M7.5 8 12 3.5 16.5 8" />
      <path d="M5 12.5v7h14v-7" />
    </svg>
  )
}

export function IconPalette({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg className={className} {...stroke} strokeWidth={1.4}>
      <path d="M12 3.5a8.5 8.5 0 1 0 0 17c1.3 0 1.9-.9 1.6-2-.4-1.3.5-2.5 1.9-2.5h1.6a3.4 3.4 0 0 0 3.4-3.4C20.5 7.2 16.7 3.5 12 3.5z" />
      <circle cx="7.8" cy="11" r="1" />
      <circle cx="10.5" cy="7.4" r="1" />
      <circle cx="14.8" cy="7.6" r="1" />
    </svg>
  )
}

export function IconStar({ className = 'h-3.5 w-3.5', filled = true }: IconProps & { filled?: boolean }) {
  return (
    <svg className={className} {...stroke} fill={filled ? 'currentColor' : 'none'} strokeWidth={1.2}>
      <path d="m12 3.5 2.6 5.5 5.9.6-4.5 4 1.3 5.9-5.3-3-5.3 3 1.3-5.9-4.5-4 5.9-.6z" />
    </svg>
  )
}
