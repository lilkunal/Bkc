import { STORE } from '../store.config'

const currency = new Intl.NumberFormat(STORE.currency.locale, {
  style: 'currency',
  currency: STORE.currency.code,
  maximumFractionDigits: 0,
})

export function money(n: number) {
  return currency.format(Number(n))
}

export function discount(price: number, mrp: number) {
  return Math.round((1 - price / mrp) * 100)
}
