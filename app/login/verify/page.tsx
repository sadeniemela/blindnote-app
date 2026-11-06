
import { cookies } from "next/headers"
import Link from "next/link"
import Header from "../../common/header"
import { Label, Page, Title, fieldLabelClass, inputClass, primaryButtonClass, textLinkClass } from "../../common/ui"

// Messages for the error codes we may get in the URL
const ERRORS: Record<string, string> = {
  Verification: "The code is wrong or expired. Check the code or request a new one.",
}

// Login step 2: the user types the code from the email
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
    <Page className="flex flex-col">
      <Header />

      <div className="flex-1 flex flex-col justify-center max-w-2xl w-full pt-28 pb-12">
        <Label>Login / Step 2</Label>
        <Title className="mt-6 mb-8">
          {showForm ? <>Check your<br />email.</> : <>Something<br />went wrong.</>}
        </Title>

        {showForm ? (
          <>
            <p className="text-lg text-neutral-500 mb-12 max-w-md">
              We sent a 6 digit code to <span className="text-black dark:text-white">{email}</span>. It is valid for 10 minutes.
            </p>

            {/* A plain GET form that goes straight to the Auth.js callback, the same URL
                the magic link used. Auth.js hashes the code, compares it to the database
                and logs the user in. Works even without JavaScript. */}
            <form action="/api/auth/callback/resend" method="get" className="flex flex-col gap-10">
              <input type="hidden" name="email" value={email} />
              <input type="hidden" name="callbackUrl" value="/dashboard" />
              <label className="flex flex-col gap-2">
                <span className={fieldLabelClass}>Code</span>
                <input
                  name="token"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                  autoFocus
                  placeholder="000000"
                  className={`${inputClass} font-heading font-black !text-5xl sm:!text-7xl tracking-[0.2em] placeholder:!text-neutral-200 dark:placeholder:!text-neutral-800`}
                />
              </label>
              {message && <p className="text-sm text-red-600 dark:text-red-400">{message}</p>}
              <div className="flex items-center gap-8">
                <button type="submit" className={primaryButtonClass}>
                  Sign in
                </button>
                <Link href="/login" className={textLinkClass}>
                  Request a new code
                </Link>
              </div>
            </form>
          </>
        ) : (
          <>
            {message && <p className="text-lg text-neutral-500 mb-10">{message}</p>}
            <Link href="/login" className={primaryButtonClass + " self-start"}>
              Back to login
            </Link>
          </>
        )}
      </div>
    </Page>
  )
}
