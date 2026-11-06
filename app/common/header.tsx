
import Link from "next/link"
import ThemeToggle from "./themetoggle"

// Minimal top bar: small wordmark left, micro label in the middle, actions right
export default function Header() {
  return (
    <header className="w-full absolute top-0 left-0 z-30 px-4 sm:px-8 py-5 text-black dark:text-white">
      <div className="w-full flex items-center justify-between text-xs font-medium uppercase tracking-widest">
        <Link href="/" className="font-heading font-black text-base tracking-tight normal-case">
          Blind<span className="bg-black text-white dark:bg-white dark:text-black px-1">note</span>
        </Link>

        <span className="hidden sm:block text-neutral-500">( Anonymous feedback )</span>

        <div className="flex items-center gap-6">
          <Link href="/login" className="hover:opacity-60 transition-opacity">
            Login
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
