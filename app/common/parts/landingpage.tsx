import Link from "next/link"
import Demo from "./demo"

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

const STEPS = [
  { title: "Ask one question", text: "Create a form in seconds. A title and an optional description is all it needs." },
  { title: "Share one link", text: "Send it in Slack, email or a QR code on the wall. No accounts for the people answering." },
  { title: "Read honest answers", text: "Responses arrive without names, emails or IP addresses. Nothing to trace back." },
]

const SAMPLE_FEEDBACK = [
  "The weekly meeting could be an email",
  "I would love clearer priorities",
  "Onboarding was the best I have had",
  "Please stop scheduling calls at 8am",
  "The new process actually helps",
  "I did not feel heard in the last retro",
]

export default function LandingPage() {
  return (
    <main className="bg-white text-black dark:bg-black dark:text-white">
      {/* HERO: giant wordmark that fills the whole width */}
      <section className="min-h-screen flex flex-col justify-between px-4 sm:px-8 pt-28 pb-8">
        <div className="flex justify-between gap-8">
          <Label>One link. Real answers.</Label>
          <Label>Est. 2026</Label>
        </div>

        <h1 className="font-heading font-black uppercase leading-[0.8] tracking-tighter text-[12.2vw] [font-stretch:125%] select-none">
          <span className="bg-black text-white dark:bg-white dark:text-black px-[0.04em]">Blind</span>
          note
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
          <p className="text-lg sm:text-xl max-w-sm leading-snug">
            Anonymous feedback with the lowest possible barrier. People say more when nobody is watching.
          </p>
          <div className="hidden sm:block" />
          <div className="flex sm:justify-end gap-3">
            <a
              href="#demo"
              className="uppercase text-xs font-medium tracking-widest rounded-full px-6 py-4 bg-black text-white dark:bg-white dark:text-black hover:opacity-80 transition-opacity"
            >
              Try the demo
            </a>
            <Link
              href="/dashboard/forms"
              className="uppercase text-xs font-medium tracking-widest border border-black dark:border-white rounded-full px-6 py-4 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
            >
              Create a form
            </Link>
          </div>
        </div>
      </section>

      {/* MARQUEE: example answers scrolling by */}
      <section className="border-y border-black dark:border-white py-5 overflow-hidden">
        <div className="flex w-max animate-marquee">
          {[...SAMPLE_FEEDBACK, ...SAMPLE_FEEDBACK].map((text, i) => (
            <span key={i} className="font-heading font-bold uppercase text-2xl sm:text-4xl tracking-tight whitespace-nowrap px-8">
              &ldquo;{text}&rdquo; <span className="text-neutral-400">/ anonymous</span>
            </span>
          ))}
        </div>
      </section>

      {/* STATEMENT */}
      <section className="px-4 sm:px-8 py-32 sm:py-48">
        <Label>The idea</Label>
        <p className="mt-8 font-heading font-bold text-4xl sm:text-7xl leading-[1.05] tracking-tight max-w-6xl">
          Most feedback is polite. The useful kind usually comes from <Redacted>someone</Redacted> who knows their name is not attached.
        </p>
      </section>

      {/* HOW IT WORKS: numbered rows */}
      <section className="px-4 sm:px-8 pb-32">
        <Label>How it works</Label>
        <ol className="mt-8 border-t border-black dark:border-white">
          {STEPS.map((step, i) => (
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
      <Demo />

      {/* FINAL CALL TO ACTION, inverted colors */}
      <section className="bg-black text-white dark:bg-white dark:text-black px-4 sm:px-8 py-32 flex flex-col items-start gap-10">
        <p className="text-xs font-medium uppercase tracking-widest opacity-60">( Start )</p>
        <h2 className="font-heading font-black uppercase text-[12vw] sm:text-[9vw] leading-[0.85] tracking-tighter">
          Start from<br />one link.
        </h2>
        <Link
          href="/dashboard/forms"
          className="uppercase text-xs font-medium tracking-widest border border-white dark:border-black rounded-full px-6 py-4 hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-colors"
        >
          Create a form
        </Link>
      </section>

      <footer className="px-4 sm:px-8 py-6 flex justify-between text-xs uppercase tracking-widest text-neutral-500">
        <span>Blindnote</span>
        <span>No names attached.</span>
      </footer>
    </main>
  )
}
