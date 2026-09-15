import { discount, money } from '../lib/format'

export function Price({ price, mrp, className = '' }: { price: number; mrp: number; className?: string }) {
  return (
    <p className={`price ${className}`}>
      <span>{money(price)}</span>
      {mrp > price && (
        <>
          <s>
            <span className="sr-only">was </span>
            {money(mrp)}
          </s>
          <em>{discount(price, mrp)}% off</em>
        </>
      )}
    </p>
  )
}
