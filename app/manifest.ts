import type { MetadataRoute } from "next"
import { SITE_DESCRIPTION } from "@/lib/site"

// Served as /manifest.webmanifest. It lets phones install Blindnote to the home screen
// like an app. On iPhone that is required before web push notifications work.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Blindnote",
    short_name: "Blindnote",
    description: SITE_DESCRIPTION,
    // Opening the installed app goes straight to your forms
    start_url: "/dashboard/forms",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      { src: "/pwa-icon/192", sizes: "192x192", type: "image/png" },
      { src: "/pwa-icon/512", sizes: "512x512", type: "image/png" },
      { src: "/pwa-icon/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  }
}
