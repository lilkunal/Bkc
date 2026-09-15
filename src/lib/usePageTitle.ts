import { useEffect } from 'react'
import { STORE } from '../store.config'

/** Sets the browser tab title for the current page. With no title, uses the store's full name. */
export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${STORE.name}` : `${STORE.name} — ${STORE.fullName}`
  }, [title])
}
