import fs from 'fs'

const raw = fs.readFileSync('_archive/js/blog-data.js', 'utf8')
let body = raw
  .replace(/^[\s\S]*?\(function \(BKC\) \{\s*'use strict';\s*/, '')
  .replace(/\s*BKC\.posts[\s\S]*$/, '')

// Extract POSTS array assignment
const match = body.match(/var POSTS = (\[[\s\S]*\]);/)
if (!match) {
  console.error('POSTS not found')
  process.exit(1)
}

const extra = `,
  {
    slug: 'allah-ki-gaay-the-idiom',
    title: 'Allah Ki Gaay: the idiom, not the fuse',
    dek: 'Why we printed a classic Hindi phrase about being bhola-bhala — and how BKC draws the line between humour and harm.',
    glyph: '🐄', bg: '#F1EADB', cat: 'Brand', date: '2026-08-10', read: 4,
    body:
      '<p><i>अल्लाह की गाय</i> — or <i>अल्लाह मियाँ की गाय</i> — is a North Indian idiom. It does not mean a religious argument. It means a person who is extremely simple, soft-hearted, peaceful, and unlikely to hurt anyone. The bhola-bhala type. The one who still believes the auto driver will return with change.</p>' +
      '<p>We printed it because cow energy is already our strongest capsule, and because the phrase is how people actually talk about temperament — not because we want anyone to wear a slogan that puts them in danger.</p>' +
      '<h2>The content line</h2>' +
      '<p>BKC will not print anything that targets a caste, religion, region or individual. Civic tees stay non-partisan. Idioms about personality get a glossary on the product page so the joke lands the way it does in a living room, not the way it does in a comment section.</p>' +
      '<blockquote>Wear the soft heart. Skip the fuse.</blockquote>'
  }`

const postsLiteral = match[1].replace(/\]\s*$/, `${extra}\n]`)

const out = `export const POSTS = ${postsLiteral};

export function postBySlug(slug) {
  return POSTS.find((p) => p.slug === slug) || null;
}
`

fs.mkdirSync('src/data', { recursive: true })
fs.writeFileSync('src/data/blog.js', out)
fs.writeFileSync(
  'src/data/blog.d.ts',
  `export type Post = {
  slug: string
  title: string
  dek: string
  glyph: string
  bg: string
  cat: string
  date: string
  read: number
  body: string
}
export declare const POSTS: Post[]
export function postBySlug(slug: string): Post | null
`,
)
console.log('posts', (out.match(/slug:/g) || []).length)
