import { ImageResponse } from "next/og"

// The picture shown when the site is shared on social media or in chat apps.
// Generated from code so it always matches the site's look.
export const alt = "Blindnote, anonymous feedback with one link"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// Downloads only the letters we need of the heavy Archivo Black font from Google Fonts.
// If it fails the image is still made, just with the default font.
async function loadFont(family: string, text: string) {
  try {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(text)}`)).text()
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1]
    if (!url) return null
    return await (await fetch(url)).arrayBuffer()
  } catch {
    return null
  }
}

export default async function OpengraphImage() {
  const tagline = "( ONE LINK. REAL ANSWERS. )"
  const label = "( ANONYMOUS FEEDBACK )"
  const claim = "People say more when nobody is watching."
  const [black, regular] = await Promise.all([
    loadFont("Archivo+Black", "BLINDNOTE"),
    loadFont("Archivo", tagline + label + claim),
  ])
  const fonts = [
    ...(black ? [{ name: "Archivo Black", data: black, style: "normal" as const, weight: 400 as const }] : []),
    ...(regular ? [{ name: "Archivo", data: regular, style: "normal" as const, weight: 400 as const }] : []),
  ]

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "white",
          color: "black",
          padding: 64,
          fontFamily: regular ? "Archivo" : undefined,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, letterSpacing: 4, color: "#737373" }}>
          <span>{tagline}</span>
          <span>{label}</span>
        </div>
        <div style={{ display: "flex", fontSize: 170, fontFamily: black ? "Archivo Black" : undefined, letterSpacing: -6, lineHeight: 1 }}>
          <span style={{ background: "black", color: "white", padding: "0 12px" }}>BLIND</span>
          <span style={{ padding: "0 12px" }}>NOTE</span>
        </div>
        <div style={{ display: "flex", fontSize: 34, maxWidth: 900 }}>
          {claim}
        </div>
      </div>
    ),
    { ...size, fonts }
  )
}
