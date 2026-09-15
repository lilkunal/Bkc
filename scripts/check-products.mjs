// Checks a product sheet before it goes live. Runs automatically before every build.
// Usage: npm run check:products            (checks catalog/products.csv)
//        npm run check:products -- new.csv (checks another sheet without replacing anything)
import { createServer } from 'vite'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const file = resolve(process.argv[2] ?? join(root, 'catalog', 'products.csv'))
if (!existsSync(file)) {
  console.error(`✗ Sheet not found: ${file}`)
  process.exit(1)
}

const vite = await createServer({ root, configFile: false, logLevel: 'error', server: { middlewareMode: true }, appType: 'custom' })
const reviewsFile = join(root, 'catalog', 'reviews.csv')
let result
let garments
let reviews = null
try {
  const { SHEET_CONTEXT, GARMENTS } = await vite.ssrLoadModule('/src/data/catalog.ts')
  const { productsFromSheet } = await vite.ssrLoadModule('/src/data/sheet.ts')
  result = productsFromSheet(readFileSync(file, 'utf8'), SHEET_CONTEXT)
  garments = GARMENTS
  if (existsSync(reviewsFile)) {
    const { reviewsFromSheet } = await vite.ssrLoadModule('/src/data/reviews.ts')
    reviews = reviewsFromSheet(
      readFileSync(reviewsFile, 'utf8'),
      new Set(result.products.map((p) => p.id)),
      new Set(result.categories.map((c) => c.key)),
    )
  }
} finally {
  await vite.close()
}

const { products, categories, errors, warnings, rowCount } = result

// Local image paths must exist in public/.
for (const p of products) {
  if (p.image && !/^https?:\/\//i.test(p.image) && !existsSync(join(root, 'public', p.image.replace(/^\/+/, '')))) {
    warnings.push({ row: 0, column: 'image', message: `${p.id}: image "${p.image}" was not found in public/.` })
  }
}

const byType = Object.entries(
  products.reduce((m, p) => ((m[p.type] = (m[p.type] || 0) + 1), m), {}),
).map(([type, n]) => `${n} ${n === 1 ? garments[type].label : garments[type].plural}`)

console.log(`Product sheet: ${relative(root, file) || file}`)
console.log(`  ${rowCount} rows → ${products.length} products (${byType.join(', ')}), ${categories.length} categories`)
console.log(`  ${errors.length ? '✗' : '✓'} ${errors.length} error(s)   ${warnings.length ? '⚠' : '✓'} ${warnings.length} warning(s)`)

const line = (issue) => `    ${issue.row ? `Row ${issue.row}` : 'Sheet'}${issue.column ? ` · ${issue.column}` : ''}: ${issue.message}`
if (errors.length) {
  console.log('\nErrors (these rows are left out of the store):')
  errors.forEach((e) => console.log(line(e)))
}
if (warnings.length) {
  console.log('\nWarnings (the store still works, with the fallback shown):')
  warnings.slice(0, 50).forEach((w) => console.log(line(w)))
  if (warnings.length > 50) console.log(`    …and ${warnings.length - 50} more`)
}

if (reviews) {
  console.log(`\nReview sheet: ${relative(root, reviewsFile)}`)
  console.log(`  ${reviews.rowCount} rows → ${reviews.reviews.length} reviews`)
  console.log(
    `  ${reviews.errors.length ? '✗' : '✓'} ${reviews.errors.length} error(s)   ${reviews.warnings.length ? '⚠' : '✓'} ${reviews.warnings.length} warning(s)`,
  )
  if (reviews.errors.length) {
    console.log('\nReview errors (these rows are left out):')
    reviews.errors.forEach((e) => console.log(line(e)))
  }
  if (reviews.warnings.length) {
    console.log('\nReview warnings (shown as store-wide reviews):')
    reviews.warnings.forEach((w) => console.log(line(w)))
  }
}

process.exit(errors.length || reviews?.errors.length ? 1 : 0)
