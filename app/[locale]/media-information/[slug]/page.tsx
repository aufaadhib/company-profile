import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MediaArticle } from "@/components/media-article";
import { SiteHeader } from "@/components/site-header";
import { mediaPageContent } from "@/content/media-content";
import { siteContent } from "@/content/site-content";
import { getPublishedMedia, getPublishedMediaItem } from "@/lib/cms-service";

type MediaArticleRouteProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: MediaArticleRouteProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (locale !== "en") {
    notFound();
  }

  const item = await getPublishedMediaItem("en", slug);
  if (!item) {
    notFound();
  }

  return {
    title: `${item.title} | Afana`,
    description: item.excerpt,
    alternates: {
      canonical: `/en/media-information/${item.slug}`,
      languages: {
        id: `/id/media-informasi/${item.slug}`,
        en: `/en/media-information/${item.slug}`,
      },
    },
  };
}

export default async function MediaArticleRoute({ params }: MediaArticleRouteProps) {
  const { locale, slug } = await params;
  if (locale !== "en") {
    notFound();
  }

  const items = await getPublishedMedia("en");
  const item = items.find((candidate) => candidate.slug === slug);
  if (!item) {
    notFound();
  }

  return (
    <>
      <SiteHeader locale="en" content={siteContent.en} />
      <MediaArticle content={{ ...mediaPageContent.en, items }} item={item} locale="en" detailBasePath="/en/media-information" />
    </>
  );
}
