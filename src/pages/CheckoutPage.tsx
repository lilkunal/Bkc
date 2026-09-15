import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { money } from '../lib/format'
import { DELIVERY_REGIONS, deliveryWindow, lastDetails, makeOrderRef, pincodeZone, saveOrder } from '../lib/orders'
import { computeTotals, type DeliverySpeed } from '../lib/pricing'
import { usePageTitle } from '../lib/usePageTitle'
import { STORE } from '../store.config'
import { CouponForm, TotalsList } from '../components/CommerceBits'
import { GarmentImage } from '../components/GarmentImage'
import { AnimatedBackground, BorderTrail, TransitionPanel } from '../components/motion'

const PAYMENT_METHODS = [
  { key: 'upi', label: 'UPI', note: 'GPay, PhonePe, Paytm or any UPI app' },
  { key: 'card', label: 'Card', note: 'Credit or debit, on the payment partner’s secure page' },
  { key: 'cod', label: 'Cash on delivery', note: `Pay at your door · ${money(STORE.codFee)} handling fee` },
]

const STEPS = ['Contact', 'Delivery', 'Payment', 'Review']

type Details = { name: string; email: string; phone: string; line1: string; city: string; state: string; pincode: string }

const EMPTY: Details = { name: '', email: '', phone: '', line1: '', city: '', state: '', pincode: '' }

const SLIDE = {
  enter: (dir: number) => ({ x: dir > 0 ? 36 : -36, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -36 : 36, opacity: 0 }),
}

const fieldClass = 'grid gap-1.5'
const choiceClass =
  'flex min-h-16 cursor-pointer items-start gap-3 border border-control p-4 transition-colors has-[:checked]:border-gold has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold'

