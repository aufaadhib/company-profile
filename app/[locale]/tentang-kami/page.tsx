import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

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
    title: `${content.title} | Afana`,
    description: content.description,
    alternates: {
      canonical: safeLocale === "en" ? "/en/about" : "/id/tentang-kami",
      languages: {
        id: "/id/tentang-kami",
        en: "/en/about",
      },
    },
  };
}

export default async function AboutRoute({ params }: AboutRouteProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  if (locale === "en") {
    redirect("/en/about");
  }

  return (
    <>
      <SiteHeader locale="id" content={siteContent.id} />
      <AboutPage content={aboutPageContent.id} />
    </>
  );
}
