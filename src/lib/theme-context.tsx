"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

interface ThemeContextType {
  darkMode: boolean
  toggleDarkMode: () => void
  setDarkMode: (value: boolean) => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

function getStoredTheme(): boolean {
  if (typeof window === "undefined") return false
  try {
    const stored = localStorage.getItem("lms_theme")
    if (stored !== null) return stored === "dark"
    return false
  } catch {
    return false
  }
}

function applyTheme(dark: boolean) {
  if (typeof window === "undefined") return
  document.documentElement.classList.toggle("dark", dark)
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkModeState] = useState(() => {
    const initial = getStoredTheme()
    applyTheme(initial)
    return initial
  })

  const setDarkMode = useCallback((value: boolean) => {
    setDarkModeState(value)
    applyTheme(value)
    localStorage.setItem("lms_theme", value ? "dark" : "light")
  }, [])

  const toggleDarkMode = useCallback(() => {
    setDarkMode(!darkMode)
  }, [darkMode, setDarkMode])

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}
