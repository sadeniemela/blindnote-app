
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { getLocale } from "@/lib/i18n"
import { NextResponse } from "next/server"

const isString = (v: unknown): v is string => typeof v === "string" && v.length > 0 && v.length < 1000

// Saves the push subscription of the device the logged in user is using.
// Body: the PushSubscription the browser created, as JSON: { endpoint, keys: { p256dh, auth } }
export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const endpoint = body?.endpoint
  const p256dh = body?.keys?.p256dh
  const authKey = body?.keys?.auth

  // Only accept https push service addresses, so nobody can make our server call random URLs
  if (!isString(endpoint) || !endpoint.startsWith("https://") || !isString(p256dh) || !isString(authKey)) {
    return NextResponse.json({ error: "Invalid subscription" }, { status: 400 })
  }

  const locale = await getLocale()

  // upsert: the same device subscribing again just updates its keys
  await prisma.pushSubscription.upsert({
    where: { endpoint },
    update: { userId: session.user.id, p256dh, auth: authKey, locale },
    create: { userId: session.user.id, endpoint, p256dh, auth: authKey, locale },
  })

  return NextResponse.json({ ok: true }, { status: 201 })
}

// Removes the subscription of this device. Body: { endpoint }
export async function DELETE(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  if (!isString(body?.endpoint)) {
    return NextResponse.json({ error: "endpoint is required" }, { status: 400 })
  }

  // Only the owner's own subscription can be removed
  await prisma.pushSubscription.deleteMany({ where: { endpoint: body.endpoint, userId: session.user.id } })
  return NextResponse.json({ ok: true })
}
