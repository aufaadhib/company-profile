import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import "swiper/css";
import "swiper/css/a11y";
import "swiper/css/effect-fade";
import "swiper/css/keyboard";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { lexend, sourceSans } from "@/app/fonts";
import { SiteFooter } from "@/components/site-footer";
import { isLocale, locales, siteContent, type Locale } from "@/content/site-content";
import "../globals.css";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: Locale = isLocale(locale) ? locale : "id";

  return {
    title: `Afana — ${safeLocale === "id" ? "Ruang untuk arah baru" : "A space for new directions"}`,
    description:
      safeLocale === "id"
        ? "Prototype company profile Afana dengan arah visual editorial."
        : "Afana company profile prototype with an editorial visual direction.",
    alternates: {
      canonical: `/${safeLocale}`,
      languages: {
        id: "/id",
        en: "/en",
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <html lang={locale} className={`${lexend.variable} ${sourceSans.variable} antialiased`}>
      <body className="min-h-screen bg-[var(--paper)] font-sans text-[var(--ink)]">
        <a className="skip-link" href="#main-content">
          {locale === "id" ? "Lewati ke konten utama" : "Skip to main content"}
        </a>
        <div className="flex min-h-screen flex-col">
          {children}
          <SiteFooter locale={locale} content={siteContent[locale]} />
        </div>
      </body>
    </html>
  );
}
