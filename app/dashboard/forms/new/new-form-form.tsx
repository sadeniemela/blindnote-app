"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { fieldLabelClass, inputClass, primaryButtonClass } from "../../../common/ui"

// Client Component: needs state (loading, error) and runs in the browser.
// It talks to our own REST API with fetch, the same way any other client would.
export default function NewFormForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(event.currentTarget)

    const res = await fetch("/api/forms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.get("title"),
        description: formData.get("description"),
      }),
    })

    if (!res.ok) {
      // The API answers with { error: "..." } when something is wrong
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? "Jokin meni pieleen, yritä uudelleen")
      setLoading(false)
      return
    }

    const form = await res.json()
    router.push(`/dashboard/forms/${form.id}`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-12">
      <label className="flex flex-col gap-2">
        <span className={fieldLabelClass}>Kysymys</span>
        <input
          name="title"
          required
          maxLength={120}
          placeholder="Miten viime sprintti meni?"
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className={fieldLabelClass}>Kuvaus (valinnainen)</span>
        <textarea
          name="description"
          rows={2}
          maxLength={500}
          placeholder="Kerro vastaajalle lyhyesti mistä on kyse"
          className={inputClass + " !text-xl resize-none"}
        />
      </label>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <button type="submit" disabled={loading} className={primaryButtonClass + " self-start"}>
        {loading ? "Luodaan" : "Luo lomake"}
      </button>
    </form>
  )
}
