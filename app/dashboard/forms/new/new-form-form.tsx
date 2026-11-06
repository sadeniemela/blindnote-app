"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

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

  const inputClass =
    "w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:border-blue-700"

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <label className="flex flex-col gap-2 text-sm font-medium text-zinc-900 dark:text-white">
        Otsikko
        <input
          name="title"
          required
          maxLength={120}
          placeholder="Miten viime sprintti meni?"
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium text-zinc-900 dark:text-white">
        Kuvaus (valinnainen)
        <textarea
          name="description"
          rows={3}
          maxLength={500}
          placeholder="Kerro vastaajalle lyhyesti mistä on kyse"
          className={inputClass}
        />
      </label>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-700 text-white font-medium py-3 rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {loading ? "Luodaan..." : "Luo lomake"}
      </button>
    </form>
  )
}
