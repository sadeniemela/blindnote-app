
import { cookies } from "next/headers"
import Link from "next/link"
import Header from "../../common/header"

// Messages for the error codes we may get in the URL
const ERRORS: Record<string, string> = {
  Verification: "The code is wrong or expired. Check the code or request a new one.",
}

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const email = (await cookies()).get("blindnote_login_email")?.value
  const message = error ? ERRORS[error] ?? "We could not send the code. Please try again." : null
  // Show the code form only when a code was sent: no error yet, or the typed code was wrong
  const showForm = email && (!error || error === "Verification")

  return (
    <div className="bg-white dark:bg-black flex flex-col h-screen items-center justify-center">
      <Header />

      <div className="bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white w-3/4 max-w-xl flex flex-col items-center text-center rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-4">{showForm ? "Check your email" : "Something went wrong"}</h1>

        {showForm ? (
          <>
            <p className="text-neutral-500 mb-8">
              We sent a 6 digit code to <span className="font-medium text-black dark:text-white">{email}</span>. The code is valid for 10 minutes.
            </p>

            {/* A plain GET form that goes straight to the Auth.js callback, the same URL
                the magic link used. Auth.js hashes the code, compares it to the database
                and logs the user in. Works even without JavaScript. */}
            <form action="/api/auth/callback/resend" method="get" className="flex flex-col w-full items-center">
              <input type="hidden" name="email" value={email} />
              <input type="hidden" name="callbackUrl" value="/dashboard" />
              <input
                name="token"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                autoFocus
                placeholder="123456"
                className="w-2/3 p-3 text-center text-2xl tracking-[0.5em] bg-neutral-500/30 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
              {message && <p className="text-sm text-red-500 mt-3">{message}</p>}
              <button
                type="submit"
                className="rounded-xl w-2/3 mt-4 px-4 py-2 bg-blue-700 text-white font-medium hover:opacity-90"
              >
                Sign in
              </button>
            </form>
          </>
        ) : (
          message && <p className="text-sm text-red-500 mb-4">{message}</p>
        )}

        <Link href="/login" className="text-sm text-neutral-500 hover:underline mt-6">
          Request a new code
        </Link>
      </div>
    </div>
  )
}
