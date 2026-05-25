
import Link from "next/dist/client/link"
import ThemeToggle from "./themetoggle"

export default function Header() {
  return (
    <header className="w-full bg-neutral-100/10 absolute top-0 left-0 border-gray-200 dark:border-neutral-800 p-4">
    <div className=" w-full flex items-center justify-between">

      <Link href="/" className="text-4xl font-bold m-4">
      <h1 className="text-3xl font-bold text-green-500">Blind<span className="text-black dark:text-white">Note</span></h1>
      </Link>

      <ThemeToggle />
    </div>
    </header>
  )
}

