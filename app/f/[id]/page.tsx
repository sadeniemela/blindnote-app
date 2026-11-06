
import { getPublicForm } from "@/lib/forms"
import { notFound } from "next/navigation"
import FeedbackForm from "./feedback-form"

// Public page that anyone with the link can open. No login is required.
export default async function FeedbackPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const form = await getPublicForm(id)

  if (!form) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <p className="text-sm text-neutral-500 mb-2">Nimetön palaute</p>
        <h1 className="text-3xl font-bold text-blue-900 dark:text-white mb-2">{form.title}</h1>
        {form.description && (
          <p className="text-neutral-500 mb-6">{form.description}</p>
        )}
        <FeedbackForm formId={form.id} />
        <p className="text-xs text-neutral-400 mt-6">
          Vastauksesi tallennetaan ilman nimeä, sähköpostia tai tiliä.
        </p>
      </div>
    </div>
  )
}
