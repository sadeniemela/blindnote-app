"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="rounded-full text-2xl bg-gray-200 px-6 py-3 text-neutral-800 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-gray-200 dark:hover:bg-neutral-600"
    >
       {theme === "light" ? "⏾" : "☀︎"}
    </button>
  )
}