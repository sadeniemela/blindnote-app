"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { setLocale } from "../actions/locale"
import type { Locale } from "@/lib/i18n/dictionaries"

// FI / EN switch. The active language is shown in full color, the other one dimmed.
export default function LanguageToggle({ locale, label }: { locale: Locale; label: string }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function choose(next: Locale) {
    if (next === locale) return
    startTransition(async () => {
      await setLocale(next)
      router.refresh()
    })
  }

  return (
    <div role="group" aria-label={label} className={`flex items-center gap-1 ${pending ? "opacity-50" : ""}`}>
      {(["fi", "en"] as const).map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span className="text-neutral-400">/</span>}
          <button
            type="button"
            onClick={() => choose(l)}
            aria-pressed={l === locale}
            className={`uppercase tracking-widest transition-opacity ${l === locale ? "" : "text-neutral-400 hover:opacity-60"}`}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  )
}
