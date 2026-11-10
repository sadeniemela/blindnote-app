"use client"

import { useState } from "react"
import { Label, fieldLabelClass, inputClass, primaryButtonClass } from "../ui"

const DEMO_PATH = "/api/forms/demo/responses"
const MAX_LENGTH = 2000

type Sent = { content: string; status: number; body: unknown }

// Interactive demo: the visitor answers the demo form through the real public API.
// On the right we show exactly what was sent and what the API answered, so the
// demo doubles as API documentation.
export default function Demo() {
  const [content, setContent] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState<Sent[]>([])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSending(true)

    const res = await fetch(DEMO_PATH, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    })
    const body = await res.json().catch(() => null)

    // Newest first, like in the dashboard
    setSent((previous) => [{ content, status: res.status, body }, ...previous])
    if (res.ok) setContent("")
    setSending(false)
  }

  const last = sent[0]

  return (
    <section id="demo" className="px-4 sm:px-8 py-32 border-t border-black dark:border-white scroll-mt-8">
      <Label>Try it</Label>
      <h2 className="mt-8 font-heading font-black uppercase text-5xl sm:text-8xl leading-[0.85] tracking-tighter [word-spacing:0.15em]">
        Be the<br />anonymous one.
      </h2>
      <p className="mt-8 text-lg text-neutral-500 max-w-xl">
        This is a real Blindnote form. Write an answer and see what the owner of the form receives, and what happens under the hood.
      </p>

      <div className="mt-16 grid lg:grid-cols-2 gap-16">
        {/* LEFT: what the person answering sees */}
        <div>
          <Label>01 / The person answering</Label>
          <p className="mt-6 font-heading font-black uppercase text-3xl sm:text-4xl tracking-tight">
            What should we do better?
          </p>
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-8">
            <label className="flex flex-col gap-2">
              <span className={fieldLabelClass}>Your answer</span>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={3}
                maxLength={MAX_LENGTH}
                placeholder="Be honest, nobody knows it was you"
                className={inputClass + " !text-xl resize-none"}
              />
            </label>
            <button type="submit" disabled={sending || !content.trim()} className={primaryButtonClass + " self-start"}>
              {sending ? "Sending" : "Send anonymously"}
            </button>
          </form>
        </div>

        {/* RIGHT: what the owner sees, and the raw API call */}
        <div className="flex flex-col gap-12">
          <div>
            <Label>02 / The form owner sees</Label>
            {sent.filter((s) => s.status === 201).length === 0 ? (
              <p className="mt-6 text-neutral-500 border-t border-black dark:border-white pt-6">
                Nothing yet. Send an answer and it appears here, without a name.
              </p>
            ) : (
              <ol className="mt-6 border-t border-black dark:border-white">
                {sent
                  .filter((s) => s.status === 201)
                  .map((s, i) => (
                    <li key={i} className="py-5 border-b border-black dark:border-white flex justify-between gap-6">
                      <p className="text-lg break-words min-w-0">{s.content}</p>
                      <span className="font-mono text-xs text-neutral-500 shrink-0 pt-1">anonymous</span>
                    </li>
                  ))}
              </ol>
            )}
          </div>

          <div>
            <Label>03 / Under the hood</Label>
            <pre className="mt-6 bg-black text-white dark:bg-white dark:text-black p-6 font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap break-words">
{`POST ${DEMO_PATH}
Content-Type: application/json

${JSON.stringify({ content: last?.content ?? "your answer" }, null, 2)}

${last ? `HTTP ${last.status}\n${JSON.stringify(last.body, null, 2)}` : "Waiting for your answer..."}`}
            </pre>
            <p className="mt-4 text-sm text-neutral-500">
              No login, no cookies, no IP stored. Any app can send feedback to a Blindnote form with one request.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
