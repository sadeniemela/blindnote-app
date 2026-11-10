"use server"

import { signIn } from "@/auth"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { RULES, hashedIp, rateLimit } from "@/lib/rate-limit"

// Cookie that remembers which email the code was sent to, so the user
// only has to type the code on the next page. httpOnly = JavaScript in the
// browser cannot read it, it only travels between the browser and our server.
const EMAIL_COOKIE = "blindnote_login_email"

// Step 1: the user types their email, we send a 6 digit code
export async function requestCode(formData: FormData) {
  const email = String(formData.get("email") ?? "").normalize("NFKC").trim().toLowerCase()

  // Stop someone from flooding one inbox, or many inboxes from one IP
  const ip = await hashedIp()
  const [byEmail, byIp] = await Promise.all([
    rateLimit(`send:${email}`, RULES.sendCode),
    rateLimit(`send-ip:${ip}`, RULES.sendCodeIp),
  ])
  if (!byEmail.ok || !byIp.ok) {
    redirect("/login?error=TooMany")
  }

  const cookieStore = await cookies()
  cookieStore.set(EMAIL_COOKIE, email, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 10 * 60,
    path: "/login",
  })

  // Auth.js creates the code, saves its hash and sends the email,
  // then redirects to the verifyRequest page (/login/verify)
  await signIn("resend", { email, redirectTo: "/dashboard" })
}
