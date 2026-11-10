import type { Metadata } from "next";
import { Geist, Geist_Mono, Archivo } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Providers from "./providers";
import { getLocale } from "@/lib/i18n";
import { PUBLISHER, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Display font for the big headlines. Variable font with a width axis,
// so we can make it extra wide and heavy with CSS.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Relative URLs below (canonical, images) are joined to this address
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Blindnote, anonymous feedback with one link",
    // Other pages can set just their own name, for example "Login | Blindnote"
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: PUBLISHER.name, url: PUBLISHER.url }],
  // The one official address of the front page, so search engines do not count duplicates
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: "Blindnote, anonymous feedback with one link",
    description: SITE_DESCRIPTION,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blindnote, anonymous feedback with one link",
    description: SITE_DESCRIPTION,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={await getLocale()}
      className={`${geistSans.variable} ${geistMono.variable} ${archivo.variable} h-full antialiased overflow-x-hidden`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
