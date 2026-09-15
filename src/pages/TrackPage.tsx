import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { deliveryWindow, loadOrder, orderHistory, pincodeZone, trackingFor } from '../lib/orders'
import { usePageTitle } from '../lib/usePageTitle'
import { STORE } from '../store.config'
import { SectionHead } from '../components/ProductCard'

const timeFormat = new Intl.DateTimeFormat(STORE.currency.locale, { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })

function FindOrder() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const ref = String(data.get('ref') ?? '').trim().toUpperCase()
    const email = String(data.get('email') ?? '').trim().toLowerCase()
    const order = orderHistory().find((o) => o.ref === ref && o.email.toLowerCase() === email)
    if (!order) {
      setError('No order with that number and email in this browser.')
      return
    }
    navigate(`/track/${order.ref}`)
  }

  return (
    <div className="shell py-10 md:py-14">
      <SectionHead level={1} eyebrow="Help" title="Track an order" note="Enter the order number from your confirmation and the email you used." />
      <form onSubmit={onSubmit} className="grid max-w-xl gap-5" noValidate>
        <div className="grid gap-1.5">
          <label htmlFor="track-ref" className="field-label">
            Order number
          </label>
          <input id="track-ref" name="ref" required className="input uppercase" placeholder={`${STORE.name}-…`} />
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="track-email" className="field-label">
            Email
          </label>
          <input id="track-email" name="email" type="email" required autoComplete="email" className="input" />
        </div>
        <p role="status" className="min-h-[1.2em] text-sm text-error">
          {error}
        </p>
        <button type="submit" className="btn btn-primary justify-self-start">
          Track order
        </button>
        {STORE.demo && <p className="text-xs text-muted">Demo store: orders are saved in the browser that placed them.</p>}
      </form>
    </div>
  )
}

export function TrackPage() {
  const { ref = '' } = useParams()
  const order = ref ? loadOrder(ref) : null
  usePageTitle(ref ? `Tracking ${ref}` : 'Track an order')

  if (!ref) return <FindOrder />
  if (!order) {
    return (
      <div className="shell grid justify-items-center gap-5 py-24 text-center">
        <h1 className="h-section">We can’t find that order here</h1>
        <Link to="/track" className="btn btn-secondary">
          Look up another order
        </Link>
      </div>
    )
  }

  const { stages, current } = trackingFor(order)
  const shift = (pincodeZone(order.pincode ?? '')?.extraDays ?? 0) - (order.delivery === 'express' ? STORE.shipping.expressDaysFaster : 0)
  const [earliest, latest] = deliveryWindow(new Date(order.createdAt), shift)
  const progress = current / (stages.length - 1)

  return (
    <div className="shell py-10 md:py-14">
      <SectionHead
        level={1}
        eyebrow={`Order ${order.ref}`}
        title={stages[current].label}
        note={current === stages.length - 1 ? 'It’s with you. Enjoy.' : `Arriving ${earliest} – ${latest} in ${order.city}.`}
      />

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
        <ol className="timeline" style={{ '--progress': progress } as React.CSSProperties}>
          <motion.span
            aria-hidden="true"
            className="timeline-fill"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: progress }}
            transition={{ duration: 1.1, ease: [0.2, 0.7, 0.2, 1], delay: 0.2 }}
          />
          {stages.map((s, i) => (
            <motion.li
              key={s.label}
              className={`timeline-step ${s.done ? 'is-done' : ''} ${i === current ? 'is-current' : ''}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
              aria-current={i === current ? 'step' : undefined}
            >
              <span className="timeline-dot" aria-hidden="true" />
              <span className="grid gap-0.5">
                <span className="font-medium">{s.label}</span>
                <span className="text-sm text-muted">{s.done ? timeFormat.format(s.at) : `Expected ${timeFormat.format(s.at)}`}</span>
              </span>
            </motion.li>
          ))}
        </ol>

        <aside className="grid content-start gap-4 border border-line bg-surface p-6" style={{ borderRadius: 'var(--radius-card)' }}>
          <p className="h-label">Shipping to</p>
          <p className="text-sm text-muted">{[order.name, order.address, order.city, order.state, order.pincode].filter(Boolean).join(', ')}</p>
          <p className="text-sm text-muted">{order.delivery === 'express' ? 'Express delivery' : 'Standard delivery'}</p>
          <Link to={`/order/${order.ref}`} className="u micro justify-self-start text-gold">
            Order details
          </Link>
          {STORE.demo && <p className="border-t border-line pt-4 text-xs text-muted">Demo tracking: stages are simulated from the time the order was placed.</p>}
        </aside>
      </div>
    </div>
  )
}
