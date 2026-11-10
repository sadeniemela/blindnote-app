"use client"

import { useTheme } from "next-themes"
import { useSyncExternalStore } from "react"

const emptySubscribe = () => () => {}

type Labels = { dark: string; light: string; toggle: string }

export default function ThemeToggle({ labels }: { labels: Labels }) {
  const { theme, setTheme } = useTheme()
  // Server can't know the client's stored theme, so we render nothing until
  // mounted on the client. useSyncExternalStore avoids setState-in-effect.
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false)

  if (!mounted) return <span className="w-14" />

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="w-14 text-left uppercase tracking-widest hover:opacity-60 transition-opacity"
      aria-label={labels.toggle}
    >
      {theme === "light" ? labels.dark : labels.light}
    </button>
  )
}
