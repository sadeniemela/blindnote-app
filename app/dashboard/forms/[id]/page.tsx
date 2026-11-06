
import { auth } from "@/auth"
import { getForm } from "@/lib/forms"
import Link from "next/link"
import { notFound } from "next/navigation"
import CopyLink from "../../../common/copy-link"
import DeleteFormButton from "../delete-form-button"
import { Label, Title, buttonClass, textLinkClass } from "../../../common/ui"

// Finnish date and time, for example "6.11.2026 klo 12.15"
const dateFormat = new Intl.DateTimeFormat("fi-FI", { dateStyle: "short", timeStyle: "short" })

export default async function FormPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  const { id } = await params
  const form = await getForm(id)

  // Same answer for "does not exist" and "not yours", so nobody can probe which ids exist
  if (!form || form.userId !== session?.user?.id) {
    notFound()
  }

  const count = form.responses.length

  return (
    <>
      <Link href="/dashboard/forms" className={textLinkClass}>
        Takaisin
      </Link>

      <div className="mt-12 grid lg:grid-cols-[1fr_auto] gap-10 items-end mb-16">
        <div>
          <Label>Lomake</Label>
          <Title className="mt-6">{form.title}</Title>
          {form.description && <p className="text-lg text-neutral-500 mt-6 max-w-2xl">{form.description}</p>}
        </div>
        <p className="font-heading font-black text-7xl sm:text-9xl leading-none lg:text-right">
          {count}
          <span className="block text-xs font-sans font-medium uppercase tracking-widest text-neutral-500 mt-2">
            {count === 1 ? "vastaus" : "vastausta"}
          </span>
        </p>
      </div>

      {/* Share box: the public link people answer through */}
      <div className="border border-black dark:border-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-20">
        <div className="min-w-0">
          <Label>Jaettava linkki</Label>
          <p className="font-mono text-sm mt-3 truncate">/f/{form.id}</p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <CopyLink path={`/f/${form.id}`} className={buttonClass} />
          <Link href={`/f/${form.id}`} target="_blank" className={textLinkClass}>
            Avaa
          </Link>
        </div>
      </div>

      <Label>Vastaukset</Label>
      {count === 0 ? (
        <div className="border-t border-black dark:border-white mt-6 py-20">
          <p className="font-heading font-black uppercase text-3xl sm:text-5xl tracking-tight">Hiljaista vielä.</p>
          <p className="text-neutral-500 mt-4 max-w-md">Jaa linkki, niin nimettömät vastaukset ilmestyvät tähän.</p>
        </div>
      ) : (
        <ol className="border-t border-black dark:border-white mt-6">
          {form.responses.map((response, i) => (
            <li
              key={response.id}
              className="grid grid-cols-[2.5rem_1fr] sm:grid-cols-[5rem_1fr_auto] gap-x-4 gap-y-2 py-8 border-b border-black dark:border-white"
            >
              <span className="font-mono text-sm text-neutral-500 pt-1">{String(count - i).padStart(2, "0")}</span>
              <p className="text-xl sm:text-2xl leading-snug whitespace-pre-wrap break-words">{response.content}</p>
              <time
                dateTime={response.createdAt.toISOString()}
                className="col-start-2 sm:col-start-3 font-mono text-xs text-neutral-500 sm:pt-2"
              >
                {dateFormat.format(response.createdAt)}
              </time>
            </li>
          ))}
        </ol>
      )}

      <div className="mt-20 flex justify-end">
        <DeleteFormButton formId={form.id} redirectTo="/dashboard/forms" />
      </div>
    </>
  )
}
