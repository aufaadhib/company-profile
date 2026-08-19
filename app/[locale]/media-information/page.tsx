import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MediaPage } from "@/components/media-page";
import { SiteHeader } from "@/components/site-header";
import { mediaPageContent } from "@/content/media-content";
import { isLocale, siteContent } from "@/content/site-content";

type MediaRouteProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return [{ locale: "en" }];
}

export async function generateMetadata({ params }: MediaRouteProps): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "en") {
    notFound();
  }

  const content = mediaPageContent.en;

  return {
    title: `${content.title} | Afana`,
    description: content.description,
    alternates: {
      canonical: "/en/media-information",
      languages: {
        id: "/id/media-informasi",
        en: "/en/media-information",
      },
    },
  };
}

export default async function MediaRoute({ params }: MediaRouteProps) {
  const { locale } = await params;
  if (!isLocale(locale) || locale !== "en") {
    notFound();
  }

  return (
    <>
      <SiteHeader locale="en" content={siteContent.en} />
      <MediaPage content={mediaPageContent.en} locale="en" detailBasePath="/en/media-information" />
    </>
  );
}
