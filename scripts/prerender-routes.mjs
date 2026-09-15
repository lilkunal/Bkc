// Runs after the build (npm run deploy does it for you).
// Writes a real HTML file for every app route, so GitHub Pages answers deep links with 200,
// and gives each page its own title, description, link-preview tags and, for products,
// structured data. Also writes sitemap.xml.
import { createServer } from 'vite'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const shell = readFileSync(join(dist, 'index.html'), 'utf8')

const vite = await createServer({ root, configFile: false, logLevel: 'error', server: { middlewareMode: true }, appType: 'custom' })
let STORE, PRODUCTS, GARMENTS, POSTS, POLICIES, money
try {
  ;({ STORE } = await vite.ssrLoadModule('/src/store.config.ts'))
  ;({ PRODUCTS, GARMENTS } = await vite.ssrLoadModule('/src/data/catalog.ts'))
  ;({ POSTS } = await vite.ssrLoadModule('/src/data/blog.ts'))
  ;({ POLICIES } = await vite.ssrLoadModule('/src/data/policies.ts'))
  ;({ money } = await vite.ssrLoadModule('/src/lib/format.ts'))
} finally {
  await vite.close()
}

const site = STORE.siteUrl.replace(/\/?$/, '/')
const shareImage = site + STORE.seo.shareImage
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const clip = (s, n = 155) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s)
const titled = (title) => `${title} · ${STORE.name}`
const absolute = (image) => (/^https?:\/\//i.test(image) ? image : site + image.replace(/^\/+/, ''))

const pages = [
  { path: '', title: `${STORE.name} — ${STORE.fullName}`, description: STORE.seo.description },
  { path: 'shop', title: titled('Shop everything'), description: `${PRODUCTS.length} designs. Filter by garment, fit, category, colour and state.` },
  { path: 'states', title: titled('Shop by state'), description: 'Day-to-day slang tees by state and region, all in one cart.' },
  { path: 'collections', title: titled('Collections'), description: 'Curated capsules and every category in the catalogue.' },
  { path: 'occasions', title: titled('Occasions'), description: 'Tees for festivals, exams, shaadi season, monsoon and polling day.' },
  { path: 'blog', title: titled('Journal'), description: 'Fit guides, the slang atlas, and why a gaali became a brand.' },
  { path: 'about', title: titled('About'), description: `${STORE.fullName}. ${STORE.tagline}` },
  { path: 'lookbook', title: titled('Lookbook'), description: 'The drop, worn and in the studio.' },
  { path: 'checkout', title: titled('Checkout'), description: STORE.seo.description, noindex: true },
  { path: 'wishlist', title: titled('Wishlist'), description: 'Designs you saved for later.', noindex: true },
  { path: 'cart', title: titled('Your bag'), description: STORE.seo.description, noindex: true },
  { path: 'account', title: titled('Your account'), description: 'Orders, saved designs and details.', noindex: true },
  { path: 'track', title: titled('Track an order'), description: 'Follow your order from the studio to your door.', noindex: true },
  ...(STORE.features.caseStudy ? [{ path: 'case-study', title: titled('Case study'), description: 'How this storefront was designed and built.' }] : []),
  ...(STORE.features.marketFile ? [{ path: 'market', title: titled('Market file'), description: 'Market sizing, competitors and unit economics.' }] : []),
  ...POLICIES.map((p) => ({ path: `policies/${p.slug}`, title: titled(p.title), description: p.summary })),
  ...POSTS.map((p) => ({ path: `blog/${p.slug}`, title: titled(p.title), description: p.dek, type: 'article' })),
  ...PRODUCTS.map((p) => {
    const garment = GARMENTS[p.type]
    const description = clip(p.desc || `${p.name}: ${garment.label.toLowerCase()} in ${p.colorName}.`)
    const image = p.image ? absolute(p.image) : shareImage
    const url = `${site}product/${p.id}`
    return {
      path: `product/${p.id}`,
      title: titled(p.name),
      description: `${description} ${money(p.price)}.`,
      image,
      type: 'product',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: p.name,
        sku: p.id,
        description,
        image,
        brand: { '@type': 'Brand', name: STORE.name },
        offers: { '@type': 'Offer', price: p.price, priceCurrency: STORE.currency.code, availability: 'https://schema.org/InStock', url },
      },
    }
  }),
]

function render(page) {
  const url = site + page.path
  const tags = [
    ...(page.notFound ? [] : [`<link rel="canonical" href="${esc(url)}" />`, `<meta property="og:url" content="${esc(url)}" />`]),
    `<meta property="og:site_name" content="${esc(STORE.name)}" />`,
    `<meta property="og:type" content="${page.type === 'article' ? 'article' : page.type === 'product' ? 'product' : 'website'}" />`,
    `<meta property="og:title" content="${esc(page.title)}" />`,
    `<meta property="og:description" content="${esc(page.description)}" />`,
    `<meta property="og:image" content="${esc(page.image ?? shareImage)}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    ...(page.noindex ? ['<meta name="robots" content="noindex" />'] : []),
    ...(page.jsonLd ? [`<script type="application/ld+json">${JSON.stringify(page.jsonLd).replace(/</g, '\\u003c')}</script>`] : []),
  ]
  const html = shell
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(page.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${esc(page.description)}" />`)
  return html.replace('</head>', `  ${tags.join('\n    ')}\n  </head>`)
}

const write = (rel, html) => {
  const file = join(dist, rel)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, html)
}

for (const page of pages) write(page.path ? `${page.path}.html` : 'index.html', render(page))

// A route that is also a folder (blog/ holds the post pages) can be served as folder/index.html.
let folders = 0
for (const page of pages) {
  if (page.path && existsSync(join(dist, page.path))) {
    write(`${page.path}/index.html`, render(page))
    folders++
  }
}

// Unknown URLs (and client-only routes like order confirmations) still get the app, with an honest 404.
write('404.html', render({ path: '', title: titled('Page not found'), description: STORE.seo.description, noindex: true, notFound: true }))

const today = new Date().toISOString().slice(0, 10)
const urls = pages.filter((p) => !p.noindex).map((p) => `  <url><loc>${esc(site + p.path)}</loc><lastmod>${today}</lastmod></url>`)
writeFileSync(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`)

console.log(`prerender-routes: ${pages.length} pages (${folders} folder index), 404.html, sitemap.xml with ${urls.length} URLs`)
