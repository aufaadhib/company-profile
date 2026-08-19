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
  return [{ locale: "id" }];
}

export async function generateMetadata({ params }: MediaRouteProps): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "id") {
    notFound();
  }

  const content = mediaPageContent.id;

  return {
    title: `Afana — ${content.title}`,
    description: content.description,
    alternates: {
      canonical: "/id/media-informasi",
      languages: {
        id: "/id/media-informasi",
        en: "/en/media-information",
      },
    },
  };
}

export default async function MediaRoute({ params }: MediaRouteProps) {
  const { locale } = await params;
  if (!isLocale(locale) || locale !== "id") {
    notFound();
  }

  return (
    <>
      <SiteHeader locale="id" content={siteContent.id} />
      <MediaPage content={mediaPageContent.id} locale="id" detailBasePath="/id/media-informasi" />
    </>
  );
}
