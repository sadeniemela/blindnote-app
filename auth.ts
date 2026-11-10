import NextAuth from "next-auth"
import Resend from "next-auth/providers/resend"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { randomInt } from "node:crypto"
// Use the shared Prisma client so the app keeps only one database connection pool
import { prisma } from "@/lib/db"
import { rateLimit } from "@/lib/rate-limit"

const CODE_MAX_AGE_SECONDS = 10 * 60

// The Prisma adapter throws if it tries to delete a session that is already gone,
// for example when the browser still has an old cookie. That made a correct login
// code fail. deleteMany simply deletes zero rows in that case, so login continues.
const adapter = {
  ...PrismaAdapter(prisma),
  deleteSession: async (sessionToken: string) => {
    await prisma.session.deleteMany({ where: { sessionToken } })
  },
}

// Configure NextAuth with providers and Prisma adapter
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter,
  providers: [
    // Resend provider for email authentication with a one time code
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: "onboarding@resend.dev",
      // A short code is easier to guess than a long link, so it expires fast
      maxAge: CODE_MAX_AGE_SECONDS,
      // Replace the default long random token with a 6 digit code.
      // randomInt comes from Node's crypto module, so the code is cryptographically random.
      generateVerificationToken: () => randomInt(0, 1_000_000).toString().padStart(6, "0"),
      // Send the code instead of a link. Auth.js stores only a hash of the code in the database.
      sendVerificationRequest: async ({ identifier, token, provider }) => {
        // Safety net: the login page already limits code requests, but someone could call
        // the Auth.js sign in endpoint directly. Never send more than 5 codes in 10 minutes.
        const { ok } = await rateLimit(`send-any:${identifier}`, { limit: 5, windowSeconds: 10 * 60 })
        if (!ok) throw new Error("Too many login codes requested")

        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${provider.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: provider.from,
            to: identifier,
            subject: `Blindnote login code: ${token}`,
            text: `Your Blindnote login code is ${token}\n\nThe code is valid for 10 minutes. If you did not try to log in, you can ignore this email.`,
            html: `<p>Your Blindnote login code is</p><p style="font-size:32px;font-weight:bold;letter-spacing:6px">${token}</p><p>The code is valid for 10 minutes. If you did not try to log in, you can ignore this email.</p>`,
          }),
        })

        if (!res.ok) {
          throw new Error("Resend error: " + JSON.stringify(await res.json()))
        }
      },
    })
  ],
  pages: {
    // Custom sign in page
    signIn: "/login",
    // After the code is sent, the user types it here
    verifyRequest: "/login/verify",
    // A wrong or expired code lands here with ?error=Verification
    error: "/login/verify",
  }
})
