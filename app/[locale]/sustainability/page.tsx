import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/site-header";
import { SustainabilityPage } from "@/components/sustainability-page";
import { sustainabilityPageContent } from "@/content/sustainability-content";
import { siteContent } from "@/content/site-content";

type SustainabilityRouteProps = { params: Promise<{ locale: string }> };

export async function generateStaticParams() { return [{ locale: "en" }]; }

export async function generateMetadata({ params }: SustainabilityRouteProps): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "en") notFound();
  const content = sustainabilityPageContent.en;
  return { title: `${content.breadcrumbCurrent} | Afana`, description: content.description, alternates: { canonical: "/en/sustainability", languages: { id: "/id/keberlanjutan", en: "/en/sustainability" } } };
}

export default async function SustainabilityRoute({ params }: SustainabilityRouteProps) {
  const { locale } = await params;
  if (locale !== "en") notFound();
  return <><SiteHeader locale="en" content={siteContent.en} /><SustainabilityPage locale="en" content={sustainabilityPageContent.en} /></>;
}
