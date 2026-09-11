// Writes a real HTML file for every app route, so GitHub Pages answers deep
// links (e.g. /Bkc/shop?state=punjab) with 200 instead of serving 404.html.
import { createServer } from 'vite'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const shell = readFileSync(join(dist, 'index.html'), 'utf8')

const vite = await createServer({ root, configFile: false, logLevel: 'error', server: { middlewareMode: true }, appType: 'custom' })
let products
let posts
try {
  products = (await vite.ssrLoadModule('/src/data/catalog.ts')).PRODUCTS
  posts = (await vite.ssrLoadModule('/src/data/blog.ts')).POSTS
} finally {
  await vite.close()
}

const routes = [
  'shop',
  'states',
  'collections',
  'occasions',
  'blog',
  'market',
  'about',
  'lookbook',
  'case-study',
  ...products.map((p) => `product/${p.id}`),
  ...posts.map((p) => `blog/${p.slug}`),
]

const write = (rel) => {
  const file = join(dist, rel)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, shell)
}

for (const route of routes) write(`${route}.html`)
// A route that is also a folder (blog/ holds the post pages) can be served as folder/index.html.
let folders = 0
for (const route of routes) {
  if (existsSync(join(dist, route))) {
    write(`${route}/index.html`)
    folders++
  }
}
// Unknown URLs still get the app (and an honest 404 status).
writeFileSync(join(dist, '404.html'), shell)

console.log(`prerender-routes: ${routes.length} route pages, ${folders} folder index pages, 404.html`)
