
import { auth } from "@/auth"
import { createForm, getForms } from "@/lib/forms"
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

    const body = await request.json()

    if (!body.title) {
        return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const form = await createForm(session.user.id, body.title, body.description)
    return NextResponse.json(form)
}