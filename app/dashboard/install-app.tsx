"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import { buttonClass, primaryButtonClass } from "../common/ui"
import type { Dictionary } from "@/lib/i18n/dictionaries"

// Chrome and Edge fire this event when the site can be installed. It is not in
// TypeScript's built in types, so we describe the part we use.
type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> }

// Safari's Share icon: a box with an arrow pointing up
function ShareIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="inline w-5 h-5 -mt-1" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3v12M8 7l4-4 4 4M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1" />
    </svg>
  )
}

// "Install app" button. Android and desktop Chrome get the browser's real install dialog.
// iPhone has no such dialog for websites, Apple only allows installing through Safari's
// own Share menu, so there the button opens short step by step instructions.
// What kind of device this is. Read from the browser, so the server render says "server".
function detectDevice(): "standalone" | "ios" | "other" {
  if (window.matchMedia("(display-mode: standalone)").matches) return "standalone"
  const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  return isIos ? "ios" : "other"
}
const noSubscribe = () => () => {}

export default function InstallApp({ t }: { t: Dictionary["install"] }) {
  const device = useSyncExternalStore(noSubscribe, detectDevice, () => "server" as const)
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(false)
  const [showSteps, setShowSteps] = useState(false)

  useEffect(() => {
    function onPrompt(event: Event) {
      // Stop the browser's own mini banner, we show our button instead
      event.preventDefault()
      setPromptEvent(event as InstallPromptEvent)
    }
    const onInstalled = () => setInstalled(true)
    window.addEventListener("beforeinstallprompt", onPrompt)
    window.addEventListener("appinstalled", onInstalled)
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt)
      window.removeEventListener("appinstalled", onInstalled)
    }
  }, [])

  // ios: show the steps. prompt: the browser offered to install. hidden: nothing to show.
  const mode = installed || device === "standalone" || device === "server"
    ? "hidden"
    : device === "ios" ? "ios"
    : promptEvent ? "prompt"
    : "hidden"

  async function install() {
    if (!promptEvent) return
    await promptEvent.prompt()
    const { outcome } = await promptEvent.userChoice
    if (outcome === "accepted") setInstalled(true)
  }

  if (mode === "hidden") return null

  return (
    <div className="border border-black dark:border-white p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">( {t.label} )</p>
          <p className="mt-3 max-w-xl">{t.text}</p>
        </div>
        {mode === "prompt" ? (
          <button type="button" onClick={install} className={primaryButtonClass + " shrink-0"}>
            {t.button}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowSteps((v) => !v)}
            aria-expanded={showSteps}
            className={(showSteps ? buttonClass : primaryButtonClass) + " shrink-0"}
          >
            {showSteps ? t.close : t.iosButton}
          </button>
        )}
      </div>

      {mode === "ios" && showSteps && (
        <ol className="mt-6 border-t border-black dark:border-white">
          {[
            <>
              {t.iosStep1} <ShareIcon />
            </>,
            <>{t.iosStep2} <span aria-hidden className="inline-block border border-current rounded px-1 text-xs leading-4">+</span></>,
            <>{t.iosStep3}</>,
          ].map((step, i) => (
            <li key={i} className="flex gap-4 py-4 border-b border-neutral-200 dark:border-neutral-800 last:border-0 text-lg">
              <span className="font-mono text-sm text-neutral-500 pt-1">0{i + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
