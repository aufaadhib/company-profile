"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent, type MouseEvent } from "react";

import type { FaqPageContent } from "@/content/faq-content";
import type { Locale } from "@/content/site-content";
import type { PublishedFaqCategory } from "@/lib/faq-service";

type FaqDeskProps = {
  locale: Locale;
  content: FaqPageContent;
  categories: PublishedFaqCategory[];
  query: string;
  activeCategory: string;
};

function filterHref(locale: Locale, category: string, query: string) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (category) params.set("category", category);
  const suffix = params.toString();
  return `/${locale}/faq${suffix ? `?${suffix}` : ""}`;
}

export function FaqDesk({ locale, content, categories, query, activeCategory }: FaqDeskProps) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState(query);
  const [isPending, startTransition] = useTransition();
  const normalizedQuery = query.toLocaleLowerCase(locale === "id" ? "id-ID" : "en-US");
  const visibleCategories = categories.flatMap((category) => {
    if (activeCategory && category.slug !== activeCategory) return [];
    const items = normalizedQuery
      ? category.items.filter((item) => `${item.question} ${item.answer}`.toLocaleLowerCase(locale === "id" ? "id-ID" : "en-US").includes(normalizedQuery))
      : category.items;
    return items.length ? [{ ...category, items }] : [];
  });
  const resultCount = visibleCategories.reduce((total, category) => total + category.items.length, 0);
  const hasPublishedFaq = categories.length > 0;

  function navigate(category: string, nextQuery: string) {
    if (isPending) return;
    startTransition(() => router.replace(filterHref(locale, category, nextQuery), { scroll: false }));
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate(activeCategory, searchValue.trim());
  }

  function selectCategory(event: MouseEvent<HTMLAnchorElement>, category: string) {
    event.preventDefault();
    navigate(category, searchValue.trim());
  }

  return (
    <section aria-labelledby="faq-desk-title" className="mx-auto w-full max-w-[1440px] px-6 py-16 sm:px-10 sm:py-20 lg:px-20 lg:py-28">
      <div className="grid gap-10 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-16 xl:grid-cols-[21rem_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <h2 id="faq-desk-title" className="font-display text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-none tracking-[-0.04em]">FAQ desk</h2>
          <form action={`/${locale}/faq`} method="get" onSubmit={submitSearch} className="mt-8 border-t border-[var(--ink)] pt-6">
            <label htmlFor="faq-search" className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{content.searchLabel}</label>
            <div className="mt-3 flex border border-[var(--line)] bg-white focus-within:border-[var(--accent)]">
              <input id="faq-search" name="q" value={searchValue} maxLength={100} onChange={(event) => setSearchValue(event.target.value)} placeholder={content.searchPlaceholder} className="min-h-12 min-w-0 flex-1 bg-transparent px-4 outline-none" />
              {activeCategory ? <input type="hidden" name="category" value={activeCategory} /> : null}
              <button disabled={isPending} className="min-h-12 border-l border-[var(--line)] px-4 text-sm font-semibold hover:bg-[var(--ink)] hover:text-white disabled:cursor-wait disabled:opacity-50">{content.searchButton}</button>
            </div>
          </form>
          <nav aria-label={locale === "id" ? "Filter kategori FAQ" : "FAQ category filters"} className="mt-8 border-t border-[var(--line)]">
            <Link href={filterHref(locale, "", searchValue.trim())} prefetch={false} scroll={false} onClick={(event) => selectCategory(event, "")} aria-current={!activeCategory ? "page" : undefined} aria-disabled={isPending} className={`flex min-h-12 items-center justify-between border-b border-[var(--line)] text-sm font-semibold ${!activeCategory ? "text-[var(--ink)]" : "text-[var(--muted)] hover:text-[var(--ink)]"} ${isPending ? "pointer-events-none opacity-50" : ""}`}><span>{content.allCategories}</span><span aria-hidden="true">{!activeCategory ? "●" : "○"}</span></Link>
            {categories.map((category) => <Link key={category.id} href={filterHref(locale, category.slug, searchValue.trim())} prefetch={false} scroll={false} onClick={(event) => selectCategory(event, category.slug)} aria-current={activeCategory === category.slug ? "page" : undefined} aria-disabled={isPending} className={`flex min-h-12 items-center justify-between border-b border-[var(--line)] text-sm font-semibold ${activeCategory === category.slug ? "text-[var(--ink)]" : "text-[var(--muted)] hover:text-[var(--ink)]"} ${isPending ? "pointer-events-none opacity-50" : ""}`}><span>{category.title}</span><span aria-hidden="true">{activeCategory === category.slug ? "●" : "○"}</span></Link>)}
          </nav>
        </aside>

        <div aria-busy={isPending}>
          <div aria-hidden="true" className="h-0.5 overflow-hidden bg-[var(--line)]"><span className={`block h-full bg-[var(--accent)] transition-[width,opacity] duration-300 motion-safe:animate-pulse ${isPending ? "w-2/3 opacity-100" : "w-0 opacity-0"}`} /></div>
          {hasPublishedFaq ? <p className="border-b border-[var(--ink)] py-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]" role="status" aria-live="polite">{isPending ? content.loadingLabel : `${resultCount} ${content.resultsLabel}`}</p> : null}
          {visibleCategories.map((category) => (
            <section key={category.id} aria-labelledby={`faq-category-${category.id}`} className="border-b border-[var(--ink)] py-9 first:pt-6">
              <div className="grid gap-5 sm:grid-cols-[2.5rem_1fr]"><span className="font-display text-sm font-semibold text-[var(--accent)]">{String(categories.findIndex((entry) => entry.id === category.id) + 1).padStart(2, "0")}</span><div><h3 id={`faq-category-${category.id}`} className="font-display text-2xl font-semibold tracking-[-0.03em]">{category.title}</h3><div className="mt-5 border-t border-[var(--line)]">
                {category.items.map((item) => <details key={item.id} className="group border-b border-[var(--line)]"><summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-4 font-semibold leading-6 marker:content-none"><span>{item.question}</span><span className="grid size-8 shrink-0 place-items-center rounded-full border border-[var(--line)] text-xl font-normal transition-transform group-open:rotate-45" aria-hidden="true">+</span></summary><div className="max-w-3xl whitespace-pre-line pb-6 pr-10 leading-7 text-[var(--muted)] sm:pr-16">{item.answer}</div></details>)}
              </div></div></div>
            </section>
          ))}
          {!hasPublishedFaq ? <div className="border-y border-[var(--ink)] py-14"><p className="font-display text-3xl font-semibold tracking-[-0.04em]">{content.emptyTitle}</p><p className="mt-5 max-w-xl leading-7 text-[var(--muted)]">{content.emptyDescription}</p></div> : null}
          {hasPublishedFaq && resultCount === 0 ? <div className="border-b border-[var(--ink)] py-14"><p className="font-display text-3xl font-semibold tracking-[-0.04em]">{content.noResultsTitle}</p><p className="mt-5 max-w-xl leading-7 text-[var(--muted)]">{content.noResultsDescription}</p><Link href={`/${locale}/faq`} prefetch={false} scroll={false} onClick={(event) => { event.preventDefault(); setSearchValue(""); navigate("", ""); }} className="mt-7 inline-flex min-h-11 items-center border border-[var(--ink)] px-5 text-sm font-semibold hover:bg-[var(--ink)] hover:text-white">{content.clearFilters}</Link></div> : null}
        </div>
      </div>
    </section>
  );
}
