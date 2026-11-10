
import Link from "next/link"
import ThemeToggle from "./themetoggle"
import LanguageToggle from "./language-toggle"
import { getDictionary } from "@/lib/i18n"

// Minimal top bar: small wordmark left, micro label in the middle, actions right
export default async function Header() {
  const { locale, t } = await getDictionary()

  return (
    <header className="w-full absolute top-0 left-0 z-30 px-4 sm:px-8 py-5 text-black dark:text-white">
      <div className="w-full flex items-center justify-between gap-4 text-xs font-medium uppercase tracking-widest">
        <Link href="/" className="font-heading font-black text-base tracking-tight normal-case">
          Blind<span className="bg-black text-white dark:bg-white dark:text-black px-1">note</span>
        </Link>

        <span className="hidden md:block text-neutral-500">( {t.common.anonymousFeedback} )</span>

        <div className="flex items-center gap-5 sm:gap-6">
          <Link href="/login" className="hover:opacity-60 transition-opacity">
            {t.common.login}
          </Link>
          <LanguageToggle locale={locale} label={t.common.language} />
          <ThemeToggle labels={{ dark: t.common.dark, light: t.common.light, toggle: t.common.toggleTheme }} />
        </div>
      </div>
    </header>
  )
}
