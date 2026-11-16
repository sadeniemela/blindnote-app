"use client"

import { useEffect, useState } from "react"
import { buttonClass, primaryButtonClass } from "../common/ui"
import type { Dictionary } from "@/lib/i18n/dictionaries"

type Status = "loading" | "unsupported" | "ios-install" | "denied" | "off" | "on"

// The browser wants the public VAPID key as bytes, but we store it as base64url text
function base64UrlToBytes(base64: string) {
  const padded = (base64 + "=".repeat((4 - (base64.length % 4)) % 4)).replace(/-/g, "+").replace(/_/g, "/")
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0))
}

// Turns push notifications on or off for this device.
// On iPhone this only works after Blindnote is added to the home screen (iOS 16.4 or newer).
export default function PushToggle({ publicKey, t }: { publicKey: string; t: Dictionary["push"] }) {
  const [status, setStatus] = useState<Status>("loading")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function init() {
      const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent)
      const isInstalled = window.matchMedia("(display-mode: standalone)").matches
      const supported = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window

      if (!supported) return setStatus(isIos && !isInstalled ? "ios-install" : "unsupported")
      if (Notification.permission === "denied") return setStatus("denied")

      // The service worker (public/sw.js) is what shows the notification later
      const registration = await navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" })
      const existing = await registration.pushManager.getSubscription()
      setStatus(existing ? "on" : "off")
    }
    init().catch(() => setStatus("unsupported"))
  }, [])

  async function turnOn() {
    setBusy(true)
    setError(null)
    try {
      // Must be called right after a tap, otherwise iPhone does not show the question
      const permission = await Notification.requestPermission()
      if (permission !== "granted") {
        setStatus(permission === "denied" ? "denied" : "off")
        return
      }

      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: base64UrlToBytes(publicKey),
      })

      const res = await fetch("/api/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      })
      if (!res.ok) throw new Error("Saving the subscription failed")
      setStatus("on")
    } catch {
      setError(t.failed)
    } finally {
      setBusy(false)
    }
  }

  async function turnOff() {
    setBusy(true)
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    if (subscription) {
      await fetch("/api/push", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      })
      await subscription.unsubscribe()
    }
    setStatus("off")
    setBusy(false)
  }

  if (status === "loading") return null

  const text =
    status === "on" ? t.enabledText
    : status === "off" ? t.disabledText
    : status === "ios-install" ? t.iosInstall
    : status === "denied" ? t.denied
    : t.unsupported

  return (
    <div className="border border-black dark:border-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">( {t.label} )</p>
        <p className="mt-3 max-w-xl">{text}</p>
        {error && <p className="text-sm text-red-600 dark:text-red-400 mt-2">{error}</p>}
      </div>
      {status === "off" && (
        <button type="button" onClick={turnOn} disabled={busy} className={primaryButtonClass + " shrink-0"}>
          {busy ? t.turningOn : t.off}
        </button>
      )}
      {status === "on" && (
        <button type="button" onClick={turnOff} disabled={busy} className={buttonClass + " shrink-0"}>
          {t.on}
        </button>
      )}
    </div>
  )
}
