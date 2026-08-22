import Image from "next/image";
import Link from "next/link";

import { homePageContent } from "@/content/home-content";
import { mediaPageContent } from "@/content/media-content";
import type { Locale } from "@/content/site-content";
import { getPublishedMedia } from "@/lib/cms-service";

type HomeLatestMediaProps = {
  locale: Locale;
};

function formatDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export async function HomeLatestMedia({ locale }: HomeLatestMediaProps) {
  const items = (await getPublishedMedia(locale)).slice(0, 3);
  const homeContent = homePageContent[locale].media;
  const mediaContent = mediaPageContent[locale];
  const detailBasePath = locale === "id" ? "/id/media-informasi" : "/en/media-information";

  if (items.length === 0) {
    return <p className="border-t border-[var(--line)] py-8 text-base text-[var(--muted)]">{homeContent.emptyLabel}</p>;
  }

  return (
    <div className="grid gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-12">
      {items.map((item, index) => (
        <article
          key={item.id}
          className={`group border-t border-[var(--line)] pt-4 ${index === 0 ? "md:col-span-2 xl:col-span-6" : "xl:col-span-3"}`}
        >
          <Link
            href={`${detailBasePath}/${item.slug}`}
            className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-[var(--line)]">
              <Image
                src={item.image}
                alt={item.imageAlt}
                fill
                sizes={index === 0 ? "(min-width: 1280px) 50vw, (min-width: 768px) 100vw, 100vw" : "(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"}
                className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
              />
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-[0.12em]">
              <span>{mediaContent.categoryLabels[item.category]}</span>
              <span aria-hidden="true" className="text-[var(--line)]">/</span>
              <time dateTime={item.publishedAt} className="text-[var(--muted)]">{formatDate(item.publishedAt, locale)}</time>
            </div>
            <h3 className={`${index === 0 ? "text-2xl sm:text-3xl" : "text-xl"} mt-4 font-display font-semibold leading-tight tracking-[-0.035em] text-[var(--ink)] text-balance`}>
              {item.title}
            </h3>
            <p className="mt-3 line-clamp-3 text-base leading-7 text-[var(--muted)]">{item.excerpt}</p>
            <span className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--ink)] transition-colors group-hover:text-[var(--accent)]">
              {homeContent.readMoreLabel}
              <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                <path d="M5 11 11 5M6 5h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>
        </article>
      ))}
    </div>
  );
}

export function HomeLatestMediaFallback({ locale }: HomeLatestMediaProps) {
  return (
    <div aria-busy="true" aria-label={homePageContent[locale].media.loadingLabel}>
      <span className="sr-only">{homePageContent[locale].media.loadingLabel}</span>
      <div aria-hidden="true" className="grid gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-12">
        {[0, 1, 2].map((index) => (
          <div key={index} className={`border-t border-[var(--line)] pt-4 ${index === 0 ? "md:col-span-2 xl:col-span-6" : "xl:col-span-3"}`}>
            <div className="aspect-[16/10] animate-pulse rounded-2xl bg-[var(--line)] motion-reduce:animate-none" />
            <div className="mt-5 h-3 w-1/2 animate-pulse bg-[var(--line)] motion-reduce:animate-none" />
            <div className="mt-4 h-7 w-5/6 animate-pulse bg-[var(--line)] motion-reduce:animate-none" />
            <div className="mt-3 h-4 w-full animate-pulse bg-[var(--line)] motion-reduce:animate-none" />
          </div>
        ))}
      </div>
    </div>
  );
}
