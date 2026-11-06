
import { requestCode } from "./actions"
import Header from "../common/header"
import { Label, Page, Title, fieldLabelClass, inputClass, primaryButtonClass } from "../common/ui"

// Login step 1: the user types their email and we send a 6 digit code
export default function LoginPage() {
  return (
    <Page className="flex flex-col">
      <Header />

      <div className="flex-1 flex flex-col justify-center max-w-2xl w-full pt-28 pb-12">
        <Label>Login</Label>
        <Title className="mt-6 mb-12">Welcome<br />back.</Title>

        <form action={requestCode} className="flex flex-col gap-10">
          <label className="flex flex-col gap-2">
            <span className={fieldLabelClass}>Email</span>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className={inputClass}
            />
          </label>

          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <button type="submit" className={primaryButtonClass}>
              Send login code
            </button>
            <p className="text-sm text-neutral-500 max-w-xs">
              We email you a 6 digit code. No password needed.
            </p>
          </div>
        </form>
      </div>

      <p className="pb-6 text-xs uppercase tracking-widest text-neutral-500">
        By signing in you accept the privacy policy and terms of service
      </p>
    </Page>
  )
}
