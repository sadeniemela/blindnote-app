
import Header from "./common/header";
import LandingPage from "./common/parts/landingpage";
import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n";

// Title and description in the visitor's language
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getDictionary();
  return {
    title: { absolute: t.landing.metaTitle },
    description: t.landing.metaDescription,
    openGraph: { title: t.landing.metaTitle, description: t.landing.metaDescription },
  };
}

export default function Home() {
  return (
    <>
    <div className="w-full min-h-screen bg-white dark:bg-black relative">
      <Header />
      <LandingPage />
    </div>
    </>
  );
}
