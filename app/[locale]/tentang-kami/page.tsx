import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AboutPage } from "@/components/about-page";
import { SiteHeader } from "@/components/site-header";
import { aboutPageContent } from "@/content/about-content";
import { isLocale, siteContent, type Locale } from "@/content/site-content";

type AboutRouteProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: AboutRouteProps): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: Locale = isLocale(locale) ? locale : "id";
  const content = aboutPageContent[safeLocale];

  return {
    title: `Afana — ${content.title}`,
    description: content.description,
    alternates: {
      canonical: `/${safeLocale}/tentang-kami`,
      languages: {
        id: "/id/tentang-kami",
        en: "/en/tentang-kami",
      },
    },
  };
}

export default async function AboutRoute({ params }: AboutRouteProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <>
      <SiteHeader locale={locale} content={siteContent[locale]} />
      <AboutPage content={aboutPageContent[locale]} />
    </>
  );
}
