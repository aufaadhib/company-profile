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
  return mediaPageContent.id.items.map((item) => ({ locale: "id", slug: item.slug }));
}

export async function generateMetadata({ params }: MediaArticleRouteProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (locale !== "id") {
    notFound();
  }

  const item = getMediaItem("id", slug);
  if (!item) {
    notFound();
  }

  return {
    title: `${item.title} | Afana`,
    description: item.excerpt,
    alternates: {
      canonical: `/id/media-informasi/${item.slug}`,
      languages: {
        id: `/id/media-informasi/${item.slug}`,
        en: `/en/media-information/${item.slug}`,
      },
    },
  };
}

export default async function MediaArticleRoute({ params }: MediaArticleRouteProps) {
  const { locale, slug } = await params;
  if (locale !== "id") {
    notFound();
  }

  const content = mediaPageContent.id;
  const item = getMediaItem("id", slug);
  if (!item) {
    notFound();
  }

  return (
    <>
      <SiteHeader locale="id" content={siteContent.id} />
      <MediaArticle content={content} item={item} locale="id" detailBasePath="/id/media-informasi" />
    </>
  );
}
