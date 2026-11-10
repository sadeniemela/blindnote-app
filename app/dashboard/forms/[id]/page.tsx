
import { auth } from "@/auth"
import { getForm } from "@/lib/forms"
import { getDictionary } from "@/lib/i18n"
import Link from "next/link"
import { notFound } from "next/navigation"
import CopyLink from "../../../common/copy-link"
import DeleteFormButton from "../delete-form-button"
import { Label, Title, buttonClass, textLinkClass } from "../../../common/ui"

type Answer = { value: string; responseId: string; createdAt: Date }

// A horizontal bar for ratings and choices. width is a percentage from 0 to 100.
function Bar({ label, count, percent }: { label: string; count: number; percent: number }) {
  return (
    <div className="grid grid-cols-[minmax(0,10rem)_1fr_3rem] items-center gap-4">
      <span className="text-sm truncate">{label}</span>
      <span className="h-3 bg-neutral-200 dark:bg-neutral-800">
        <span className="block h-full bg-black dark:bg-white" style={{ width: `${percent}%` }} />
      </span>
      <span className="font-mono text-xs text-neutral-500 text-right">{count}</span>
    </div>
  )
}

export default async function FormPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  const { id } = await params
  const form = await getForm(id)
  const { locale, t } = await getDictionary()

  // Same answer for "does not exist" and "not yours", so nobody can probe which ids exist
  if (!form || form.userId !== session?.user?.id) {
    notFound()
  }

  const dateFormat = new Intl.DateTimeFormat(locale === "fi" ? "fi-FI" : "en-GB", { dateStyle: "short", timeStyle: "short" })
  const count = form.responses.length

  // Group all answers by question, so each question can show its own summary
  const answersByQuestion = new Map<string, Answer[]>()
  for (const response of form.responses) {
    for (const answer of response.answers) {
      const list = answersByQuestion.get(answer.questionId) ?? []
      list.push({ value: answer.value, responseId: response.id, createdAt: response.createdAt })
      answersByQuestion.set(answer.questionId, list)
    }
  }

  return (
    <>
      <Link href="/dashboard/forms" className={textLinkClass}>
        {t.common.back}
      </Link>

      <div className="mt-12 grid lg:grid-cols-[1fr_auto] gap-10 items-end mb-16">
        <div>
          <Label>{t.form.label}</Label>
          <Title className="mt-6">{form.title}</Title>
          {form.description && <p className="text-lg text-neutral-500 mt-6 max-w-2xl">{form.description}</p>}
        </div>
        <p className="font-heading font-black text-7xl sm:text-9xl leading-none lg:text-right">
          {count}
          <span className="block text-xs font-sans font-medium uppercase tracking-widest text-neutral-500 mt-2">
            {t.form.answers(count)}
          </span>
        </p>
      </div>

      {/* Share box: the public link people answer through */}
      <div className="border border-black dark:border-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-20">
        <div className="min-w-0">
          <Label>{t.form.shareLabel}</Label>
          <p className="font-mono text-sm mt-3 truncate">/f/{form.id}</p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <CopyLink path={`/f/${form.id}`} labels={{ copy: t.common.copyLink, copied: t.common.copied }} className={buttonClass} />
          <Link href={`/f/${form.id}`} target="_blank" className={textLinkClass}>
            {t.common.open}
          </Link>
        </div>
      </div>

      {count === 0 ? (
        <div className="border-t border-black dark:border-white py-20">
          <p className="font-heading font-black uppercase text-3xl sm:text-5xl tracking-tight">{t.form.emptyTitle}</p>
          <p className="text-neutral-500 mt-4 max-w-md">{t.form.emptyText}</p>
        </div>
      ) : form.questions.length === 0 ? (
        // Older form with one open question: plain list of texts
        <>
          <Label>{t.form.allLabel}</Label>
          <ol className="border-t border-black dark:border-white mt-6">
            {form.responses.map((response, i) => (
              <li
                key={response.id}
                className="grid grid-cols-[2.5rem_1fr] sm:grid-cols-[5rem_1fr_auto] gap-x-4 gap-y-2 py-8 border-b border-black dark:border-white"
              >
                <span className="font-mono text-sm text-neutral-500 pt-1">{String(count - i).padStart(2, "0")}</span>
                <p className="text-xl sm:text-2xl leading-snug whitespace-pre-wrap break-words">{response.content}</p>
                <time dateTime={response.createdAt.toISOString()} className="col-start-2 sm:col-start-3 font-mono text-xs text-neutral-500 sm:pt-2">
                  {dateFormat.format(response.createdAt)}
                </time>
              </li>
            ))}
          </ol>
        </>
      ) : (
        <>
          <Label>{t.form.summaryLabel}</Label>
          <ol className="border-t border-black dark:border-white mt-6">
            {form.questions.map((question, qi) => {
              const answers = answersByQuestion.get(question.id) ?? []

              return (
                <li key={question.id} className="grid grid-cols-[2.5rem_1fr] sm:grid-cols-[5rem_1fr] gap-x-4 py-10 border-b border-black dark:border-white">
                  <span className="font-mono text-sm text-neutral-500 pt-1">{String(qi + 1).padStart(2, "0")}</span>
                  <div className="min-w-0">
                    <h2 className="font-heading font-black uppercase text-2xl sm:text-3xl tracking-tight break-words">{question.label}</h2>

                    {answers.length === 0 ? (
                      <p className="text-neutral-500 mt-4">{t.form.noAnswers}</p>
                    ) : question.type === "rating" ? (
                      <RatingSummary answers={answers} t={t.form} />
                    ) : question.type === "choice" ? (
                      <div className="mt-6 flex flex-col gap-3 max-w-2xl">
                        {question.options.map((option) => {
                          const n = answers.filter((a) => a.value === option).length
                          return <Bar key={option} label={option} count={n} percent={(n / answers.length) * 100} />
                        })}
                      </div>
                    ) : (
                      <ul className="mt-6 flex flex-col divide-y divide-neutral-200 dark:divide-neutral-800">
                        {answers.map((a) => (
                          <li key={a.responseId} className="py-4 flex flex-col sm:flex-row sm:justify-between gap-2">
                            <p className="text-lg leading-snug whitespace-pre-wrap break-words min-w-0">{a.value}</p>
                            <time dateTime={a.createdAt.toISOString()} className="font-mono text-xs text-neutral-500 shrink-0 sm:pt-1">
                              {dateFormat.format(a.createdAt)}
                            </time>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>
        </>
      )}

      <div className="mt-20 flex justify-end">
        <DeleteFormButton
          formId={form.id}
          redirectTo="/dashboard/forms"
          labels={{ delete: t.common.deleteForm, deleting: t.common.deleting, confirm: t.common.confirmDelete }}
        />
      </div>
    </>
  )
}

// Average as a big number plus how many people gave each star count
function RatingSummary({ answers, t }: { answers: Answer[]; t: { average: string; ratings: (n: number) => string } }) {
  const values = answers.map((a) => Number(a.value))
  const average = values.reduce((sum, v) => sum + v, 0) / values.length

  return (
    <div className="mt-6 grid sm:grid-cols-[auto_1fr] gap-8 items-start max-w-3xl">
      <div>
        <p className="font-heading font-black text-6xl leading-none">
          {average.toFixed(1)}
          <span className="text-2xl text-neutral-400"> / 5</span>
        </p>
        <p className="text-xs uppercase tracking-widest text-neutral-500 mt-2">
          {t.average} · {t.ratings(values.length)}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {[5, 4, 3, 2, 1].map((star) => {
          const n = values.filter((v) => v === star).length
          return <Bar key={star} label={"★".repeat(star)} count={n} percent={(n / values.length) * 100} />
        })}
      </div>
    </div>
  )
}
