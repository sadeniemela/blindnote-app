
import { auth } from "@/auth"
import { getForms } from "@/lib/forms"
import { getDictionary } from "@/lib/i18n"
import Link from "next/link"
import DeleteFormButton from "./delete-form-button"
import CopyLink from "../../common/copy-link"
import { Label, Title, primaryButtonClass, textLinkClass } from "../../common/ui"

export default async function FormsPage() {
  // The layout already checked the login, so the session exists here
  const session = await auth()
  const forms = await getForms(session!.user!.id!)
  const { t } = await getDictionary()

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-12">
        <div>
          <Label>{t.forms.count(forms.length)}</Label>
          <Title className="mt-6">{t.forms.title}</Title>
        </div>
        <Link href="/dashboard/forms/new" className={primaryButtonClass + " self-start sm:self-auto"}>
          {t.forms.newForm}
        </Link>
      </div>

      {forms.length === 0 ? (
        <div className="border-t border-black dark:border-white py-24">
          <p className="font-heading font-black uppercase text-3xl sm:text-5xl tracking-tight">{t.forms.emptyTitle}</p>
          <p className="text-neutral-500 mt-4 max-w-md">{t.forms.emptyText}</p>
        </div>
      ) : (
        <ol className="border-t border-black dark:border-white">
          {forms.map((form, i) => (
            <li
              key={form.id}
              className="grid grid-cols-[2.5rem_1fr] sm:grid-cols-[5rem_1fr_auto] gap-x-4 gap-y-4 py-8 border-b border-black dark:border-white"
            >
              <span className="font-mono text-sm text-neutral-500 pt-1">{String(i + 1).padStart(2, "0")}</span>

              <div className="min-w-0">
                <Link
                  href={`/dashboard/forms/${form.id}`}
                  className="font-heading font-black uppercase text-2xl sm:text-4xl tracking-tight hover:opacity-60 transition-opacity break-words"
                >
                  {form.title}
                </Link>
                {form.description && <p className="text-neutral-500 mt-2 max-w-xl">{form.description}</p>}
                {form._count.questions > 0 && (
                  <p className="font-mono text-xs text-neutral-500 mt-3">{t.forms.questions(form._count.questions)}</p>
                )}
              </div>

              <div className="col-start-2 sm:col-start-3 flex sm:flex-col sm:items-end justify-between gap-4">
                <p className="font-heading font-black text-3xl sm:text-5xl leading-none">
                  {form._count.responses}
                  <span className="block text-xs font-sans font-medium uppercase tracking-widest text-neutral-500 mt-1">
                    {t.forms.answers(form._count.responses)}
                  </span>
                </p>
                <div className="flex items-center gap-5">
                  <CopyLink path={`/f/${form.id}`} labels={{ copy: t.common.copyLink, copied: t.common.copied }} />
                  <Link href={`/f/${form.id}`} target="_blank" className={textLinkClass}>
                    {t.common.open}
                  </Link>
                  <DeleteFormButton
                    formId={form.id}
                    labels={{ delete: t.common.delete, deleting: t.common.deleting, confirm: t.common.confirmDelete }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </>
  )
}
