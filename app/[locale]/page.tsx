import { notFound } from "next/navigation";

import { HeroCarousel } from "@/components/hero-carousel";
import { SiteHeader } from "@/components/site-header";
import { isLocale, siteContent } from "@/content/site-content";

type LocalePageProps = {
  params: Promise<{ locale: string }>;
};

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
        <HeroCarousel slides={content.slides} content={content} />
      </main>
    </>
  );
}
