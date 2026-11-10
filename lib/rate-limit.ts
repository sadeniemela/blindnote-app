
import { createHash } from "node:crypto"
import { headers } from "next/headers"
import { prisma } from "./db"

// The limits in one place, so they are easy to read and change.
export const RULES = {
  // Login codes sent to one email address
  sendCode: { limit: 3, windowSeconds: 10 * 60 },
  // Login codes sent from one IP address, to stop one person spamming many addresses
  sendCodeIp: { limit: 10, windowSeconds: 60 * 60 },
  // Guesses of the 6 digit code for one email address. 5 guesses out of a million codes.
  verifyCode: { limit: 5, windowSeconds: 10 * 60 },
  // Answers from one IP address to one form
  answer: { limit: 10, windowSeconds: 10 * 60 },
}

type Rule = { limit: number; windowSeconds: number }

// Counts one attempt for key and tells if it is still allowed.
//
// Why the database and not a variable in memory: on Vercel every request may run on a
// different server instance, so a counter in memory would be forgotten. The SQL below is
// one atomic statement: two requests at the same moment can not both read the old count.
export async function rateLimit(key: string, rule: Rule): Promise<{ ok: boolean }> {
  const rows = await prisma.$queryRaw<{ count: number }[]>`
    INSERT INTO "RateLimit" ("key", "count", "windowStart")
    VALUES (${key}, 1, NOW())
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE WHEN "RateLimit"."windowStart" < NOW() - make_interval(secs => ${rule.windowSeconds}::float8) THEN 1 ELSE "RateLimit"."count" + 1 END,
      "windowStart" = CASE WHEN "RateLimit"."windowStart" < NOW() - make_interval(secs => ${rule.windowSeconds}::float8) THEN NOW() ELSE "RateLimit"."windowStart" END
    RETURNING "count"
  `

  // Now and then remove old counters so the table stays small
  if (Math.random() < 0.02) {
    await prisma.$executeRaw`DELETE FROM "RateLimit" WHERE "windowStart" < NOW() - INTERVAL '1 day'`
  }

  return { ok: Number(rows[0]?.count ?? 0) <= rule.limit }
}

// The visitor's IP address as a one way hash. We never store the IP itself, and the
// hash can not be turned back into an IP or linked to any answer.
export async function hashedIp(): Promise<string> {
  const h = await headers()
  // Vercel and most proxies put the real client IP first in x-forwarded-for
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown"
  return createHash("sha256").update(`${ip}${process.env.AUTH_SECRET}`).digest("hex").slice(0, 32)
}
