
import { auth } from "@/auth"
import { createForm, getForms } from "@/lib/forms"
import { parseQuestions } from "@/lib/questions"
import { NextResponse } from "next/server"

// API route to handle GET and POST requests for forms. This route is protected by authentication, so only authenticated users can access it.
export async function GET() {
    const session = await auth()

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const forms = await getForms(session.user.id)
    return NextResponse.json(forms) 
}

export async function POST(request: Request) {
    const session = await auth()

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Never trust the client: the body may be missing, not JSON, or contain wrong types
    const body = await request.json().catch(() => null)
    const title = typeof body?.title === "string" ? body.title.trim() : ""
    const description = typeof body?.description === "string" ? body.description.trim() : ""

    if (!title) {
        return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    if (title.length > 120 || description.length > 500) {
        return NextResponse.json({ error: "Title max 120 and description max 500 characters" }, { status: 400 })
    }

    // Without questions the form gets one open question, so older API clients keep working
    const parsed = parseQuestions(body?.questions ?? [{ type: "text", label: title, options: [] }])
    if (!parsed.ok) {
        return NextResponse.json({ error: parsed.error }, { status: 400 })
    }

    const form = await createForm(session.user.id, title, description || undefined, parsed.data)
    // 201 Created is the correct status when a new resource was made
    return NextResponse.json(form, { status: 201 })
}