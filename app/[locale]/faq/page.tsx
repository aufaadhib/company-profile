import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FaqPage } from "@/components/faq-page";
import { SiteHeader } from "@/components/site-header";
import { faqPageContent } from "@/content/faq-content";
import { isLocale, siteContent } from "@/content/site-content";
import { getPublishedFaq } from "@/lib/faq-service";

type FaqRouteProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string | string[]; category?: string | string[] }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: FaqRouteProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = faqPageContent[locale];
  return {
    title: `FAQ | Afana`,
    description: content.description,
    alternates: { canonical: `/${locale}/faq`, languages: { id: "/id/faq", en: "/en/faq" } },
  };
}

export default async function FaqRoute({ params, searchParams }: FaqRouteProps) {
  const [{ locale }, filters] = await Promise.all([params, searchParams]);
  if (!isLocale(locale)) notFound();
  const query = (Array.isArray(filters.q) ? filters.q[0] : filters.q)?.trim().slice(0, 100) ?? "";
  const activeCategory = (Array.isArray(filters.category) ? filters.category[0] : filters.category)?.trim().slice(0, 100) ?? "";
  const hasFilterParameters = filters.q !== undefined || filters.category !== undefined;
  const categories = await getPublishedFaq(locale);
  const normalizedQuery = query.toLocaleLowerCase(locale === "id" ? "id-ID" : "en-US");
  const visibleCategories = categories.flatMap((category) => {
    if (activeCategory && category.slug !== activeCategory) return [];
    const items = normalizedQuery
      ? category.items.filter((item) => `${item.question} ${item.answer}`.toLocaleLowerCase(locale === "id" ? "id-ID" : "en-US").includes(normalizedQuery))
      : category.items;
    return items.length ? [{ ...category, items }] : [];
  });
  const jsonLd = !hasFilterParameters && categories.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: categories.flatMap((category) => category.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    }))),
  } : null;

  return <>
    <SiteHeader locale={locale} content={siteContent[locale]} />
    {jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /> : null}
    <FaqPage locale={locale} content={faqPageContent[locale]} categories={categories} visibleCategories={visibleCategories} query={query} activeCategory={activeCategory} />
  </>;
}
