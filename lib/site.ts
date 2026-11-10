
// Basic facts about the site, used in metadata, the sitemap, robots.txt and llms.txt.

// The public address of the site. NEXT_PUBLIC_SITE_URL can override it.
// In Vercel production it is blindnote.app, in preview deployments the preview address,
// and on your own machine localhost.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_ENV === "production"
    ? "https://blindnote.app"
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000")

export const SITE_NAME = "Blindnote"

// Short description, under 160 characters so search engines show it in full
export const SITE_DESCRIPTION =
  "Anonymous feedback with one link. Ask open questions, star ratings or multiple choice and read honest answers. No accounts for people answering."

// Who makes Blindnote. Shown in the footer and in the machine readable company info.
export const PUBLISHER = {
  name: "Sadetech",
  url: "https://sadetech.dev",
}
