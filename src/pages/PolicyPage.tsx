import { Link, useParams } from 'react-router-dom'
import { POLICIES, getPolicy } from '../data/policies'
import { usePageTitle } from '../lib/usePageTitle'
import { STORE } from '../store.config'
import { NotFoundPage } from './NotFoundPage'

export function PolicyPage() {
  const { slug } = useParams()
  const policy = getPolicy(slug || '')
  usePageTitle(policy?.title)

  if (!policy) return <NotFoundPage />

  return (
    <article className="mx-auto max-w-3xl px-[clamp(1rem,0.5rem+2.5vw,3rem)] py-10 md:py-14">
      <p className="eyebrow">Store policies</p>
      <h1 className="mt-4 font-display text-[clamp(2.2rem,1.2rem+3vw,3.5rem)] font-medium uppercase leading-[1.04] tracking-[0.02em]">
        {policy.title}
      </h1>
      <p className="lede mt-5 max-w-none text-lg">{policy.summary}</p>

      {STORE.demo && (
        <p className="mt-8 border border-line bg-surface p-4 text-sm text-muted">
          Template text for a demo store. Review it with a lawyer before a real store relies on it.
        </p>
      )}

      <div className="mt-10 grid gap-10">
        {policy.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="h-label text-gold">{section.heading}</h2>
            <div className="mt-3 grid gap-3 text-muted">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <nav aria-label="Other policies" className="mt-14 flex flex-wrap gap-x-6 gap-y-3 border-t border-line pt-6">
        {POLICIES.filter((p) => p.slug !== policy.slug).map((p) => (
          <Link key={p.slug} to={`/policies/${p.slug}`} className="u micro text-bone">
            {p.title}
          </Link>
        ))}
      </nav>
    </article>
  )
}
