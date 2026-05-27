
import { auth } from "@/auth"
import { deleteForm, getForm } from "@/lib/forms"
import { NextResponse } from "next/server"

// API route to handle GET and DELETE requests for a specific form by its ID. This route is protected by authentication, so only authenticated users can access it.
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> } ) {
    const session = await auth()

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const form = await getForm(id)

    if (!form) {
        return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    if (form.userId !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json(form)
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const form = await getForm(id)

    if (!form) {
        return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    if (form.userId !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await deleteForm(id)
    return NextResponse.json({ message: "Form deleted successfully" })
}