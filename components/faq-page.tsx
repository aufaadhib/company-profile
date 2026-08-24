import Link from "next/link";

import { FaqDesk } from "@/components/faq-desk";
import type { FaqPageContent } from "@/content/faq-content";
import { getLocaleHref, type Locale } from "@/content/site-content";
import type { PublishedFaqCategory } from "@/lib/faq-service";

type FaqPageProps = {
  locale: Locale;
  content: FaqPageContent;
  categories: PublishedFaqCategory[];
  query: string;
  activeCategory: string;
};

function DeskGraphic() {
  return (
    <svg aria-hidden="true" className="h-full w-full" viewBox="0 0 620 430" fill="none" preserveAspectRatio="xMidYMid meet">
      <path d="M48 91h524M48 173h524M48 255h524M48 337h524" stroke="currentColor" opacity=".14" />
      <path d="M136 48v334M310 48v334M484 48v334" stroke="currentColor" opacity=".08" />
      <path d="M91 255h219l82-82h180" stroke="currentColor" strokeWidth="2" opacity=".42" />
      <circle cx="310" cy="255" r="8" fill="var(--accent)" />
      <circle cx="392" cy="173" r="8" fill="var(--accent)" />
      <path d="m374 333 48-78h42l-48 78h-42ZM440 333l48-78h42l-48 78h-42Z" fill="currentColor" opacity=".12" />
    </svg>
  );
}

export function FaqPage({ locale, content, categories, query, activeCategory }: FaqPageProps) {
  return (
    <main id="main-content" className="flex-1 bg-[var(--paper)]">
      <section aria-labelledby="faq-title" className="interior-hero relative isolate overflow-hidden bg-[var(--ink)] text-white">
        <div className="absolute inset-y-0 right-0 hidden w-[48%] text-white lg:block"><DeskGraphic /></div>
        <div className="hero-safe-content relative z-10 mx-auto flex w-full max-w-[1440px] items-end px-6 pb-14 sm:px-10 sm:pb-18 lg:px-20 lg:pb-20">
          <div className="max-w-3xl">
            <p className="hero-breadcrumb mb-8 flex flex-wrap items-center gap-3 text-white/85"><span>{content.breadcrumbHome}</span><span aria-hidden="true" className="text-white/45">/</span><span>{content.breadcrumbCurrent}</span></p>
            <p className="hero-eyebrow mb-5 text-[var(--accent)]">{content.eyebrow}</p>
            <h1 id="faq-title" className="hero-title text-white">{content.title}</h1>
            <p className="hero-description mt-7 max-w-2xl text-white/75">{content.description}</p>
          </div>
        </div>
      </section>

      <FaqDesk key={`${query}:${activeCategory}`} locale={locale} content={content} categories={categories} query={query} activeCategory={activeCategory} />

      <section className="bg-[var(--ink)] text-white">
        <div className="mx-auto grid w-full max-w-[1440px] gap-8 px-6 py-14 sm:px-10 sm:py-16 lg:grid-cols-[1fr_auto] lg:items-end lg:px-20 lg:py-20">
          <div><p className="hero-eyebrow text-[var(--accent)]">{content.contactEyebrow}</p><h2 className="mt-5 max-w-3xl font-display text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.04em]">{content.contactTitle}</h2><p className="mt-5 max-w-2xl leading-7 text-white/65">{content.contactDescription}</p></div>
          <Link href={getLocaleHref(content.contactHref, locale)} className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/75 px-6 text-sm font-semibold hover:bg-white hover:text-[var(--ink)]">{content.contactCta}</Link>
        </div>
      </section>
    </main>
  );
}
