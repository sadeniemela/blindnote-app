"use client"

import { useTheme } from "next-themes"
import { useSyncExternalStore } from "react"

const emptySubscribe = () => () => {}

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  // Server can't know the client's stored theme, so we render nothing until
  // mounted on the client. useSyncExternalStore avoids setState-in-effect.
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false)

  if (!mounted) return <span className="w-10" />

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="w-10 text-left uppercase tracking-widest hover:opacity-60 transition-opacity"
      aria-label="Toggle dark mode"
    >
      {theme === "light" ? "Dark" : "Light"}
    </button>
  )
}
