import { useState } from 'react'
import { FITS } from '../data/catalog'
import { BRAND } from '../data/states'
import { SectionHead } from '../components/ProductCard'
import { Wordmark } from '../components/Brand'

export function AboutPage() {
  const [sent, setSent] = useState(false)

  return (
    <div className="shell py-10 md:py-14">
      <SectionHead
        level={1}
        eyebrow="The label"
        title={
          <>
            Bharat Ka <span className="font-deva font-normal text-gold">चू</span>tiya
          </>
        }
        note={`${BRAND.motto} Soft-censor spelling: ${BRAND.softWord}.`}
      />

      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="grid content-start gap-5 text-muted">
          <p>
            BKC is an Indian printed-tee label that treats day-to-day language as the product. Not just Hindi memes —
            Kumaoni, Garhwali, Punjabi, Deccani, Tamil, Malayalam, Bangla, and the rest, filterable by state and region.
          </p>
          <p>
            The word started as a gaali. India already uses it as affectionate “idiot.” We print it as{' '}
            <b className="font-medium text-bone">{BRAND.softWord}</b> and as the Hinglish lockup{' '}
            <b className="font-deva font-normal text-gold">{BRAND.hinglishLockup}</b> so people smile before they flinch —
            until flinching stops being the default.
          </p>
          <p>
            <b className="font-medium text-bone">Our one gap vs ecommerce:</b> {BRAND.differentiator}
          </p>
        </div>

        <aside className="grid content-start justify-items-start gap-5 border border-line bg-surface p-8" aria-labelledby="logo-title">
          <Wordmark align="start" />
          <h2 id="logo-title" className="field-label mt-2">
            Logo system
          </h2>
          <ul className="grid gap-2 text-sm text-muted">
            <li>
              Seal: <b className="font-deva font-normal text-gold">चू</b> inside a double gold ring
            </li>
            <li>Wordmark: BKC in Cormorant Garamond, wide-tracked</li>
            <li>Public spelling: Ch**tiya</li>
            <li>Gold #C9A24A on warm black #0B0A08</li>
          </ul>
        </aside>
      </div>

      <section id="fits" className="mt-20 scroll-mt-32" aria-labelledby="fits-title">
        <SectionHead eyebrow="Fits & GSM" title="Four cuts" id="fits-title" />
        <div className="grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {Object.values(FITS).map((f) => (
            <article key={f.key} className="grid content-start gap-2 border-b border-r border-line p-6">
              <h3 className="font-display text-2xl font-semibold uppercase tracking-[0.05em]">{f.label}</h3>
              <p className="eyebrow">{f.gsm} GSM</p>
              <p className="text-sm text-muted">{f.blurb}</p>
              <p className="micro mt-2">Sizes: {f.sizes.join(', ')}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="mt-20 scroll-mt-32" aria-labelledby="contact-title">
        <SectionHead eyebrow="Contact" title="Write to us" id="contact-title" />
        <form
          className="grid max-w-lg gap-5"
          onSubmit={(e) => {
            e.preventDefault()
            setSent(true)
            e.currentTarget.reset()
          }}
        >
          <div className="grid gap-1.5">
            <label htmlFor="contact-name" className="field-label">
              Name
            </label>
            <input id="contact-name" name="name" autoComplete="name" required className="input" />
          </div>
          <div className="grid gap-1.5">
            <label htmlFor="contact-email" className="field-label">
              Email
            </label>
            <input id="contact-email" name="email" type="email" autoComplete="email" required className="input" />
          </div>
          <div className="grid gap-1.5">
            <label htmlFor="contact-message" className="field-label">
              Message
            </label>
            <textarea id="contact-message" name="message" required rows={5} className="input" />
          </div>
          <button type="submit" className="btn btn-primary justify-self-start">
            Send message
          </button>
          <p role="status" className="min-h-[1.4em] text-sm text-success">
            {sent ? 'Demo store: your message was not sent anywhere.' : ''}
          </p>
        </form>
      </section>
    </div>
  )
}
