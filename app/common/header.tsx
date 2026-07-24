
import Link from "next/link"
// lucide for all icons
import { UserCircle, Home } from "lucide-react"
import ThemeToggle from "./themetoggle"


export default function Header() {
  return (
    <header className="w-full bg-neutral-100/10 absolute top-0 left-0 border-gray-200 dark:border-neutral-800 p-4">
    <div className=" w-full flex items-center justify-between">

      <Link href="/" className="text-4xl font-bold m-4">
      <Home size={32} className="text-blue-900 dark:text-blue-500" />
      </Link>

      <Link href="/login" className="text-lg font-semibold text-blue-900 dark:text-blue-500 hover:underline">
        <UserCircle size={32} />
      </Link>

      <ThemeToggle />
    </div>
    </header>
  )
}

