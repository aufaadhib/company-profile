import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { BusinessPage } from "@/components/business-page";
import { SiteHeader } from "@/components/site-header";
import { businessPageContent } from "@/content/business-content";
import { isLocale, siteContent } from "@/content/site-content";

type BusinessRouteProps = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return [{ locale: "id" }];
}

export async function generateMetadata({ params }: BusinessRouteProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = businessPageContent[locale];

  return {
    title: `${content.breadcrumbCurrent} | Afana`,
    description: content.description,
    alternates: {
      canonical: locale === "id" ? "/id/bisnis" : "/en/business",
      languages: { id: "/id/bisnis", en: "/en/business" },
    },
  };
}

export default async function BusinessRoute({ params }: BusinessRouteProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  if (locale !== "id") redirect("/en/business");

  return (
    <>
      <SiteHeader locale="id" content={siteContent.id} />
      <BusinessPage locale="id" content={businessPageContent.id} />
    </>
  );
}
