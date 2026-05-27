
import { auth } from "@/auth"
import { getForm } from "@/lib/forms"
import { redirect } from "next/navigation"

export default async function FormPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const { id } = await params
  const form = await getForm(id)

  if (!form) {
    redirect("/dashboard/forms")
  }

  if (form.userId !== session.user.id) {
    redirect("/dashboard/forms")
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          {form.title}
        </h1>
        {form.description && (
          <p className="text-sm text-zinc-500 mb-6">{form.description}</p>
        )}
        <p className="text-sm text-zinc-400">Tässä näet lomakkeesi vastaukset</p>
      </div>
    </div>
  )
}