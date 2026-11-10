
import Link from "next/link"
import NewFormForm from "./new-form-form"
import { getDictionary } from "@/lib/i18n"
import { Label, Title, textLinkClass } from "../../../common/ui"

// The dashboard layout checks the login before this page is shown
export default async function NewFormPage() {
  const { t } = await getDictionary()

  return (
    <div className="max-w-3xl">
      <Link href="/dashboard/forms" className={textLinkClass}>
        {t.common.back}
      </Link>

      <Label className="mt-12">{t.builder.label}</Label>
      <Title className="mt-6 mb-4">{t.builder.title}</Title>
      <p className="text-lg text-neutral-500 mb-14 max-w-lg">{t.builder.intro}</p>

      {/* Client components only get the texts they need, as plain strings */}
      <NewFormForm t={t.builder} errorText={t.common.somethingWrong} />
    </div>
  )
}
