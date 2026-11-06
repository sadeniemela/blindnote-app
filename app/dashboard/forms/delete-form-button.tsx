"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"

export default function DeleteFormButton({ formId }: { formId: string }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm("Haluatko varmasti poistaa tämän lomakkeen?")) return

    setDeleting(true)
    const res = await fetch(`/api/forms/${formId}`, { method: "DELETE" })
    setDeleting(false)

    if (res.ok) {
      router.refresh()
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="text-zinc-400 hover:text-red-500 transition-colors disabled:opacity-50"
    >
      <Trash2 size={16} />
    </button>
  )
}
