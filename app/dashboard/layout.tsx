
import { auth, signOut } from "@/auth"
import Link from "next/link"
import { redirect } from "next/navigation"
import ThemeToggle from "../common/themetoggle"
import { Page } from "../common/ui"
import LanguageToggle from "../common/language-toggle"
import { getDictionary } from "@/lib/i18n"
import type { Metadata } from "next"

// Private pages: tell search engines not to index them
export const metadata: Metadata = { title: "Dashboard", robots: { index: false, follow: false } }

// Shared layout for every page under /dashboard. Because the login check is here,
// no dashboard page can be shown to someone who is not logged in.
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const { locale, t } = await getDictionary()

  return (
    <Page>
      <header className="py-5 flex items-center justify-between gap-4 text-xs font-medium uppercase tracking-widest border-b border-black dark:border-white">
        <Link href="/" className="font-heading font-black text-base tracking-tight normal-case">
          Blind<span className="bg-black text-white dark:bg-white dark:text-black px-1">note</span>
        </Link>

        <span className="hidden md:block text-neutral-500 normal-case tracking-normal">{session.user.email}</span>

        <nav className="flex items-center gap-5 sm:gap-6">
          <Link href="/dashboard/forms" className="hover:opacity-60 transition-opacity">
            {t.common.forms}
          </Link>
          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/" })
            }}
          >
            <button type="submit" className="uppercase tracking-widest hover:opacity-60 transition-opacity">
              {t.common.logout}
            </button>
          </form>
          <LanguageToggle locale={locale} label={t.common.language} />
          <ThemeToggle labels={{ dark: t.common.dark, light: t.common.light, toggle: t.common.toggleTheme }} />
        </nav>
      </header>

      <div className="py-12 sm:py-16">{children}</div>
    </Page>
  )
}
