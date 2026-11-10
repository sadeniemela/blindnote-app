
import { prisma } from "./db"

// The demo form on the landing page. It is a real form in the database, so the demo
// goes through the same public API as every other form.
export const DEMO_FORM_ID = "demo"
// .invalid is a reserved domain that can never receive email, so nobody can log in as this user
const DEMO_EMAIL = "demo@blindnote.invalid"

// Creates the demo user and form the first time they are needed. Safe to call many times.
export async function ensureDemoForm() {
  const existing = await prisma.form.findUnique({ where: { id: DEMO_FORM_ID }, select: { id: true } })
  if (existing) return

  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: {},
    create: { email: DEMO_EMAIL, name: "Blindnote demo" },
  })

  // upsert instead of create: if two visitors arrive at the same moment, only one form is made
  await prisma.form.upsert({
    where: { id: DEMO_FORM_ID },
    update: {},
    create: {
      id: DEMO_FORM_ID,
      userId: user.id,
      title: "What should we do better?",
      description: "This is the Blindnote demo. Your answer is anonymous.",
    },
  })
}
