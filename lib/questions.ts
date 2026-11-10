
// Rules for questions and answers. This file has no database code, so both the
// API (server) and the form builder (browser) can import it and use the same limits.

export const QUESTION_TYPES = ["text", "rating", "choice"] as const
export type QuestionType = (typeof QUESTION_TYPES)[number]

export const LIMITS = {
  questions: 20,
  label: 200,
  options: 10,
  option: 80,
  text: 2000,
  ratingMax: 5,
}

export type QuestionInput = { type: QuestionType; label: string; options: string[] }
export type AnswerInput = { questionId: string; value: string }

// Result type: either the cleaned data, or an error message for the API to return
type Result<T> = { ok: true; data: T } | { ok: false; error: string }

const isString = (v: unknown): v is string => typeof v === "string"

// Checks the questions sent when a form is created and returns a cleaned copy
export function parseQuestions(input: unknown): Result<QuestionInput[]> {
  if (!Array.isArray(input) || input.length === 0) {
    return { ok: false, error: "At least one question is required" }
  }
  if (input.length > LIMITS.questions) {
    return { ok: false, error: `Max ${LIMITS.questions} questions` }
  }

  const questions: QuestionInput[] = []
  for (const [i, raw] of input.entries()) {
    const type = raw?.type
    const label = isString(raw?.label) ? raw.label.trim() : ""

    if (!QUESTION_TYPES.includes(type)) {
      return { ok: false, error: `Question ${i + 1}: type must be one of ${QUESTION_TYPES.join(", ")}` }
    }
    if (!label || label.length > LIMITS.label) {
      return { ok: false, error: `Question ${i + 1}: label is required, max ${LIMITS.label} characters` }
    }

    let options: string[] = []
    if (type === "choice") {
      // Trim, drop empty ones and duplicates
      const cleaned = Array.isArray(raw.options) ? raw.options.filter(isString).map((o: string) => o.trim()).filter(Boolean) : []
      options = [...new Set<string>(cleaned)]
      if (options.length < 2 || options.length > LIMITS.options || options.some((o) => o.length > LIMITS.option)) {
        return { ok: false, error: `Question ${i + 1}: a choice question needs 2 to ${LIMITS.options} options, max ${LIMITS.option} characters each` }
      }
    }

    questions.push({ type, label, options })
  }
  return { ok: true, data: questions }
}

type StoredQuestion = { id: string; type: string; options: string[] }

// Checks the answers sent to a form. Every question is optional, but at least one must be answered.
export function parseAnswers(questions: StoredQuestion[], input: unknown): Result<AnswerInput[]> {
  if (!Array.isArray(input)) {
    return { ok: false, error: "answers must be a list" }
  }

  const byId = new Map(questions.map((q) => [q.id, q]))
  const seen = new Set<string>()
  const answers: AnswerInput[] = []

  for (const raw of input) {
    const question = isString(raw?.questionId) ? byId.get(raw.questionId) : undefined
    if (!question) return { ok: false, error: "Unknown questionId" }
    if (seen.has(question.id)) return { ok: false, error: "Each question can be answered once" }
    seen.add(question.id)

    const value = isString(raw?.value) ? raw.value.trim() : String(raw?.value ?? "").trim()
    if (!value) continue // empty answer = skipped question

    if (question.type === "text" && value.length > LIMITS.text) {
      return { ok: false, error: `Text answers max ${LIMITS.text} characters` }
    }
    if (question.type === "rating") {
      const n = Number(value)
      if (!Number.isInteger(n) || n < 1 || n > LIMITS.ratingMax) {
        return { ok: false, error: `Rating must be a whole number from 1 to ${LIMITS.ratingMax}` }
      }
    }
    if (question.type === "choice" && !question.options.includes(value)) {
      return { ok: false, error: "Choice must be one of the options" }
    }

    answers.push({ questionId: question.id, value })
  }

  if (answers.length === 0) {
    return { ok: false, error: "Answer at least one question" }
  }
  return { ok: true, data: answers }
}
