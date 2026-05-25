
import { signIn } from "@/auth"
import Link from "next/link"
import Header from "../common/header"

// This is the login page where users can sign in with Google or email (magic link)
export default function LoginForm() {
  return (
    <div className="bg-white dark:bg-black flex flex-col h-screen items-center justify-center ">
      
      <Header />

      <div className= "bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white w-3/4 flex flex-col items-center justify-center text-center h-100 rounded-xl p-3">

      
      {/* Sign in with Google form */}
      <form
        action={async () => {
            "use server"
          await signIn("google")
        }}
        className="rounded-xl px-4 py-2 w-2/3 bg-gray-200 dark:bg-neutral-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        <button type="submit">
          Sign in with Google
        </button>
      </form>

      {/* Sign in with email form (magic link) */}
      <form action={async () => {
        "use server"
        await signIn("resend")
        }}
        className="rounded-xl w-2/3 mt-4 px-4 py-2 bg-gray-200 dark:bg-neutral-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
    >
        <button type="submit">
          Sign in with email
        </button>
      </form>

      <Link href="/register" className="text-neutral-500 hover:underline mt-7">
        Don't have an account? Sign up
      </Link>

      {/* Mention about privacy policy and terms of service */}
      
      </div>
      <div className="text-sm mt-10 p-4 text-neutral-500">With signing in you will approve the privacy policy and terms of service </div>
      </div>


    
  )
}