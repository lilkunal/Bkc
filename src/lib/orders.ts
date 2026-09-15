/** Checkout helpers: shipping, delivery estimates, the demo order record, order history and simulated tracking. */

import type { CartItem } from '../context/CartContext'
import { STORE } from '../store.config'
import type { DeliverySpeed } from './pricing'

export interface Order {
  ref: string
  createdAt: string
  name: string
  email: string
  phone?: string
  address?: string
  city: string
  state?: string
  pincode?: string
  payment: string
  items: CartItem[]
  subtotal: number
  discount?: number
  coupon?: string | null
  shipping: number
  express?: number
  delivery?: DeliverySpeed
  giftWrap?: number
  giftMessage?: string
  codFee?: number
  tax?: number
  total: number
}

export const DELIVERY_REGIONS = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir',
  'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
]

export function shippingFor(subtotal: number) {
  return subtotal === 0 || subtotal >= STORE.shipping.freeAbove ? 0 : STORE.shipping.fee
}

const dayFormat = new Intl.DateTimeFormat(STORE.currency.locale, { weekday: 'short', day: 'numeric', month: 'short' })

/** Adds business days (Monday–Saturday) to a date. */
function addBusinessDays(from: Date, days: number) {
  const d = new Date(from)
  let left = days
  while (left > 0) {
    d.setDate(d.getDate() + 1)
    if (d.getDay() !== 0) left--
  }
  return d
}

/**
 * Earliest and latest delivery dates for an order placed at `from`, formatted for display.
 * `shiftDays` moves both: positive for remote areas, negative for express.
 */
export function deliveryWindow(from = new Date(), shiftDays = 0): [string, string] {
  const { dispatchDays, deliveryDaysMin, deliveryDaysMax } = STORE.shipping
  const earliest = Math.max(1, dispatchDays + deliveryDaysMin + shiftDays)
  const latest = Math.max(earliest, dispatchDays + deliveryDaysMax + shiftDays)
  return [dayFormat.format(addBusinessDays(from, earliest)), dayFormat.format(addBusinessDays(from, latest))]
}

const ZONES: Record<string, string> = {
  '1': 'Delhi, Haryana, Punjab, Himachal, J&K and Ladakh',
  '2': 'Uttar Pradesh and Uttarakhand',
  '3': 'Rajasthan and Gujarat',
  '4': 'Maharashtra, Goa, Madhya Pradesh and Chhattisgarh',
  '5': 'Andhra Pradesh, Telangana and Karnataka',
  '6': 'Tamil Nadu, Kerala and Puducherry',
  '7': 'West Bengal, Odisha and the North East',
  '8': 'Bihar and Jharkhand',
  '9': 'Army and field post offices',
}

/** Postal zone from an Indian pincode's first digit, with extra transit days for far zones (demo estimate). */
export function pincodeZone(pincode: string): { name: string; extraDays: number } | null {
  if (!/^[1-9][0-9]{5}$/.test(pincode)) return null
  const first = pincode[0]
  const far = /^7[89]/.test(pincode) || first === '9'
  return { name: ZONES[first], extraDays: far ? 2 : first === '1' || first === '2' ? 0 : 1 }
}

export function makeOrderRef() {
  return `${STORE.name.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`
}

const LAST_KEY = `${STORE.name.toLowerCase()}_last_order`
const HISTORY_KEY = `${STORE.name.toLowerCase()}_orders`

export function orderHistory(): Order[] {
  try {
    const list = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
    return Array.isArray(list) ? (list as Order[]) : []
  } catch {
    return []
  }
}

export function saveOrder(order: Order) {
  try {
    sessionStorage.setItem(LAST_KEY, JSON.stringify(order))
    localStorage.setItem(HISTORY_KEY, JSON.stringify([order, ...orderHistory().filter((o) => o.ref !== order.ref)].slice(0, 20)))
  } catch {
    // Storage blocked (private mode): the confirmation page shows its fallback.
  }
}

export function loadOrder(ref: string): Order | null {
  const saved = orderHistory().find((o) => o.ref === ref)
  if (saved) return saved
  try {
    const order = JSON.parse(sessionStorage.getItem(LAST_KEY) || 'null') as Order | null
    return order?.ref === ref ? order : null
  } catch {
    return null
  }
}

export function clearOrderHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY)
  } catch {
    // Nothing stored.
  }
}

/** Contact and address from the most recent order, to prefill checkout. */
export function lastDetails() {
  const last = orderHistory()[0]
  if (!last) return {}
  return { name: last.name, email: last.email, phone: last.phone ?? '', line1: last.address ?? '', city: last.city, state: last.state ?? '', pincode: last.pincode ?? '' }
}

const TRACKING_STAGES = [
  { label: 'Order placed', afterHours: 0 },
  { label: 'Packed at the studio', afterHours: 8 },
  { label: 'Handed to the courier', afterHours: 30 },
  { label: 'Out for delivery', afterHours: 90 },
  { label: 'Delivered', afterHours: 110 },
]

/** Simulated tracking for the demo: each stage unlocks as time passes since the order was placed. */
export function trackingFor(order: Order, now = Date.now()) {
  const placed = new Date(order.createdAt).getTime()
  const speed = order.delivery === 'express' ? 0.6 : 1
  const stages = TRACKING_STAGES.map((s) => {
    const at = new Date(placed + s.afterHours * speed * 3_600_000)
    return { label: s.label, at, done: at.getTime() <= now }
  })
  const current = stages.reduce((last, s, i) => (s.done ? i : last), 0)
  return { stages, current }
}
