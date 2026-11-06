import NextAuth from "next-auth"
import Resend from "next-auth/providers/resend"
import { PrismaAdapter } from "@auth/prisma-adapter"
// Use the shared Prisma client so the app keeps only one database connection pool
import { prisma } from "@/lib/db"

// Configure NextAuth with providers and Prisma adapter
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    // Resend provider for email authentication (magic link)
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: "onboarding@resend.dev"
    })
  ],
  // Pages configuration to specify custom sign-in page
   pages: {
    signIn: "/login"
  }
})