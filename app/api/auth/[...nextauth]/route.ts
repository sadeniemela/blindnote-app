
import { handlers } from "@/auth"
import { RULES, rateLimit } from "@/lib/rate-limit"
import { NextResponse, type NextRequest } from "next/server"

export const { POST } = handlers

// Every login code check goes through this GET. Before Auth.js compares the code we
// count the attempt, so nobody can try all million codes for one email address.
export async function GET(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  if (pathname.endsWith("/callback/resend")) {
    const email = searchParams.get("email")?.toLowerCase() ?? ""
    const { ok } = await rateLimit(`verify:${email}`, RULES.verifyCode)
    if (!ok) {
      return NextResponse.redirect(new URL("/login/verify?error=TooMany", request.url))
    }
  }

  return handlers.GET(request)
}
