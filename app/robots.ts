import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"

// Served as /robots.txt. Public pages are open to everyone, including AI crawlers.
// Private dashboards, the API and individual feedback forms are left out.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/dashboard", "/api/", "/f/", "/login/verify"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
