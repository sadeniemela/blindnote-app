
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import NewFormForm from "./new-form-form"

// Server Component: checks the session on the server before showing the form
export default async function NewFormPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-xl mx-auto p-8">
        <Link
          href="/dashboard/forms"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Takaisin
        </Link>

        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
          Uusi lomake
        </h1>
        <p className="text-sm text-zinc-500 mb-8">
          Kirjoita kysymys, johon haluat nimetöntä palautetta. Saat jaettavan linkin heti.
        </p>
        <NewFormForm />
      </div>
    </div>
  )
}
