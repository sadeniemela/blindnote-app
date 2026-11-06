"use client"

import { useState } from "react"

const MAX_LENGTH = 2000

// Sends the anonymous answer to the public API and shows a thank you message
export default function FeedbackForm({ formId }: { formId: string }) {
  const [content, setContent] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle")
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setStatus("sending")

    const res = await fetch(`/api/forms/${formId}/responses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? "Lähetys epäonnistui, yritä uudelleen")
      setStatus("idle")
      return
    }

    setStatus("sent")
  }

  if (status === "sent") {
    return (
      <div className="p-6 rounded-xl bg-blue-50 dark:bg-neutral-900 text-blue-900 dark:text-white">
        <p className="font-bold">Kiitos palautteestasi!</p>
        <p className="text-sm text-neutral-500 mt-1">Vastauksesi on lähetetty nimettömänä.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        rows={6}
        maxLength={MAX_LENGTH}
        placeholder="Kirjoita palautteesi tähän"
        className="w-full p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white focus:outline-none focus:border-blue-700"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-neutral-400">{content.length} / {MAX_LENGTH}</span>
        <button
          type="submit"
          disabled={status === "sending" || !content.trim()}
          className="bg-blue-700 text-white font-medium py-2 px-6 rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {status === "sending" ? "Lähetetään..." : "Lähetä"}
        </button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </form>
  )
}
