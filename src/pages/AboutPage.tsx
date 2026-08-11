import { FITS } from '../data/catalog'
import { BRAND } from '../data/states'
import { SectionHead } from '../components/ProductCard'

export function AboutPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-[clamp(1rem,0.5rem+2vw,3rem)] py-8 md:py-12">
      <SectionHead
        eyebrow="The label"
        title={
          <>
            Bharat Ka
            <br />
            <span className="font-deva text-chilli">चू</span>
            <span className="text-chilli">tiya</span>
          </>
        }
        note={`${BRAND.motto} Soft-censor spelling: ${BRAND.softWord}.`}
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4 text-sm text-ink-70">
          <p>
            BKC is an Indian printed-tee label that treats day-to-day language as the product. Not just Hindi memes —
            Kumaoni, Garhwali, Punjabi, Deccani, Tamil, Malayalam, Bangla, and the rest, filterable by state and region.
          </p>
          <p>
            The word started as a gaali. India already uses it as affectionate “idiot.” We print it as{' '}
            <b>{BRAND.softWord}</b> and as the Hinglish lockup <b className="font-deva">{BRAND.hinglishLockup}</b> so
            people smile before they flinch — until flinching stops being the default.
          </p>
          <p>
            <b>Our one gap vs ecommerce:</b> {BRAND.differentiator}
          </p>
        </div>
        <div className="border-2 border-ink bg-cream p-5">
          <img
            src={`${import.meta.env.BASE_URL}logo.svg`}
            alt="BKC Hinglish logo चूtiya"
            className="w-full max-w-sm"
            width={420}
            height={120}
          />
          <p className="mt-4 font-mono text-xs uppercase tracking-wider text-ink-45">Logo system</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            <li>Marigold square + BKC</li>
            <li>
              Hinglish lockup: Devanagari <b>चू</b> + Latin <b>tiya</b>
            </li>
            <li>Public spelling: Ch**tiya</li>
          </ul>
        </div>
      </div>

      <h2 className="mb-4 mt-12 font-display text-2xl uppercase">Fits & GSM</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Object.values(FITS).map((f) => (
          <article key={f.key} className="border-2 border-ink bg-cream p-4">
            <h3 className="font-display text-lg uppercase">{f.label}</h3>
            <p className="mt-1 font-mono text-xs">{f.gsm} GSM</p>
            <p className="mt-2 text-sm text-ink-70">{f.blurb}</p>
            <p className="mt-2 text-xs text-ink-45">Sizes: {f.sizes.join(', ')}</p>
          </article>
        ))}
      </div>

      <h2 className="mb-4 mt-12 font-display text-2xl uppercase">Contact</h2>
      <form
        className="grid max-w-lg gap-3"
        onSubmit={(e) => {
          e.preventDefault()
          alert('Demo form — message not sent.')
        }}
      >
        <label className="text-xs uppercase">
          Name
          <input name="name" autoComplete="name" required className="mt-1 min-h-11 w-full border-2 border-ink bg-cream px-3" />
        </label>
        <label className="text-xs uppercase">
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-1 min-h-11 w-full border-2 border-ink bg-cream px-3"
          />
        </label>
        <label className="text-xs uppercase">
          Message
          <textarea name="message" required rows={4} className="mt-1 w-full border-2 border-ink bg-cream px-3 py-2" />
        </label>
        <button type="submit" className="min-h-12 border-2 border-ink bg-ink font-bold uppercase text-cream">
          Send (demo)
        </button>
      </form>
    </div>
  )
}
