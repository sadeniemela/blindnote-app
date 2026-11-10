"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { fieldLabelClass, inputClass, primaryButtonClass, textLinkClass } from "../../../common/ui"
import { LIMITS, QUESTION_TYPES, type QuestionType } from "@/lib/questions"
import type { Dictionary } from "@/lib/i18n/dictionaries"

// A question while it is being edited. key is only for React, it is not saved.
type Draft = { key: number; type: QuestionType; label: string; options: string[] }

let nextKey = 0
const newQuestion = (type: QuestionType = "text"): Draft => ({
  key: nextKey++,
  type,
  label: "",
  options: type === "choice" ? ["", ""] : [],
})

// Form builder. All questions live in one state array, and every change creates
// a new array instead of changing the old one. That is how React notices the change.
export default function NewFormForm({ t, errorText }: { t: Dictionary["builder"]; errorText: string }) {
  const router = useRouter()
  const [questions, setQuestions] = useState<Draft[]>(() => [newQuestion()])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Small helpers that each return a new array
  const update = (key: number, change: Partial<Draft>) =>
    setQuestions((qs) => qs.map((q) => (q.key === key ? { ...q, ...change } : q)))

  const remove = (key: number) => setQuestions((qs) => qs.filter((q) => q.key !== key))

  const move = (index: number, direction: -1 | 1) =>
    setQuestions((qs) => {
      const target = index + direction
      if (target < 0 || target >= qs.length) return qs
      const copy = [...qs]
      ;[copy[index], copy[target]] = [copy[target], copy[index]]
      return copy
    })

  const changeType = (q: Draft, type: QuestionType) =>
    update(q.key, { type, options: type === "choice" && q.options.length < 2 ? ["", ""] : q.options })

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(event.currentTarget)

    const res = await fetch("/api/forms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.get("title"),
        description: formData.get("description"),
        // Drop the React key, send only what the API expects
        questions: questions.map(({ type, label, options }) => ({ type, label, options: type === "choice" ? options : [] })),
      }),
    })

    if (!res.ok) {
      // The API answers with { error: "..." } when something is wrong
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? errorText)
      setLoading(false)
      return
    }

    const form = await res.json()
    router.push(`/dashboard/forms/${form.id}`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-12">
      <label className="flex flex-col gap-2">
        <span className={fieldLabelClass}>{t.formTitle}</span>
        <input name="title" required maxLength={120} placeholder={t.formTitlePlaceholder} className={inputClass} />
      </label>

      <label className="flex flex-col gap-2">
        <span className={fieldLabelClass}>{t.description}</span>
        <textarea
          name="description"
          rows={2}
          maxLength={500}
          placeholder={t.descriptionPlaceholder}
          className={inputClass + " !text-xl resize-none"}
        />
      </label>

      <div>
        <p className={fieldLabelClass}>( {t.questionsLabel} )</p>
        <ol className="mt-6 border-t border-black dark:border-white">
          {questions.map((q, i) => (
            <li key={q.key} className="py-8 border-b border-black dark:border-white grid grid-cols-[2.5rem_1fr] sm:grid-cols-[4rem_1fr] gap-x-4">
              <span className="font-mono text-sm text-neutral-500 pt-1">{String(i + 1).padStart(2, "0")}</span>

              <div className="flex flex-col gap-6 min-w-0">
                {/* Question type as three pill buttons */}
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t.question}>
                  {QUESTION_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      role="radio"
                      aria-checked={q.type === type}
                      onClick={() => changeType(q, type)}
                      className={`uppercase text-[11px] font-medium tracking-widest rounded-full px-4 py-2 border transition-colors ${
                        q.type === type
                          ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white"
                          : "border-neutral-300 dark:border-neutral-700 text-neutral-500 hover:border-black dark:hover:border-white"
                      }`}
                    >
                      {t.types[type]}
                    </button>
                  ))}
                </div>

                <label className="flex flex-col gap-2">
                  <span className={fieldLabelClass}>{t.question}</span>
                  <input
                    value={q.label}
                    onChange={(e) => update(q.key, { label: e.target.value })}
                    required
                    maxLength={LIMITS.label}
                    placeholder={t.questionPlaceholder}
                    className={inputClass + " !text-xl sm:!text-2xl"}
                  />
                </label>

                {/* Preview of the stars, so the owner sees what people will get */}
                {q.type === "rating" && (
                  <p aria-hidden className="text-3xl tracking-widest text-neutral-300 dark:text-neutral-700">
                    {"★★★★★"}
                  </p>
                )}

                {q.type === "choice" && (
                  <div className="flex flex-col gap-3">
                    {q.options.map((option, oi) => (
                      <div key={oi} className="flex items-center gap-4">
                        <span aria-hidden className="w-4 h-4 rounded-full border border-black dark:border-white shrink-0" />
                        <input
                          value={option}
                          onChange={(e) =>
                            update(q.key, { options: q.options.map((o, j) => (j === oi ? e.target.value : o)) })
                          }
                          required
                          maxLength={LIMITS.option}
                          placeholder={`${t.option} ${oi + 1}`}
                          aria-label={`${t.option} ${oi + 1}`}
                          className={inputClass + " !text-lg !py-2"}
                        />
                        {q.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => update(q.key, { options: q.options.filter((_, j) => j !== oi) })}
                            className={textLinkClass + " text-neutral-500"}
                            aria-label={t.removeOption}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    {q.options.length < LIMITS.options && (
                      <button
                        type="button"
                        onClick={() => update(q.key, { options: [...q.options, ""] })}
                        className={textLinkClass + " self-start mt-2"}
                      >
                        + {t.addOption}
                      </button>
                    )}
                  </div>
                )}

                {/* Order and remove */}
                <div className="flex items-center gap-5 text-neutral-500">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className={textLinkClass + " disabled:opacity-30"}>
                    {t.moveUp}
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === questions.length - 1}
                    className={textLinkClass + " disabled:opacity-30"}
                  >
                    {t.moveDown}
                  </button>
                  {questions.length > 1 && (
                    <button type="button" onClick={() => remove(q.key)} className={textLinkClass + " hover:!text-red-600"}>
                      {t.remove}
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>

        {questions.length < LIMITS.questions && (
          <div className="flex flex-wrap gap-3 mt-6">
            {QUESTION_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setQuestions((qs) => [...qs, newQuestion(type)])}
                className="uppercase text-[11px] font-medium tracking-widest rounded-full px-4 py-2 border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
              >
                + {t.types[type]}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <button type="submit" disabled={loading} className={primaryButtonClass + " self-start"}>
        {loading ? t.creating : t.create}
      </button>
    </form>
  )
}
