import Link from "next/link"
import Demo from "./demo"
import { getDictionary } from "@/lib/i18n"

// Small uppercase label in parentheses, used to name each section
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">
      ( {children} )
    </p>
  )
}

// Text hidden behind a black bar, like a redacted document.
// Hovering reveals what is underneath.
function Redacted({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block group">
      <span>{children}</span>
      <span
        aria-hidden
        className="absolute inset-x-0 top-[0.12em] bottom-[0.08em] bg-black dark:bg-white origin-left transition-transform duration-500 group-hover:scale-x-0"
      />
    </span>
  )
}

export default async function LandingPage() {
  const { t } = await getDictionary()
  const l = t.landing

  return (
    <main className="bg-white text-black dark:bg-black dark:text-white">
      {/* HERO: giant wordmark that fills the whole width */}
      <section className="min-h-screen flex flex-col justify-between px-4 sm:px-8 pt-28 pb-8">
        <div className="flex justify-between gap-8">
          <Label>{l.tagline}</Label>
          <Label>{l.est}</Label>
        </div>

        <h1 className="font-heading font-black uppercase leading-[0.8] tracking-tighter text-[12.2vw] [font-stretch:125%] select-none">
          <span className="bg-black text-white dark:bg-white dark:text-black px-[0.04em]">Blind</span>
          note
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
          <p className="text-lg sm:text-xl max-w-sm leading-snug">
            {l.intro}
          </p>
          <div className="hidden sm:block" />
          <div className="flex sm:justify-end gap-3">
            <a
              href="#demo"
              className="uppercase text-xs font-medium tracking-widest rounded-full px-6 py-4 bg-black text-white dark:bg-white dark:text-black hover:opacity-80 transition-opacity"
            >
              {l.tryDemo}
            </a>
            <Link
              href="/dashboard/forms"
              className="uppercase text-xs font-medium tracking-widest border border-black dark:border-white rounded-full px-6 py-4 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
            >
              {l.createForm}
            </Link>
          </div>
        </div>
      </section>

      {/* MARQUEE: example answers scrolling by */}
      <section className="border-y border-black dark:border-white py-5 overflow-hidden">
        <div className="flex w-max animate-marquee">
          {[...l.samples, ...l.samples].map((text, i) => (
            <span key={i} className="font-heading font-bold uppercase text-2xl sm:text-4xl tracking-tight whitespace-nowrap px-8">
              &ldquo;{text}&rdquo; <span className="text-neutral-400">/ {t.common.anonymous}</span>
            </span>
          ))}
        </div>
      </section>

      {/* STATEMENT */}
      <section className="px-4 sm:px-8 py-32 sm:py-48">
        <Label>{l.ideaLabel}</Label>
        <p className="mt-8 font-heading font-bold text-4xl sm:text-7xl leading-[1.05] tracking-tight max-w-6xl">
          {l.ideaStart} <Redacted>{l.ideaHidden}</Redacted> {l.ideaEnd}
        </p>
      </section>

      {/* HOW IT WORKS: numbered rows */}
      <section className="px-4 sm:px-8 pb-32">
        <Label>{l.howLabel}</Label>
        <ol className="mt-8 border-t border-black dark:border-white">
          {l.steps.map((step, i) => (
            <li
              key={step.title}
              className="grid grid-cols-[3rem_1fr] sm:grid-cols-[8rem_1fr_1fr] gap-4 py-8 border-b border-black dark:border-white"
            >
              <span className="font-mono text-sm text-neutral-500">0{i + 1}</span>
              <h3 className="font-heading font-black uppercase text-3xl sm:text-5xl tracking-tight">{step.title}</h3>
              <p className="col-start-2 sm:col-start-3 text-neutral-500 max-w-md sm:pt-2">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* DEMO: try the real API without an account */}
      <Demo t={t.demo} />

      {/* FINAL CALL TO ACTION, inverted colors */}
      <section className="bg-black text-white dark:bg-white dark:text-black px-4 sm:px-8 py-32 flex flex-col items-start gap-10">
        <p className="text-xs font-medium uppercase tracking-widest opacity-60">( {l.startLabel} )</p>
        <h2 className="font-heading font-black uppercase text-[12vw] sm:text-[9vw] leading-[0.85] tracking-tighter">
          {l.startTitle1}<br />{l.startTitle2}
        </h2>
        <Link
          href="/dashboard/forms"
          className="uppercase text-xs font-medium tracking-widest border border-white dark:border-black rounded-full px-6 py-4 hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-colors"
        >
          {l.createForm}
        </Link>
      </section>

      <footer className="px-4 sm:px-8 py-6 flex justify-between text-xs uppercase tracking-widest text-neutral-500">
        <span>Blindnote</span>
        <span>{l.footer}</span>
      </footer>
    </main>
  )
}
