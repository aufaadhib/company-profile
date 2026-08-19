import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MediaArticle } from "@/components/media-article";
import { SiteHeader } from "@/components/site-header";
import { getMediaItem, mediaPageContent } from "@/content/media-content";
import { siteContent } from "@/content/site-content";

type MediaArticleRouteProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return mediaPageContent.en.items.map((item) => ({ locale: "en", slug: item.slug }));
}

export async function generateMetadata({ params }: MediaArticleRouteProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (locale !== "en") {
    notFound();
  }

  const item = getMediaItem("en", slug);
  if (!item) {
    notFound();
  }

  return {
    title: `Afana — ${item.title}`,
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

  const item = getMediaItem("en", slug);
  if (!item) {
    notFound();
  }

  return (
    <>
      <SiteHeader locale="en" content={siteContent.en} />
      <MediaArticle content={mediaPageContent.en} item={item} locale="en" detailBasePath="/en/media-information" />
    </>
  );
}
