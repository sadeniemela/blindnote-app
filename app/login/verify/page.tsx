
import { cookies } from "next/headers"
import Link from "next/link"
import Header from "../../common/header"
import { Label, Page, Title, fieldLabelClass, inputClass, primaryButtonClass, textLinkClass } from "../../common/ui"
import { getDictionary } from "@/lib/i18n"

// Login step 2: the user types the code from the email
export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const { t: { login: t } } = await getDictionary()
  const email = (await cookies()).get("blindnote_login_email")?.value
  // Auth.js sends ?error=Verification for a wrong or expired code, other errors mean sending failed
  const message = error
    ? error === "Verification" ? t.wrongCode : error === "TooMany" ? t.tooMany : t.sendFailed
    : null
  // Show the code form only when a code was sent: no error yet, or the typed code was wrong
  const showForm = email && (!error || error === "Verification" || error === "TooMany")

  return (
    <Page className="flex flex-col">
      <Header />

      <div className="flex-1 flex flex-col justify-center max-w-2xl w-full pt-28 pb-12">
        <Label>{t.verifyLabel}</Label>
        <Title className="mt-6 mb-8">
          {showForm ? <>{t.checkTitle1}<br />{t.checkTitle2}</> : <>{t.errorTitle1}<br />{t.errorTitle2}</>}
        </Title>

        {showForm ? (
          <>
            <p className="text-lg text-neutral-500 mb-12 max-w-md">
              {t.sentTo} <span className="text-black dark:text-white">{email}</span>. {t.validFor}
            </p>

            {/* A plain GET form that goes straight to the Auth.js callback, the same URL
                the magic link used. Auth.js hashes the code, compares it to the database
                and logs the user in. Works even without JavaScript. */}
            <form action="/api/auth/callback/resend" method="get" className="flex flex-col gap-10">
              <input type="hidden" name="email" value={email} />
              <input type="hidden" name="callbackUrl" value="/dashboard" />
              <label className="flex flex-col gap-2">
                <span className={fieldLabelClass}>{t.code}</span>
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
                  {t.signIn}
                </button>
                <Link href="/login" className={textLinkClass}>
                  {t.newCode}
                </Link>
              </div>
            </form>
          </>
        ) : (
          <>
            {message && <p className="text-lg text-neutral-500 mb-10">{message}</p>}
            <Link href="/login" className={primaryButtonClass + " self-start"}>
              {t.backToLogin}
            </Link>
          </>
        )}
      </div>
    </Page>
  )
}
