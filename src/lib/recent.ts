/** Recently viewed products, kept in this browser only. */
import { STORE } from '../store.config'

const KEY = `${STORE.name.toLowerCase()}_recently_viewed`
const MAX = 12

function read(): string[] {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : []
  } catch {
    return []
  }
}

export function rememberView(id: string) {
  try {
    localStorage.setItem(KEY, JSON.stringify([id, ...read().filter((v) => v !== id)].slice(0, MAX)))
  } catch {
    // Storage blocked: nothing to remember.
  }
}

export function recentlyViewed(exclude: string[] = []): string[] {
  return read().filter((id) => !exclude.includes(id))
}
