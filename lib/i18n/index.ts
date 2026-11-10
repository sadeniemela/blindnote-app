
import { cookies, headers } from "next/headers"
import { DEFAULT_LOCALE, LOCALES, dictionaries, type Locale } from "./dictionaries"

export const LOCALE_COOKIE = "blindnote_locale"

// Which language to show: the user's own choice (cookie) first,
// then the browser's language, then Finnish.
export async function getLocale(): Promise<Locale> {
  const saved = (await cookies()).get(LOCALE_COOKIE)?.value
  if (LOCALES.includes(saved as Locale)) return saved as Locale

  const browser = (await headers()).get("accept-language")?.slice(0, 2).toLowerCase()
  if (LOCALES.includes(browser as Locale)) return browser as Locale

  return DEFAULT_LOCALE
}

// Returns all texts in the current language. Used in Server Components.
export async function getDictionary() {
  const locale = await getLocale()
  return { locale, t: dictionaries[locale] }
}

export type { Locale, Dictionary } from "./dictionaries"
