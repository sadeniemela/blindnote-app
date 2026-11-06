"use client"

import { useState } from "react"
import { fieldLabelClass, inputClass, primaryButtonClass } from "../../common/ui"

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
      <div className="border-t border-black dark:border-white pt-10">
        <p className="font-heading font-black uppercase text-4xl sm:text-6xl tracking-tighter leading-[0.9]">Kiitos.</p>
        <p className="text-lg text-neutral-500 mt-4">Vastauksesi on lähetetty nimettömänä.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <label className="flex flex-col gap-2">
        <span className={fieldLabelClass}>Vastauksesi</span>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={5}
          maxLength={MAX_LENGTH}
          placeholder="Kirjoita rehellisesti, nimeäsi ei tallenneta"
          className={inputClass + " !text-xl resize-none"}
        />
      </label>
      <div className="flex items-center justify-between gap-6">
        <button
          type="submit"
          disabled={status === "sending" || !content.trim()}
          className={primaryButtonClass}
        >
          {status === "sending" ? "Lähetetään" : "Lähetä nimettömänä"}
        </button>
        <span className="font-mono text-xs text-neutral-500">{content.length} / {MAX_LENGTH}</span>
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </form>
  )
}
