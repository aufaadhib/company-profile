import Link from "next/link";
import { notFound } from "next/navigation";

import { MediaArticle } from "@/components/media-article";
import { mediaPageContent, type MediaItem } from "@/content/media-content";
import { requireCmsUser } from "@/lib/cms-auth";
import { getCmsArticle } from "@/lib/cms-service";

export default async function PreviewMediaArticlePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ locale?: string }> }) {
  const { id } = await params;
  const [{ locale: localeParam }, article] = await Promise.all([searchParams, getCmsArticle(id), requireCmsUser()]);
  if (!article?.asset) notFound();
  const locale = localeParam === "en" ? "en" : "id";
  const translation = article.payload.translations[locale];
  const item: MediaItem = {
    id: article.id,
    slug: article.slug,
    category: article.payload.category,
    title: translation.title || "Draft tanpa judul",
    excerpt: translation.excerpt,
    body: translation.body,
    publishedAt: article.payload.publishedAt || new Date().toISOString().slice(0, 10),
    image: article.asset.url,
    imageAlt: translation.imageAlt,
    featured: article.payload.isFeatured,
  };
  const content = { ...mediaPageContent[locale], items: [item] };

  return (
    <main>
      <div className="sticky top-0 z-40 flex min-h-14 items-center justify-between gap-4 bg-[var(--accent)] px-6 text-sm font-semibold text-white sm:px-10 lg:px-12">
        <Link href={`/admin/media/${id}`}>Kembali ke editor</Link>
        <div className="flex gap-4"><Link href={`?locale=id`} aria-current={locale === "id" ? "page" : undefined}>Indonesia</Link><Link href={`?locale=en`} aria-current={locale === "en" ? "page" : undefined}>English</Link></div>
      </div>
      <MediaArticle content={content} item={item} locale={locale} detailBasePath={`/admin/media/${id}`} />
    </main>
  );
}
