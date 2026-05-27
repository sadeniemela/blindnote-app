
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function Dashboard() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="text-2xl font-bold">Welcome to the Dashboard, {session.user?.name}!</h1>
    </div>
  )
}