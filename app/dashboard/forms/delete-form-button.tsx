"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Labels = { delete: string; deleting: string; confirm: string }

// redirectTo: where to go after deleting. Without it the current page is just refreshed.
export default function DeleteFormButton({
  formId,
  labels,
  redirectTo,
}: {
  formId: string
  labels: Labels
  redirectTo?: string
}) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm(labels.confirm)) return

    setDeleting(true)
    const res = await fetch(`/api/forms/${formId}`, { method: "DELETE" })
    setDeleting(false)

    if (res.ok) {
      if (redirectTo) router.push(redirectTo)
      router.refresh()
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="text-xs font-medium uppercase tracking-widest text-neutral-500 hover:text-red-600 transition-colors disabled:opacity-50"
    >
      {deleting ? labels.deleting : labels.delete}
    </button>
  )
}
