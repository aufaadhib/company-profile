import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/content/site-content";
import type { MediaItem, MediaPageContent } from "@/content/media-content";

type MediaArticleProps = {
  content: MediaPageContent;
  item: MediaItem;
  locale: Locale;
  detailBasePath: string;
};

function formatMediaDate(date: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export function MediaArticle({ content, item, locale, detailBasePath }: MediaArticleProps) {
  const relatedItems = content.items.filter((candidate) => candidate.id !== item.id).slice(0, 3);

  return (
    <main id="main-content" className="flex-1 bg-[var(--paper)]">
      <section className="interior-hero bg-[var(--ink)] text-white">
        <div className="hero-safe-content mx-auto flex w-full max-w-[1180px] flex-col justify-end px-6 pb-16 sm:px-10 sm:pb-20 lg:px-12 lg:pb-24">
          <Link href={detailBasePath} className="hero-action inline-flex min-h-11 w-fit items-center text-white/75 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            <span aria-hidden="true" className="mr-3 text-lg leading-none">←</span>
            {content.backLabel}
          </Link>
          <div className="mt-12 max-w-4xl">
            <div className="hero-meta flex flex-wrap items-center gap-x-3 gap-y-1 text-[var(--accent)]">
              <span>{content.categoryLabels[item.category]}</span>
              <span aria-hidden="true" className="text-white/35">/</span>
              <time dateTime={item.publishedAt} className="text-white/60">{formatMediaDate(item.publishedAt, locale)}</time>
            </div>
            <h1 className="hero-title mt-5 text-white">{item.title}</h1>
            <p className="hero-description mt-7 max-w-2xl text-white/80">{item.excerpt}</p>
          </div>
        </div>
      </section>

      <article className="mx-auto w-full max-w-[1180px] px-6 py-12 sm:px-10 sm:py-16 lg:px-12 lg:py-20">
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-[var(--ink)]">
          <Image src={item.image} alt={item.imageAlt} fill priority sizes="(max-width: 1180px) calc(100vw - 3rem), 1180px" quality={90} className="object-cover" />
        </div>
        <div className="mx-auto mt-12 max-w-3xl space-y-6 text-lg leading-8 text-[var(--muted)] sm:mt-16 sm:text-xl sm:leading-9">
          {item.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>

      <section className="border-t border-[var(--line)]">
        <div className="mx-auto w-full max-w-[1180px] px-6 py-14 sm:px-10 sm:py-16 lg:px-12 lg:py-20">
          <h2 className="font-display text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-tight tracking-[-0.06em] text-[var(--ink)]">{content.relatedLabel}</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {relatedItems.map((relatedItem) => (
              <article key={relatedItem.id} className="group">
                <Link href={`${detailBasePath}/${relatedItem.slug}`} className="block overflow-hidden rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]">
                  <div className="relative aspect-[4/3] overflow-hidden bg-[var(--ink)]">
                    <Image
                      src={relatedItem.image}
                      alt={relatedItem.imageAlt}
                      fill
                      sizes="(max-width: 639px) calc(100vw - 3rem), (max-width: 1023px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  </div>
                </Link>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">{content.categoryLabels[relatedItem.category]}</p>
                <h3 className="mt-3 font-display text-xl font-semibold leading-tight tracking-[-0.05em] text-[var(--ink)]">
                  <Link href={`${detailBasePath}/${relatedItem.slug}`} className="transition-colors hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]">{relatedItem.title}</Link>
                </h3>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