export function CheckoutPage() {
  usePageTitle('Checkout')
  const { items, coupon, setCoupon, clear } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [reached, setReached] = useState(0)
  const [dir, setDir] = useState(1)
  const [details, setDetails] = useState<Details>(() => ({ ...EMPTY, ...lastDetails() }))
  const [delivery, setDelivery] = useState<DeliverySpeed>('standard')
  const [giftWrap, setGiftWrap] = useState(false)
  const [giftMessage, setGiftMessage] = useState('')
  const [payment, setPayment] = useState(PAYMENT_METHODS[0].key)
  const panel = useRef<HTMLDivElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    heading.current?.focus()
  }, [step])

  const totals = computeTotals(items, { coupon, delivery, giftWrap, payment })
  const zone = pincodeZone(details.pincode)
  const shift = zone?.extraDays ?? 0
  const [standardFrom, standardTo] = deliveryWindow(new Date(), shift)
  const [expressFrom, expressTo] = deliveryWindow(new Date(), shift - STORE.shipping.expressDaysFaster)

  if (!items.length) {
    return (
      <div className="shell grid justify-items-center gap-5 py-24 text-center">
        <h1 className="h-section">Your bag is empty</h1>
        <p className="lede">Add something you like, then come back here to check out.</p>
        <Link to="/shop" className="btn btn-primary">
          Shop everything
        </Link>
      </div>
    )
  }

  const field = (key: keyof Details) => ({
    value: details[key],
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setDetails((d) => ({ ...d, [key]: e.target.value })),
  })

  const stepIsValid = () => {
    const fields = panel.current?.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea') ?? []
    for (const el of fields) {
      if (!el.checkValidity()) {
        el.reportValidity()
        el.focus()
        return false
      }
    }
    return true
  }

  const goTo = (next: number) => {
    if (next === step) return
    if (next > step && !stepIsValid()) return
    if (next > reached + 1) return
    setDir(next > step ? 1 : -1)
    setStep(next)
    setReached((r) => Math.max(r, next))
  }

  const placeOrder = () => {
    const ref = makeOrderRef()
    saveOrder({
      ref,
      createdAt: new Date().toISOString(),
      name: details.name.trim(),
      email: details.email.trim(),
      phone: details.phone.trim(),
      address: details.line1.trim(),
      city: details.city.trim(),
      state: details.state,
      pincode: details.pincode,
      payment: PAYMENT_METHODS.find((m) => m.key === payment)?.label ?? payment,
      items,
      subtotal: totals.subtotal,
      discount: totals.discount,
      coupon: totals.coupon?.code ?? null,
      shipping: totals.shipping,
      express: totals.express,
      delivery,
      giftWrap: totals.giftWrap,
      giftMessage: giftWrap ? giftMessage.trim() : '',
      codFee: totals.codFee,
      tax: totals.tax,
      total: totals.total,
    })
    clear()
    setCoupon(null)
    navigate(`/order/${ref}`)
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (step < STEPS.length - 1) goTo(step + 1)
    else placeOrder()
  }

  const stepHeading = (text: string) => (
    <h2 ref={heading} tabIndex={-1} className="h-label mb-6 outline-none">
      {text}
    </h2>
  )

  const panels = [
    <div key="contact" ref={step === 0 ? panel : undefined} className="grid gap-5">
      {stepHeading('Contact')}
      <div className={fieldClass}>
        <label htmlFor="co-name" className="field-label">
          Full name
        </label>
        <input id="co-name" name="name" required autoComplete="name" className="input" {...field('name')} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className={fieldClass}>
          <label htmlFor="co-email" className="field-label">
            Email
          </label>
          <input id="co-email" name="email" type="email" required autoComplete="email" className="input" {...field('email')} />
        </div>
        <div className={fieldClass}>
          <label htmlFor="co-phone" className="field-label">
            Mobile number
          </label>
          <input
            id="co-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel-national"
            inputMode="numeric"
            pattern="[6-9][0-9]{9}"
            title="A 10-digit mobile number"
            className="input"
            {...field('phone')}
          />
        </div>
      </div>
      <p className="text-xs text-muted">Order updates go to this email and number.</p>
    </div>,

    <div key="delivery" ref={step === 1 ? panel : undefined} className="grid gap-5">
      {stepHeading('Delivery')}
      <div className={fieldClass}>
        <label htmlFor="co-address" className="field-label">
          House, street and area
        </label>
        <input id="co-address" name="address" required autoComplete="street-address" className="input" {...field('line1')} />
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        <div className={fieldClass}>
          <label htmlFor="co-city" className="field-label">
            City
          </label>
          <input id="co-city" name="city" required autoComplete="address-level2" className="input" {...field('city')} />
        </div>
        <div className={fieldClass}>
          <label htmlFor="co-state" className="field-label">
            State
          </label>
          <select id="co-state" name="state" required autoComplete="address-level1" className="select" {...field('state')}>
            <option value="" disabled>
              Choose
            </option>
            {DELIVERY_REGIONS.map((region) => (
              <option key={region}>{region}</option>
            ))}
          </select>
        </div>
        <div className={fieldClass}>
          <label htmlFor="co-pincode" className="field-label">
            Pincode
          </label>
          <input
            id="co-pincode"
            name="pincode"
            required
            autoComplete="postal-code"
            inputMode="numeric"
            pattern="[1-9][0-9]{5}"
            title="A 6-digit pincode"
            className="input"
            {...field('pincode')}
          />
        </div>
      </div>
      {zone && <p className="text-xs text-muted">Delivering to {zone.name}.</p>}

      <fieldset className="grid gap-3 sm:grid-cols-2">
        <legend className="field-label mb-3">Delivery speed</legend>
        <label className={choiceClass}>
          <input type="radio" name="delivery" value="standard" checked={delivery === 'standard'} onChange={() => setDelivery('standard')} className="mt-1 size-4 accent-[var(--color-gold)]" />
          <span className="grid gap-0.5">
            <span className="font-medium">Standard · {totals.shipping ? money(totals.shipping) : 'Free'}</span>
            <span className="text-xs text-muted">
              {standardFrom} – {standardTo}
            </span>
          </span>
        </label>
        <label className={choiceClass}>
          <input type="radio" name="delivery" value="express" checked={delivery === 'express'} onChange={() => setDelivery('express')} className="mt-1 size-4 accent-[var(--color-gold)]" />
          <span className="grid gap-0.5">
            <span className="font-medium">Express · +{money(STORE.shipping.expressFee)}</span>
            <span className="text-xs text-muted">
              {expressFrom} – {expressTo}
            </span>
          </span>
        </label>
      </fieldset>

      <div className="grid gap-3 border-t border-line pt-5">
        <label className="flex cursor-pointer items-center gap-3">
          <input type="checkbox" checked={giftWrap} onChange={(e) => setGiftWrap(e.target.checked)} className="size-4 accent-[var(--color-gold)]" />
          <span>
            Gift wrap it · <span className="text-muted">{money(STORE.giftWrapFee)}, with a handwritten note</span>
          </span>
        </label>
        {giftWrap && (
          <div className={fieldClass}>
            <label htmlFor="co-gift" className="field-label">
              Note (optional, up to 150 characters)
            </label>
            <textarea id="co-gift" className="input" maxLength={150} value={giftMessage} onChange={(e) => setGiftMessage(e.target.value)} />
          </div>
        )}
      </div>
    </div>,

    <div key="payment" ref={step === 2 ? panel : undefined} className="grid gap-5">
      {stepHeading('Payment')}
      <fieldset className="grid gap-3">
        <legend className="sr-only">Payment method</legend>
        {PAYMENT_METHODS.map((method) => (
          <label key={method.key} className={choiceClass}>
            <input
              type="radio"
              name="payment"
              value={method.key}
              checked={payment === method.key}
              onChange={() => setPayment(method.key)}
              className="mt-1 size-4 accent-[var(--color-gold)]"
            />
            <span className="grid gap-0.5">
              <span className="font-medium">{method.label}</span>
              <span className="text-xs text-muted">{method.note}</span>
            </span>
          </label>
        ))}
      </fieldset>
      {STORE.demo && <p className="text-xs text-muted">Demo store: you won’t be asked for payment details, and nothing is charged.</p>}
    </div>,

    <div key="review" ref={step === 3 ? panel : undefined} className="grid gap-6">
      {stepHeading('Review your order')}
      <dl className="grid gap-4 text-sm sm:grid-cols-2">
        {[
          { title: 'Contact', body: `${details.name} · ${details.email} · ${details.phone}`, go: 0 },
          { title: 'Deliver to', body: `${details.line1}, ${details.city}, ${details.state} ${details.pincode}`, go: 1 },
          {
            title: 'Delivery',
            body: `${delivery === 'express' ? `Express, ${expressFrom} – ${expressTo}` : `Standard, ${standardFrom} – ${standardTo}`}${giftWrap ? ' · Gift wrapped' : ''}`,
            go: 1,
          },
          { title: 'Payment', body: PAYMENT_METHODS.find((m) => m.key === payment)?.label ?? payment, go: 2 },
        ].map((row) => (
          <div key={row.title} className="grid gap-1 border border-line p-4">
            <dt className="flex items-center justify-between gap-3">
              <span className="field-label">{row.title}</span>
              <button type="button" className="u micro text-gold" onClick={() => goTo(row.go)}>
                Edit
              </button>
            </dt>
            <dd>{row.body}</dd>
          </div>
        ))}
      </dl>
    </div>,
  ]

  return (
    <div className="shell py-10 md:py-14">
      <p className="eyebrow">Checkout</p>
      <h1 className="h-section mt-3">Almost yours</h1>
      {STORE.demo && (
        <p className="mt-5 max-w-2xl border border-line bg-surface p-4 text-sm text-muted">Demo store: no payment is taken and nothing ships. Any details will do.</p>
      )}

      <nav aria-label="Checkout steps" className="mt-8">
        <ol className="steps">
          <AnimatedBackground value={String(step)} className="step-highlight">
            {STEPS.map((label, i) => (
              <li key={label} data-id={String(i)} className="step">
                <button type="button" className="step-btn" disabled={i > reached} aria-current={i === step ? 'step' : undefined} onClick={() => goTo(i)}>
                  <span className="step-num" aria-hidden="true">
                    {i < step ? '✓' : i + 1}
                  </span>
                  {label}
                </button>
              </li>
            ))}
          </AnimatedBackground>
        </ol>
      </nav>

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
        <form noValidate onSubmit={onSubmit} className="grid gap-8" aria-label="Checkout">
          <TransitionPanel activeIndex={step} variants={SLIDE} custom={dir} transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}>
            {panels}
          </TransitionPanel>

          <div className="flex flex-wrap items-center gap-4">
            {step > 0 && (
              <button type="button" className="btn btn-secondary" onClick={() => goTo(step - 1)}>
                Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button type="submit" className="btn btn-primary sm:px-10">
                Continue to {STEPS[step + 1].toLowerCase()}
              </button>
            ) : (
              <button type="submit" className="btn btn-primary relative overflow-hidden sm:px-12">
                Place order · {money(totals.total)}
                <BorderTrail size={90} />
              </button>
            )}
          </div>
        </form>

        <aside className="border border-line bg-surface p-6 lg:sticky lg:top-28" style={{ borderRadius: 'var(--radius-card)' }} aria-labelledby="summary-title">
          <h2 id="summary-title" className="h-label">
            Order summary
          </h2>
          <ul className="mt-5 grid gap-4">
            {items.map((item) => (
              <li key={item.key} className="grid grid-cols-[64px_1fr_auto] items-center gap-4">
                <div className="spot p-1">
                  <GarmentImage
                    type={item.type}
                    image={item.image}
                    fit={item.fit}
                    teeHex={item.teeHex}
                    printHex={item.printHex}
                    lines={item.printLines}
                    glyph={item.glyph}
                    font={item.font}
                    backdrop={item.backdrop}
                    backdropHex={item.backdropHex}
                    detail="flat"
                    alt={item.name}
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  <p className="text-xs uppercase tracking-[0.08em] text-muted">
                    {item.size} · Qty {item.qty}
                  </p>
                </div>
                <p className="text-sm tabular-nums">{money(item.price * item.qty)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t border-line pt-5">
            <CouponForm subtotal={totals.subtotal} compact />
          </div>
          <div className="mt-2">
            <TotalsList totals={totals} />
          </div>
        </aside>
      </div>
    </div>
  )
}
