import { ImageResponse } from "next/og"
import { loadGoogleFont } from "@/lib/og-font"

// App icon for the home screen and notifications: the "B" of Blindnote in white
// on the black redaction bar. /pwa-icon/192 and /pwa-icon/512 are the sizes phones ask for.
const SIZES = [96, 180, 192, 512]

export async function GET(_request: Request, { params }: { params: Promise<{ size: string }> }) {
  const size = Number((await params).size)
  if (!SIZES.includes(size)) {
    return new Response("Not found", { status: 404 })
  }

  const font = await loadGoogleFont("Archivo+Black", "B")

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "black",
          color: "white",
          fontSize: size * 0.62,
          fontFamily: font ? "Archivo Black" : undefined,
          fontWeight: 900,
        }}
      >
        B
      </div>
    ),
    {
      width: size,
      height: size,
      fonts: font ? [{ name: "Archivo Black", data: font, style: "normal", weight: 400 }] : [],
      // Icons never change, so browsers may keep them for a long time
      headers: { "Cache-Control": "public, max-age=31536000, immutable" },
    }
  )
}
