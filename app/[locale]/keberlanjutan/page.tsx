import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { SiteHeader } from "@/components/site-header";
import { SustainabilityPage } from "@/components/sustainability-page";
import { sustainabilityPageContent } from "@/content/sustainability-content";
import { isLocale, siteContent } from "@/content/site-content";

type SustainabilityRouteProps = { params: Promise<{ locale: string }> };

export async function generateStaticParams() {
  return [{ locale: "id" }];
}

export async function generateMetadata({ params }: SustainabilityRouteProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = sustainabilityPageContent[locale];
  return { title: `${content.breadcrumbCurrent} | Afana`, description: content.description, alternates: { canonical: locale === "id" ? "/id/keberlanjutan" : "/en/sustainability", languages: { id: "/id/keberlanjutan", en: "/en/sustainability" } } };
}

export default async function SustainabilityRoute({ params }: SustainabilityRouteProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  if (locale === "id") {
    return <><SiteHeader locale="id" content={siteContent.id} /><SustainabilityPage locale="id" content={sustainabilityPageContent.id} /></>;
  }
  redirect("/en/sustainability");
}
