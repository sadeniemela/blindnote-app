"use client"

import { useState } from "react"
import { textLinkClass } from "./ui"

// Copies the public feedback link to the clipboard and shows a short confirmation
export default function CopyLink({ path, className = textLinkClass }: { path: string; className?: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(`${window.location.origin}${path}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button type="button" onClick={copy} className={className}>
      {copied ? "Kopioitu" : "Kopioi linkki"}
    </button>
  )
}
