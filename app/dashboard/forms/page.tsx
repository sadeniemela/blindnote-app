
import { auth } from "@/auth"
import { getForms } from "@/lib/forms"
import { redirect } from "next/navigation"
import Link from "next/link"
import { MessageSquare, Plus, Trash2 } from "lucide-react"

export default async function FormsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const forms = await getForms(session.user.id)

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Lomakkeet
          </h1>
          <Link
            href="/dashboard/forms/new"
            className="flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 rounded-xl text-sm font-medium hover:opacity-80 transition-opacity"
          >
            <Plus size={16} />
            Uusi lomake
          </Link>
        </div>

        {forms.length === 0 ? (
          <div className="text-center py-20 text-zinc-400">
            <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">Ei lomakkeita vielä</p>
            <p className="text-sm mt-1">Luo ensimmäinen lomake ja jaa se muille</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {forms.map((form) => (
              <div
                key={form.id}
                className="flex items-center justify-between p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
              >
                <div className="flex flex-col gap-1">
                  <Link
                    href={`/dashboard/forms/${form.id}`}
                    className="font-medium text-zinc-900 dark:text-white hover:underline"
                  >
                    {form.title}
                  </Link>
                  {form.description && (
                    <p className="text-sm text-zinc-500">{form.description}</p>
                  )}
                  <p className="text-xs text-zinc-400 mt-1">
                    {form._count.responses} vastausta
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/f/${form.id}`}
                    target="_blank"
                    className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  >
                    Avaa linkki
                  </Link>
                  <button className="text-zinc-400 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}