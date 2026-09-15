import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useState, type ReactNode } from 'react'
import { DEFAULT_THEME, THEMES, applyTheme, getTheme, initialTheme, type Theme } from '../themes'
import { STORE } from '../store.config'

type ThemeValue = { theme: Theme; themes: Theme[]; setTheme: (key: string) => void }

const ThemeContext = createContext<ThemeValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => initialTheme(STORE.theme, STORE.features.themePicker))

  useLayoutEffect(() => {
    const storeTheme = getTheme(STORE.theme) ?? DEFAULT_THEME
    // Only remember a visitor's own choice; the store default needs no storage.
    applyTheme(theme, STORE.features.themePicker && theme.key !== storeTheme.key)
  }, [theme])

  const setTheme = useCallback((key: string) => {
    const next = getTheme(key)
    if (next) setThemeState(next)
  }, [])

  const value = useMemo(() => ({ theme, themes: THEMES, setTheme }), [theme, setTheme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
