export function money(n: number) {
  return '₹' + Number(n).toLocaleString('en-IN')
}

export function discount(price: number, mrp: number) {
  return Math.round((1 - price / mrp) * 100)
}
