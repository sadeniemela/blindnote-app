
import { redirect } from "next/navigation"

// The forms list is the dashboard home for now
export default function Dashboard() {
  redirect("/dashboard/forms")
}
