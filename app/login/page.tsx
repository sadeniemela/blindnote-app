
import { requestCode } from "./actions"
import Header from "../common/header"
import { Label, Page, Title, fieldLabelClass, inputClass, primaryButtonClass } from "../common/ui"
import { getDictionary } from "@/lib/i18n"

// Login step 1: the user types their email and we send a 6 digit code
export default async function LoginPage() {
  const { t: { login: t } } = await getDictionary()

  return (
    <Page className="flex flex-col">
      <Header />

      <div className="flex-1 flex flex-col justify-center max-w-2xl w-full pt-28 pb-12">
        <Label>{t.label}</Label>
        <Title className="mt-6 mb-12">{t.title1}<br />{t.title2}</Title>

        <form action={requestCode} className="flex flex-col gap-10">
          <label className="flex flex-col gap-2">
            <span className={fieldLabelClass}>{t.email}</span>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder={t.emailPlaceholder}
              className={inputClass}
            />
          </label>

          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <button type="submit" className={primaryButtonClass}>
              {t.send}
            </button>
            <p className="text-sm text-neutral-500 max-w-xs">
              {t.hint}
            </p>
          </div>
        </form>
      </div>

      <p className="pb-6 text-xs uppercase tracking-widest text-neutral-500">
        {t.terms}
      </p>
    </Page>
  )
}
