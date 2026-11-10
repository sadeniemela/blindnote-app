
import { createResponse, getPublicForm } from "@/lib/forms"
import { DEMO_FORM_ID, ensureDemoForm } from "@/lib/demo"
import { LIMITS, parseAnswers } from "@/lib/questions"
import { RULES, hashedIp, rateLimit } from "@/lib/rate-limit"
import { NextResponse } from "next/server"

// Public API route: anyone with the link can send anonymous feedback, no login needed.
// That is why we validate everything carefully and return only what the sender needs.
//
// Body for forms with questions:  { "answers": [{ "questionId": "...", "value": "4" }] }
// Body for older one question forms: { "content": "text" }
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    // The landing page demo uses a real form. Create it the first time someone tries the demo.
    if (id === DEMO_FORM_ID) {
        await ensureDemoForm()
    }

    const form = await getPublicForm(id)
    if (!form) {
        return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    // At most a few answers per visitor per form. The IP is only used as a hash for this counter.
    const { ok } = await rateLimit(`answer:${await hashedIp()}:${id}`, RULES.answer)
    if (!ok) {
        return NextResponse.json({ error: "Too many answers, try again later" }, { status: 429 })
    }

    const body = await request.json().catch(() => null)

    // Form with questions: check every answer against its question type
    if (form.questions.length > 0) {
        const parsed = parseAnswers(form.questions, body?.answers)
        if (!parsed.ok) {
            return NextResponse.json({ error: parsed.error }, { status: 400 })
        }
        const response = await createResponse(id, { answers: parsed.data })
        return NextResponse.json(response, { status: 201 })
    }

    // Older form with a single open question
    const content = typeof body?.content === "string" ? body.content.trim() : ""

    if (!content) {
        return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    if (content.length > LIMITS.text) {
        return NextResponse.json({ error: `Content max ${LIMITS.text} characters` }, { status: 400 })
    }

    const response = await createResponse(id, { content })
    return NextResponse.json(response, { status: 201 })
}
