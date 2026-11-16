
import webpush from "web-push"
import { prisma } from "./db"
import { dictionaries, LOCALES, type Locale } from "./i18n/dictionaries"

// VAPID keys prove to Apple, Google and Mozilla push services that the messages
// really come from Blindnote. Without them push is simply turned off.
const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
const privateKey = process.env.VAPID_PRIVATE_KEY
export const pushEnabled = Boolean(publicKey && privateKey)

if (pushEnabled) {
  webpush.setVapidDetails(process.env.VAPID_SUBJECT ?? "https://blindnote.app", publicKey!, privateKey!)
}

// Tells the form owner, on every device they turned notifications on, that a new answer came.
// The notification only says which form and how many answers there are, never what was
// written, so the anonymous text never passes through the phone makers' push servers.
export async function notifyNewAnswer(formId: string) {
  if (!pushEnabled) return

  const form = await prisma.form.findUnique({
    where: { id: formId },
    select: {
      title: true,
      _count: { select: { responses: true } },
      user: { select: { pushSubscriptions: true } },
    },
  })
  if (!form || form.user.pushSubscriptions.length === 0) return

  await Promise.all(
    form.user.pushSubscriptions.map(async (sub) => {
      const locale: Locale = LOCALES.includes(sub.locale as Locale) ? (sub.locale as Locale) : "fi"
      const t = dictionaries[locale].pushMessage

      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify({
            title: `${t.newAnswer}: ${form.title}`,
            body: t.answers(form._count.responses),
            url: `/dashboard/forms/${formId}`,
            tag: `form-${formId}`,
          }),
          { TTL: 60 * 60 * 24 }
        )
      } catch (error) {
        // 404 or 410 means the device unsubscribed or the app was removed: forget it
        const status = (error as { statusCode?: number }).statusCode
        if (status === 404 || status === 410) {
          await prisma.pushSubscription.deleteMany({ where: { endpoint: sub.endpoint } })
        } else {
          console.error("[push] sending failed:", error)
        }
      }
    })
  )
}
