
import Link from "next/link"
import NewFormForm from "./new-form-form"
import { Label, Title, textLinkClass } from "../../../common/ui"

// The dashboard layout checks the login before this page is shown
export default function NewFormPage() {
  return (
    <div className="max-w-3xl">
      <Link href="/dashboard/forms" className={textLinkClass}>
        Takaisin
      </Link>

      <Label className="mt-12">Uusi lomake</Label>
      <Title className="mt-6 mb-4">Mitä haluat kysyä?</Title>
      <p className="text-lg text-neutral-500 mb-14 max-w-lg">
        Kirjoita kysymys, johon haluat nimetöntä palautetta. Saat jaettavan linkin heti.
      </p>

      <NewFormForm />
    </div>
  )
}
