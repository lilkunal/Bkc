/** चू seal + BKC wordmark. Signature rule 1 in DESIGN.md: never below 32px. */

export function Seal({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <circle cx="32" cy="32" r="30.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="32" cy="32" r="27.5" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.45" />
      <text
        x="32"
        y="44"
        textAnchor="middle"
        fontFamily="'Rozha One', 'Nirmala UI', Mangal, serif"
        fontSize="33"
        fill="currentColor"
      >
        चू
      </text>
    </svg>
  )
}

export function Wordmark({
  tagline = true,
  align = 'center',
}: {
  tagline?: boolean
  align?: 'center' | 'start'
}) {
  const center = align === 'center'
  return (
    <span className={`grid gap-1 text-gold ${center ? 'justify-items-center' : 'justify-items-start'}`}>
      <Seal className="h-[46px] w-[46px]" />
      <span
        className="font-display text-[1.75rem] font-semibold leading-none tracking-[0.34em]"
        style={center ? { marginRight: '-0.34em' } : undefined}
      >
        BKC
      </span>
      {tagline && (
        <span className="whitespace-nowrap text-[0.5625rem] font-medium uppercase leading-none tracking-[0.18em] text-muted sm:tracking-[0.3em]">
          {/* ** ornament, placement 1 of 3 */}
          Bharat Ka Ch<b className="font-semibold text-gold">**</b>tiya
        </span>
      )}
    </span>
  )
}
