// Shared building blocks for the Blindnote look: monochrome, big type, small labels.
// Keeping them in one place means every page looks the same and changes are made once.

// Small uppercase label in parentheses, used to name sections
export function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-xs font-medium uppercase tracking-widest text-neutral-500 ${className}`}>
      ( {children} )
    </p>
  )
}

// Big display heading
export function Title({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h1 className={`font-heading font-black uppercase leading-[0.9] tracking-tighter [word-spacing:0.15em] text-5xl sm:text-7xl break-words ${className}`}>
      {children}
    </h1>
  )
}

// Rounded outline button. Fills with black (white in dark mode) on hover.
export const buttonClass =
  "inline-flex items-center justify-center uppercase text-xs font-medium tracking-widest border border-black dark:border-white rounded-full px-6 py-4 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors disabled:opacity-40 disabled:pointer-events-none"

// Solid version for the main action on a page
export const primaryButtonClass =
  "inline-flex items-center justify-center uppercase text-xs font-medium tracking-widest rounded-full px-6 py-4 bg-black text-white dark:bg-white dark:text-black hover:opacity-80 transition-opacity disabled:opacity-40 disabled:pointer-events-none"

// Small text link style used for secondary actions
export const textLinkClass =
  "text-xs font-medium uppercase tracking-widest hover:opacity-60 transition-opacity"

// Inputs are just a line under big text, like writing on paper
export const inputClass =
  "w-full bg-transparent border-0 border-b border-black dark:border-white py-3 text-2xl sm:text-3xl placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-b-2 rounded-none"

// Field label above an input
export const fieldLabelClass = "text-xs font-medium uppercase tracking-widest text-neutral-500"

// Page wrapper: full height, monochrome, side padding that matches the header
export function Page({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <main className={`min-h-screen bg-white text-black dark:bg-black dark:text-white px-4 sm:px-8 ${className}`}>
      {children}
    </main>
  )
}
