
import { createResponse, getPublicForm } from "@/lib/forms"
import { NextResponse } from "next/server"

const MAX_LENGTH = 2000

// Public API route: anyone with the link can send anonymous feedback, no login needed.
// That is why we validate everything carefully and return only what the sender needs.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const form = await getPublicForm(id)
    if (!form) {
        return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    const body = await request.json().catch(() => null)
    const content = typeof body?.content === "string" ? body.content.trim() : ""

    if (!content) {
        return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    if (content.length > MAX_LENGTH) {
        return NextResponse.json({ error: `Content max ${MAX_LENGTH} characters` }, { status: 400 })
    }

    const response = await createResponse(id, content)
    return NextResponse.json(response, { status: 201 })
}
