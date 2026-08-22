import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { ContactPage } from "@/components/contact-page";
import { SiteHeader } from "@/components/site-header";
import { contactPageContent } from "@/content/contact-content";
import { isLocale, siteContent } from "@/content/site-content";
import { getPublicContactSettings } from "@/lib/contact-service";

type ContactRouteProps = { params: Promise<{ locale: string }> };

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return [{ locale: "en" }];
}

export async function generateMetadata({ params }: ContactRouteProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = contactPageContent[locale];
  return {
    title: `${content.breadcrumbCurrent} | Afana`,
    description: content.description,
    alternates: {
      canonical: locale === "id" ? "/id/kontak" : "/en/contact",
      languages: { id: "/id/kontak", en: "/en/contact" },
    },
  };
}

export default async function ContactRoute({ params }: ContactRouteProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  if (locale === "id") redirect("/id/kontak");
  const settings = await getPublicContactSettings();

  return <><SiteHeader locale="en" content={siteContent.en} /><ContactPage locale="en" content={contactPageContent.en} siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? null} settings={settings} /></>;
}
