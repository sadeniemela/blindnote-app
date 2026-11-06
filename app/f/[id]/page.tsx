
import { getPublicForm } from "@/lib/forms"
import Link from "next/link"
import { notFound } from "next/navigation"
import FeedbackForm from "./feedback-form"
import { Label, Page, Title } from "../../common/ui"

// Public page that anyone with the link can open. No login is required.
export default async function FeedbackPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const form = await getPublicForm(id)

  if (!form) {
    notFound()
  }

  return (
    <Page className="flex flex-col">
      <header className="py-5 flex items-center justify-between text-xs font-medium uppercase tracking-widest">
        <Link href="/" className="font-heading font-black text-base tracking-tight normal-case">
          Blind<span className="bg-black text-white dark:bg-white dark:text-black px-1">note</span>
        </Link>
        <span className="text-neutral-500">( Nimetön palaute )</span>
      </header>

      <div className="flex-1 flex flex-col justify-center max-w-3xl w-full py-16">
        <Label>Kysymys</Label>
        <Title className="mt-6">{form.title}</Title>
        {form.description && <p className="text-lg text-neutral-500 mt-6 max-w-xl">{form.description}</p>}
        <div className="mt-14">
          <FeedbackForm formId={form.id} />
        </div>
      </div>

      <p className="pb-6 text-xs uppercase tracking-widest text-neutral-500">
        Vastauksesi tallennetaan ilman nimeä, sähköpostia tai tiliä.
      </p>
    </Page>
  )
}
