"use server"

import { cookies } from "next/headers"
import { LOCALE_COOKIE } from "@/lib/i18n"
import { LOCALES, type Locale } from "@/lib/i18n/dictionaries"

// Saves the chosen language for a year. The page then re-renders in that language.
export async function setLocale(locale: Locale) {
  if (!LOCALES.includes(locale)) return
  ;(await cookies()).set(LOCALE_COOKIE, locale, { maxAge: 60 * 60 * 24 * 365, path: "/", sameSite: "lax" })
}
