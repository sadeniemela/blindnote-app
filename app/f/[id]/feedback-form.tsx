"use client"

import { useState } from "react"
import { fieldLabelClass, inputClass, primaryButtonClass } from "../../common/ui"
import { LIMITS } from "@/lib/questions"
import type { Dictionary } from "@/lib/i18n/dictionaries"

type Question = { id: string; type: string; label: string; options: string[] }

// Five clickable stars. Clicking the selected star again clears the rating.
function Stars({ value, onChange, label, starsWord }: { value: string; onChange: (v: string) => void; label: string; starsWord: string }) {
  const selected = Number(value) || 0
  const [hover, setHover] = useState(0)
  const shown = hover || selected

  return (
    <div role="radiogroup" aria-label={label} className="flex gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={selected === n}
          aria-label={`${n} ${starsWord}`}
          onClick={() => onChange(selected === n ? "" : String(n))}
          onMouseEnter={() => setHover(n)}
          className={`text-5xl sm:text-6xl leading-none transition-colors ${
            n <= shown ? "text-black dark:text-white" : "text-neutral-200 dark:text-neutral-800"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

// Sends the anonymous answers to the public API and shows a thank you message.
// Forms made before questions existed have no questions: then we show one open text field.
export default function FeedbackForm({ formId, questions, t }: { formId: string; questions: Question[]; t: Dictionary["feedback"] }) {
  // Answers keyed by question id, for example { "abc": "4", "def": "Great sprint" }
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [content, setContent] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle")
  const [error, setError] = useState<string | null>(null)

  const setAnswer = (id: string, value: string) => setAnswers((a) => ({ ...a, [id]: value }))
  const legacy = questions.length === 0
  const hasSomething = legacy ? content.trim() !== "" : Object.values(answers).some((v) => v.trim() !== "")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setStatus("sending")

    const body = legacy
      ? { content }
      : { answers: Object.entries(answers).filter(([, v]) => v.trim()).map(([questionId, value]) => ({ questionId, value })) }

    const res = await fetch(`/api/forms/${formId}/responses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      // 429 = too many requests. Show our own translated text for it.
      setError(res.status === 429 ? t.tooMany : data.error ?? t.error)
      setStatus("idle")
      return
    }

    setStatus("sent")
  }

  if (status === "sent") {
    return (
      <div className="border-t border-black dark:border-white pt-10">
        <p className="font-heading font-black uppercase text-4xl sm:text-6xl tracking-tighter leading-[0.9]">{t.thanks}</p>
        <p className="text-lg text-neutral-500 mt-4">{t.sent}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {legacy ? (
        <label className="flex flex-col gap-2">
          <span className={fieldLabelClass}>{t.answerLabel}</span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            maxLength={LIMITS.text}
            placeholder={t.placeholder}
            className={inputClass + " !text-xl resize-none"}
          />
        </label>
      ) : (
        <>
          {questions.length > 1 && <p className="text-sm text-neutral-500">{t.optional}</p>}
          <ol className="border-t border-black dark:border-white">
            {questions.map((q, i) => (
              <li key={q.id} className="py-10 border-b border-black dark:border-white flex flex-col gap-6">
                <div className="flex gap-4">
                  <span className="font-mono text-sm text-neutral-500 pt-1 w-8 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  <p id={`q-${q.id}`} className="font-heading font-black uppercase text-2xl sm:text-3xl tracking-tight break-words">
                    {q.label}
                  </p>
                </div>

                <div className="sm:pl-12">
                  {q.type === "rating" ? (
                    <Stars value={answers[q.id] ?? ""} onChange={(v) => setAnswer(q.id, v)} label={q.label} starsWord={t.stars} />
                  ) : q.type === "choice" ? (
                    <div role="radiogroup" aria-labelledby={`q-${q.id}`} className="flex flex-col gap-3">
                      {q.options.map((option) => {
                        const checked = answers[q.id] === option
                        return (
                          <button
                            key={option}
                            type="button"
                            role="radio"
                            aria-checked={checked}
                            onClick={() => setAnswer(q.id, checked ? "" : option)}
                            className="flex items-center gap-4 text-left text-lg group"
                          >
                            <span
                              className={`w-5 h-5 rounded-full border border-black dark:border-white shrink-0 transition-colors ${
                                checked ? "bg-black dark:bg-white" : "group-hover:bg-neutral-200 dark:group-hover:bg-neutral-800"
                              }`}
                            />
                            {option}
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    <textarea
                      value={answers[q.id] ?? ""}
                      onChange={(e) => setAnswer(q.id, e.target.value)}
                      aria-labelledby={`q-${q.id}`}
                      rows={3}
                      maxLength={LIMITS.text}
                      placeholder={t.placeholder}
                      className={inputClass + " !text-xl resize-none"}
                    />
                  )}
                </div>
              </li>
            ))}
          </ol>
        </>
      )}

      <div className="flex items-center justify-between gap-6">
        <button type="submit" disabled={status === "sending" || !hasSomething} className={primaryButtonClass}>
          {status === "sending" ? t.sending : t.send}
        </button>
        {legacy && <span className="font-mono text-xs text-neutral-500">{content.length} / {LIMITS.text}</span>}
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </form>
  )
}
