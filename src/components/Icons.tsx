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
