import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"

// Served as /sitemap.xml. Lists the public pages search engines should know about.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/login`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/llms.txt`, changeFrequency: "monthly", priority: 0.2 },
  ]
}
