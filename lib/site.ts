
// Basic facts about the site, used in metadata, the sitemap, robots.txt and llms.txt.

// The public address of the site. Set NEXT_PUBLIC_SITE_URL when you have your own domain.
// Without it we use the production domain that Vercel gives automatically.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
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
