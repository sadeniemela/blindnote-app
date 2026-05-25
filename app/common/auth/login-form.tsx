import { signIn } from "@/auth"

export default function LoginForm() {
  return (
    <div className="flex h-screen items-center justify-center">

      <form
        action={async (e) => {
          await signIn("google")
        }}
        className="rounded px-4 py-2 "
      >
        <button type="submit">
          Sign in with Google
        </button>
      </form>

      <form action={async () => await signIn("resend")}>
        <button type="submit" className="ml-4 rounded px-4 py-2">
          Sign in
        </button>
      </form>

      <div>Via sign in you can use the magic link option</div>



    </div>
  )
}