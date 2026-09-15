/** Bag and checkout arithmetic: coupons, shipping, delivery and gift-wrap fees, and GST included in prices. */
import type { CartItem } from '../context/CartContext'
import { STORE } from '../store.config'
import { money } from './format'

export interface Coupon {
  code: string
  /** percent: `value`% off · flat: `value` off · shipping: free shipping. */
  kind: string
  value: number
  /** Bag value needed before the code works (0 = any). */
  minSubtotal: number
  note: string
}

export type DeliverySpeed = 'standard' | 'express'

export interface CheckoutOptions {
  coupon?: string | null
  delivery?: DeliverySpeed
  giftWrap?: boolean
  payment?: string
}

export interface Totals {
  subtotal: number
  discount: number
  shipping: number
  express: number
  giftWrap: number
  codFee: number
  total: number
  /** Tax already inside the prices. */
  tax: number
  coupon: Coupon | null
  couponError: string | null
  toFreeShipping: number
  /** 0–1 towards free shipping. */
  freeShippingProgress: number
}

export function findCoupon(code: string | null | undefined): Coupon | undefined {
  const clean = (code ?? '').trim().toUpperCase()
  return STORE.coupons.find((c) => c.code === clean)
}

export function checkCoupon(code: string | null | undefined, subtotal: number): { coupon: Coupon | null; error: string | null } {
  const clean = (code ?? '').trim().toUpperCase()
  if (!clean) return { coupon: null, error: null }
  const coupon = findCoupon(clean)
  if (!coupon) return { coupon: null, error: `“${clean}” isn’t a valid code.` }
  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
    return { coupon: null, error: `${coupon.code} works on bags of ${money(coupon.minSubtotal)} or more.` }
  }
  return { coupon, error: null }
}

/** Tax contained in a tax-inclusive line, using the store's price slabs. */
export function lineTax(price: number, qty: number) {
  const slab = STORE.tax.slabs.find((s) => s.upTo == null || price <= s.upTo)
  const rate = slab?.rate ?? 0
  return (price * qty * rate) / (100 + rate)
}

export function computeTotals(items: CartItem[], options: CheckoutOptions = {}): Totals {
  const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0)
  const { coupon, error } = checkCoupon(options.coupon, subtotal)
  const has = items.length > 0

  let discount = 0
  if (coupon?.kind === 'percent') discount = Math.round((subtotal * coupon.value) / 100)
  if (coupon?.kind === 'flat') discount = Math.min(coupon.value, subtotal)
  const afterDiscount = subtotal - discount

  const { freeAbove, fee, expressFee } = STORE.shipping
  const freeShipping = coupon?.kind === 'shipping' || afterDiscount >= freeAbove
  const shipping = !has || freeShipping ? 0 : fee
  const express = has && options.delivery === 'express' ? expressFee : 0
  const giftWrap = has && options.giftWrap ? STORE.giftWrapFee : 0
  const codFee = has && options.payment === 'cod' ? STORE.codFee : 0
  const ratio = subtotal ? afterDiscount / subtotal : 0
  const tax = Math.round(items.reduce((n, i) => n + lineTax(i.price, i.qty), 0) * ratio)

  return {
    subtotal,
    discount,
    shipping,
    express,
    giftWrap,
    codFee,
    total: afterDiscount + shipping + express + giftWrap + codFee,
    tax,
    coupon,
    couponError: error,
    toFreeShipping: freeShipping ? 0 : Math.max(0, freeAbove - afterDiscount),
    freeShippingProgress: freeShipping ? 1 : Math.min(1, afterDiscount / freeAbove),
  }
}
