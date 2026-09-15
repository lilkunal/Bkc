/**
 * Store policies, written from the settings in src/store.config.ts.
 * This is template text: have a lawyer review it before a real store relies on it.
 */

import { STORE } from '../store.config'
import { money } from '../lib/format'

export interface Policy {
  slug: string
  title: string
  summary: string
  sections: { heading: string; body: string[] }[]
}

const { shipping, returns } = STORE

export const POLICIES: Policy[] = [
  {
    slug: 'shipping',
    title: 'Shipping',
    summary: `Orders leave within ${shipping.dispatchDays} business days and usually arrive ${shipping.deliveryDaysMin}–${shipping.deliveryDaysMax} business days after that.`,
    sections: [
      {
        heading: 'Dispatch',
        body: [
          `Every order is packed and handed to the courier within ${shipping.dispatchDays} business days. Orders placed on Sundays and public holidays start the next business day.`,
          'You get an email with a tracking link as soon as the parcel leaves.',
        ],
      },
      {
        heading: 'Delivery times',
        body: [
          `Most addresses in ${STORE.country} receive their order ${shipping.deliveryDaysMin}–${shipping.deliveryDaysMax} business days after dispatch. Remote pin codes can take a few days longer.`,
          'We currently ship within the country only.',
        ],
      },
      {
        heading: 'Charges',
        body: [`Shipping is free on orders above ${money(shipping.freeAbove)}. Below that, a flat ${money(shipping.fee)} is added at checkout.`],
      },
    ],
  },
  {
    slug: 'returns',
    title: 'Returns & exchanges',
    summary: returns.summary,
    sections: [
      {
        heading: 'Exchanges',
        body: [
          `Wrong size? Request a free exchange within ${returns.days} days of delivery. Items must be unworn, unwashed and have their tags attached.`,
          'We pick up the original and send the new size as soon as it is back with us.',
        ],
      },
      {
        heading: 'Damaged or wrong items',
        body: [
          `If something arrives damaged or isn’t what you ordered, write to ${STORE.supportEmail} within ${returns.days} days with your order number and a photo. We replace it or refund you in full, including shipping.`,
        ],
      },
      {
        heading: 'Refunds',
        body: ['Approved refunds go back to the original payment method within 5–7 business days of the return reaching us.'],
      },
    ],
  },
  {
    slug: 'privacy',
    title: 'Privacy',
    summary: 'What we collect, why, and what we never do with it.',
    sections: [
      {
        heading: 'What we collect',
        body: [
          'When you order: your name, email, phone number and delivery address. When you join the club: your email.',
          'Your bag is saved in your own browser so it survives a refresh. It is not sent to us until you check out.',
        ],
      },
      {
        heading: 'How we use it',
        body: [
          'To deliver your order, send order updates, and, if you opt in, tell you about new drops. We never sell your details.',
          'Card and UPI payments are handled by our payment provider; we never see or store your card number.',
        ],
      },
      {
        heading: 'Your choices',
        body: [`You can ask to see, correct or delete your data at any time by writing to ${STORE.supportEmail}.`],
      },
    ],
  },
  {
    slug: 'terms',
    title: 'Terms of sale',
    summary: `The terms that apply when you buy from ${STORE.legalName}.`,
    sections: [
      {
        heading: 'Orders and pricing',
        body: [
          'Prices include applicable taxes. We may cancel and fully refund an order if an item is out of stock or was listed at an obviously wrong price.',
        ],
      },
      {
        heading: 'Designs',
        body: ['All print designs, names and artwork belong to us. Please don’t reproduce them without permission.'],
      },
      {
        heading: 'Contact',
        body: [`${STORE.legalName}, ${STORE.address}. Email ${STORE.supportEmail} (${STORE.supportHours}).`],
      },
    ],
  },
]

export function getPolicy(slug: string): Policy | undefined {
  return POLICIES.find((p) => p.slug === slug)
}
