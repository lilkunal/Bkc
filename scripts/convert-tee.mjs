import fs from 'fs'

const raw = fs.readFileSync('_archive/js/tee.js', 'utf8')
let body = raw
  .replace(/^[\s\S]*?\(function \(BKC\) \{\s*'use strict';\s*/, '')
  .replace(/\}\)\(window\.BKC\);\s*$/, '')

body = body
  .replace(/BKC\.ensureTeeDefs = ensureDefs;/, 'export { ensureDefs as ensureTeeDefs };')
  .replace(/BKC\.renderTee = function \(o\) \{/, 'export function renderTee(o) {')
  .replace(/BKC\.renderProductTee = function \(p, overrides\) \{/, 'export function renderProductTee(p, overrides) {')
  .replace(/BKC\.teeFits = Object\.keys\(SHAPES\);/, 'export const teeFits = Object.keys(SHAPES);')
  .replace(/BKC\.teeBackdrops = Object\.keys\(BACKDROPS\);/, 'export const teeBackdrops = Object.keys(BACKDROPS);')

const header = `/** @typedef {'high'|'card'|'flat'} Detail */
/**
 * @typedef {Object} RenderOpts
 * @property {string} [fit]
 * @property {string} [teeHex]
 * @property {string} [printHex]
 * @property {string} [glyph]
 * @property {string[]} [lines]
 * @property {string} [font]
 * @property {string} [backdrop]
 * @property {string} [backdropHex]
 * @property {Detail} [detail]
 * @property {boolean} [flat]
 * @property {string} [alt]
 */

`

fs.mkdirSync('src/lib', { recursive: true })
fs.writeFileSync('src/lib/tee.js', header + body)

// Thin TS shim for types
fs.writeFileSync(
  'src/lib/tee.d.ts',
  `export type RenderOpts = {
  fit?: string
  teeHex?: string
  printHex?: string
  glyph?: string
  lines?: string[]
  font?: string
  backdrop?: string
  backdropHex?: string
  detail?: 'high' | 'card' | 'flat'
  flat?: boolean
  alt?: string
}
export function ensureTeeDefs(): void
export function renderTee(o?: RenderOpts): string
export function renderProductTee(p: any, overrides?: Partial<RenderOpts>): string
export const teeFits: string[]
export const teeBackdrops: string[]
`,
)

console.log('ok', fs.statSync('src/lib/tee.js').size)
