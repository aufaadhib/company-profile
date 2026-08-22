import Link from "next/link";

import type { FaqPageContent } from "@/content/faq-content";
import { getLocaleHref, type Locale } from "@/content/site-content";
import type { PublishedFaqCategory } from "@/lib/faq-service";

type FaqPageProps = {
  locale: Locale;
  content: FaqPageContent;
  categories: PublishedFaqCategory[];
  visibleCategories: PublishedFaqCategory[];
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

function filterHref(locale: Locale, category: string, query: string) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (category) params.set("category", category);
  const suffix = params.toString();
  return `/${locale}/faq${suffix ? `?${suffix}` : ""}`;
}

export function FaqPage({ locale, content, categories, visibleCategories, query, activeCategory }: FaqPageProps) {
  const resultCount = visibleCategories.reduce((total, category) => total + category.items.length, 0);
  const hasPublishedFaq = categories.length > 0;
  return (
    <main id="main-content" className="flex-1 bg-[var(--paper)]">
      <section aria-labelledby="faq-title" className="relative isolate h-[60svh] min-h-[512px] overflow-hidden bg-[var(--ink)] text-white">
        <div className="absolute inset-y-0 right-0 hidden w-[48%] text-white lg:block"><DeskGraphic /></div>
        <div className="relative z-10 mx-auto flex h-full w-full max-w-[1440px] items-end px-6 pb-14 pt-32 sm:px-10 sm:pb-18 lg:px-20 lg:pb-20">
          <div className="max-w-3xl">
            <p className="hero-breadcrumb mb-8 flex flex-wrap items-center gap-3 text-white/85"><span>{content.breadcrumbHome}</span><span aria-hidden="true" className="text-white/45">/</span><span>{content.breadcrumbCurrent}</span></p>
            <p className="hero-eyebrow mb-5 text-[var(--accent)]">{content.eyebrow}</p>
            <h1 id="faq-title" className="hero-title text-white">{content.title}</h1>
            <p className="hero-description mt-7 max-w-2xl text-white/75">{content.description}</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="faq-desk-title" className="mx-auto w-full max-w-[1440px] px-6 py-16 sm:px-10 sm:py-20 lg:px-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-16 xl:grid-cols-[21rem_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <h2 id="faq-desk-title" className="font-display text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-none tracking-[-0.04em]">FAQ desk</h2>
            <form action={`/${locale}/faq`} method="get" className="mt-8 border-t border-[var(--ink)] pt-6">
              <label htmlFor="faq-search" className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{content.searchLabel}</label>
              <div className="mt-3 flex border border-[var(--line)] bg-white focus-within:border-[var(--accent)]">
                <input id="faq-search" name="q" defaultValue={query} placeholder={content.searchPlaceholder} className="min-h-12 min-w-0 flex-1 bg-transparent px-4 outline-none" />
                {activeCategory ? <input type="hidden" name="category" value={activeCategory} /> : null}
                <button className="min-h-12 border-l border-[var(--line)] px-4 text-sm font-semibold hover:bg-[var(--ink)] hover:text-white">{content.searchButton}</button>
              </div>
            </form>
            <nav aria-label={locale === "id" ? "Filter kategori FAQ" : "FAQ category filters"} className="mt-8 border-t border-[var(--line)]">
              <Link href={filterHref(locale, "", query)} aria-current={!activeCategory ? "page" : undefined} className={`flex min-h-12 items-center justify-between border-b border-[var(--line)] text-sm font-semibold ${!activeCategory ? "text-[var(--ink)]" : "text-[var(--muted)] hover:text-[var(--ink)]"}`}><span>{content.allCategories}</span><span aria-hidden="true">{!activeCategory ? "●" : "○"}</span></Link>
              {categories.map((category) => <Link key={category.id} href={filterHref(locale, category.slug, query)} aria-current={activeCategory === category.slug ? "page" : undefined} className={`flex min-h-12 items-center justify-between border-b border-[var(--line)] text-sm font-semibold ${activeCategory === category.slug ? "text-[var(--ink)]" : "text-[var(--muted)] hover:text-[var(--ink)]"}`}><span>{category.title}</span><span aria-hidden="true">{activeCategory === category.slug ? "●" : "○"}</span></Link>)}
            </nav>
          </aside>

          <div>
            {hasPublishedFaq ? <p className="border-b border-[var(--ink)] pb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]" aria-live="polite">{content.resultsLabel(resultCount)}</p> : null}
            {visibleCategories.map((category) => (
              <section key={category.id} aria-labelledby={`faq-category-${category.id}`} className="border-b border-[var(--ink)] py-9 first:pt-6">
                <div className="grid gap-5 sm:grid-cols-[2.5rem_1fr]"><span className="font-display text-sm font-semibold text-[var(--accent)]">{String(categories.findIndex((entry) => entry.id === category.id) + 1).padStart(2, "0")}</span><div><h3 id={`faq-category-${category.id}`} className="font-display text-2xl font-semibold tracking-[-0.03em]">{category.title}</h3><div className="mt-5 border-t border-[var(--line)]">
                  {category.items.map((item) => <details key={item.id} className="group border-b border-[var(--line)]"><summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-4 font-semibold leading-6 marker:content-none"><span>{item.question}</span><span className="grid size-8 shrink-0 place-items-center rounded-full border border-[var(--line)] text-xl font-normal transition-transform group-open:rotate-45" aria-hidden="true">+</span></summary><div className="max-w-3xl whitespace-pre-line pb-6 pr-10 leading-7 text-[var(--muted)] sm:pr-16">{item.answer}</div></details>)}
                </div></div></div>
              </section>
            ))}
            {!hasPublishedFaq ? <div className="border-y border-[var(--ink)] py-14"><p className="font-display text-3xl font-semibold tracking-[-0.04em]">{content.emptyTitle}</p><p className="mt-5 max-w-xl leading-7 text-[var(--muted)]">{content.emptyDescription}</p></div> : null}
            {hasPublishedFaq && resultCount === 0 ? <div className="border-b border-[var(--ink)] py-14"><p className="font-display text-3xl font-semibold tracking-[-0.04em]">{content.noResultsTitle}</p><p className="mt-5 max-w-xl leading-7 text-[var(--muted)]">{content.noResultsDescription}</p><Link href={`/${locale}/faq`} className="mt-7 inline-flex min-h-11 items-center border border-[var(--ink)] px-5 text-sm font-semibold hover:bg-[var(--ink)] hover:text-white">{content.clearFilters}</Link></div> : null}
          </div>
        </div>
      </section>

      <section className="bg-[var(--ink)] text-white">
        <div className="mx-auto grid w-full max-w-[1440px] gap-8 px-6 py-14 sm:px-10 sm:py-16 lg:grid-cols-[1fr_auto] lg:items-end lg:px-20 lg:py-20">
          <div><p className="hero-eyebrow text-[var(--accent)]">{content.contactEyebrow}</p><h2 className="mt-5 max-w-3xl font-display text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.04em]">{content.contactTitle}</h2><p className="mt-5 max-w-2xl leading-7 text-white/65">{content.contactDescription}</p></div>
          <Link href={getLocaleHref(content.contactHref, locale)} className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/75 px-6 text-sm font-semibold hover:bg-white hover:text-[var(--ink)]">{content.contactCta}</Link>
        </div>
      </section>
    </main>
  );
}
