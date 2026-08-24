import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BusinessPage } from "@/components/business-page";
import { SiteHeader } from "@/components/site-header";
import { businessPageContent } from "@/content/business-content";
import { siteContent } from "@/content/site-content";

type BusinessRouteProps = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return [{ locale: "en" }];
}

export async function generateMetadata({ params }: BusinessRouteProps): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "en") notFound();
  const content = businessPageContent.en;

  return {
    title: `${content.breadcrumbCurrent} | Afana`,
    description: content.description,
    alternates: {
      canonical: "/en/business",
      languages: { id: "/id/bisnis", en: "/en/business" },
    },
  };
}

export default async function BusinessRoute({ params }: BusinessRouteProps) {
  const { locale } = await params;
  if (locale !== "en") notFound();

  return (
    <>
      <SiteHeader locale="en" content={siteContent.en} />
      <BusinessPage locale="en" content={businessPageContent.en} />
    </>
  );
}
