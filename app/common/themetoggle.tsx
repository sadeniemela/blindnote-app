"use client"

import { useTheme } from "next-themes"
import { useSyncExternalStore } from "react"
import { Sun, Moon } from "lucide-react"

const emptySubscribe = () => () => {}

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  // Server can't know the client's stored theme, so we render nothing until
  // mounted on the client. useSyncExternalStore avoids setState-in-effect.
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false)

  if (!mounted) return null

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="rounded-full text-3xl m-4 text-blue-800 dark:text-blue-500"
    >
       {theme === "light" ? <Moon size={32} /> : <Sun size={32} />}
    </button>
  )
}