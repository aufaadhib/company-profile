import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HomePage } from "@/components/home-page";
import { SiteHeader } from "@/components/site-header";
import { isLocale, siteContent } from "@/content/site-content";

type LocalePageProps = {
  params: Promise<{ locale: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  return {
    title: `${locale === "id" ? "Beranda" : "Home"} | Afana`,
    description: siteContent[locale].heroDescription,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        id: "/id",
        en: "/en",
      },
    },
  };
}

export default async function LocaleHomePage({ params }: LocalePageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const content = siteContent[locale];

  return (
    <>
      <SiteHeader locale={locale} content={content} />
      <main id="main-content" className="flex-1">
        <HomePage locale={locale} siteContent={content} />
      </main>
    </>
  );
}
