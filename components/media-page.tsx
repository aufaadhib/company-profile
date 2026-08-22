"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { A11y, Autoplay, EffectFade, Keyboard, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { usePrefersReducedMotion } from "@/components/use-prefers-reduced-motion";
import type { MediaCategory, MediaItem, MediaPageContent } from "@/content/media-content";
import type { Locale } from "@/content/site-content";

type MediaPageProps = {
  content: MediaPageContent;
  locale: Locale;
  detailBasePath: string;
};

type MediaCardProps = {
  item: MediaItem;
  content: MediaPageContent;
  locale: Locale;
  href: string;
};

type ActiveCategory = MediaCategory | "all";

function formatMediaDate(date: string, locale: "id" | "en") {
  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

function MediaMeta({ item, content, locale }: { item: MediaItem; content: MediaPageContent; locale: Locale }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
      <span>{content.categoryLabels[item.category]}</span>
      <span aria-hidden="true" className="text-[var(--line)]">/</span>
      <time dateTime={item.publishedAt} className="text-[var(--muted)]">
        {formatMediaDate(item.publishedAt, locale)}
      </time>
    </div>
  );
}

function MediaCard({ item, content, locale, href }: MediaCardProps) {
  return (
    <article className="group flex h-full flex-col border-b border-[var(--line)] pb-8">
      <Link href={href} className="block overflow-hidden rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]">
        <div className="relative aspect-[4/3] overflow-hidden bg-[var(--ink)]">
          <Image
            src={item.image}
            alt={item.imageAlt}
            fill
            sizes="(max-width: 639px) calc(100vw - 3rem), (max-width: 1023px) calc(50vw - 3rem), 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col pt-5">
        <MediaMeta item={item} content={content} locale={locale} />
        <h3 className="mt-4 font-display text-[clamp(1.35rem,2vw,1.75rem)] font-semibold leading-tight tracking-[-0.05em] text-[var(--ink)]">
          <Link href={href} className="transition-colors hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]">
            {item.title}
          </Link>
        </h3>
        <p className="mt-3 text-base leading-7 text-[var(--muted)]">{item.excerpt}</p>
        <Link href={href} className="mt-6 inline-flex min-h-11 w-fit items-center text-sm font-semibold text-[var(--ink)] transition-colors hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]">
          {content.readMoreLabel}
          <span aria-hidden="true" className="ml-3 text-lg leading-none transition-transform group-hover:translate-x-1 motion-reduce:transition-none">→</span>
        </Link>
      </div>
    </article>
  );
}

export function MediaPage({ content, locale, detailBasePath }: MediaPageProps) {
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>("all");
  const reducedMotion = usePrefersReducedMotion();
  const latestNews = [...content.items]
    .sort((first, second) => second.publishedAt.localeCompare(first.publishedAt))
    .slice(0, 3);
  const activeItems = activeCategory === "all" ? content.items : content.items.filter((item) => item.category === activeCategory);
  const featuredItem = activeCategory === "all"
    ? activeItems.find((item) => item.featured) ?? activeItems[0]
    : activeItems[0];
  const supportingItems = activeItems.filter((item) => item.id !== featuredItem?.id);

  return (
    <main id="main-content" className="flex-1 bg-[var(--paper)]">
      <section aria-labelledby="media-hero-title" className="media-news-hero relative isolate h-[100svh] min-h-[100svh] max-h-[100svh] overflow-hidden bg-[var(--ink)] text-white">
        <h1 id="media-hero-title" className="sr-only">{content.title}</h1>
        <Swiper
          a11y={{
            containerMessage: content.title,
            itemRoleDescriptionMessage: locale === "id" ? "berita" : "news story",
            paginationBulletMessage: locale === "id" ? "Buka berita {{index}}" : "Open news story {{index}}",
          }}
          aria-label={content.title}
          autoplay={{ enabled: !reducedMotion, delay: 8000, disableOnInteraction: false, pauseOnMouseEnter: false }}
          className="media-news-hero__swiper h-full"
          effect="fade"
          fadeEffect={{ crossFade: true }}
          keyboard={{ enabled: true }}
          key={reducedMotion ? "reduced-motion" : "autoplay"}
          modules={[A11y, Autoplay, EffectFade, Keyboard, Pagination]}
          pagination={{ clickable: true }}
          speed={1000}
        >
          {latestNews.map((item, index) => (
            <SwiperSlide key={item.id} className="relative !flex h-full min-h-0">
              <Image
                src={item.image}
                alt={item.imageAlt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(1,20,27,.9)_0%,rgba(1,36,46,.55)_58%,rgba(1,20,27,.25)_100%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(1,20,27,.94)_0%,rgba(1,20,27,.12)_78%)]" />
              <div className="relative z-10 mx-auto flex h-full w-full max-w-[1440px] items-end px-6 pb-24 pt-36 sm:px-10 sm:pb-24 lg:px-20 lg:pb-16">
                <div className="max-w-4xl">
                  <div className="hero-eyebrow mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-white/75">
                    <span>{content.eyebrow}</span>
                    <span aria-hidden="true" className="text-[var(--accent)]">/</span>
                    <span>{String(index + 1).padStart(2, "0")} / 03</span>
                  </div>
                  <div className="hero-meta flex flex-wrap items-center gap-x-3 gap-y-1 text-[var(--accent)]">
                    <span>{content.categoryLabels[item.category]}</span>
                    <span aria-hidden="true" className="text-white/40">/</span>
                    <time dateTime={item.publishedAt} className="text-white/70">{formatMediaDate(item.publishedAt, locale)}</time>
                  </div>
                  <h2 className="hero-title mt-5 max-w-4xl text-white">{item.title}</h2>
                  <p className="hero-description mt-6 max-w-2xl text-white/85">{item.excerpt}</p>
                  <Link href={`${detailBasePath}/${item.slug}`} className="hero-action mt-8 inline-flex min-h-12 w-fit items-center rounded-full border border-white/70 px-5 text-white transition-colors hover:bg-white hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                    {content.readMoreLabel}
                    <span aria-hidden="true" className="ml-3 text-lg leading-none">→</span>
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section className="mx-auto w-full max-w-[1440px] px-6 py-16 sm:px-10 sm:py-20 lg:px-20 lg:py-28">
        <div className="flex flex-col gap-6 border-b border-[var(--line)] pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">{content.latestLabel}</p>
            <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.06em] text-[var(--ink)]">{content.featuredLabel}</h2>
          </div>
          <nav aria-label={content.latestLabel} className="flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={activeCategory === "all"}
              className={`min-h-11 rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${activeCategory === "all" ? "border-[var(--ink)] bg-[var(--ink)] text-white" : "border-[var(--line)] text-[var(--muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]"}`}
              onClick={() => setActiveCategory("all")}
            >
              {content.allLabel}
            </button>
            {(Object.keys(content.categoryLabels) as MediaCategory[]).map((category) => (
              <button
                key={category}
                type="button"
                aria-pressed={activeCategory === category}
                className={`min-h-11 rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${activeCategory === category ? "border-[var(--ink)] bg-[var(--ink)] text-white" : "border-[var(--line)] text-[var(--muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]"}`}
                onClick={() => setActiveCategory(category)}
              >
                {content.categoryLabels[category]}
              </button>
            ))}
          </nav>
        </div>

        {featuredItem ? (
          <article className="mt-10 grid overflow-hidden rounded-2xl bg-[var(--ink)] text-white lg:grid-cols-[1.08fr_.92fr]">
            <Link href={`${detailBasePath}/${featuredItem.slug}`} className="group relative block min-h-[18rem] overflow-hidden sm:min-h-[24rem] lg:min-h-[32rem] focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white">
              <Image
                src={featuredItem.image}
                alt={featuredItem.imageAlt}
                fill
                sizes="(max-width: 1023px) 100vw, 55vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
            </Link>
            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
              <MediaMeta item={featuredItem} content={content} locale={locale} />
              <h3 className="mt-5 font-display text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-tight tracking-[-0.06em] text-white">{featuredItem.title}</h3>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">{featuredItem.excerpt}</p>
              <Link href={`${detailBasePath}/${featuredItem.slug}`} className="mt-8 inline-flex min-h-12 w-fit items-center rounded-full border border-white/70 px-5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                {content.readMoreLabel}
                <span aria-hidden="true" className="ml-3 text-lg leading-none">→</span>
              </Link>
            </div>
          </article>
        ) : null}

        <div className="mt-16">
          <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-tight tracking-[-0.06em] text-[var(--ink)]">{content.latestLabel}</h2>
          {supportingItems.length > 0 ? (
            <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
              {supportingItems.map((item) => (
                <MediaCard key={item.id} item={item} content={content} locale={locale} href={`${detailBasePath}/${item.slug}`} />
              ))}
            </div>
          ) : (
            <p className="mt-6 text-base leading-7 text-[var(--muted)]">{content.readMoreLabel}</p>
          )}
        </div>
      </section>
    </main>
  );
}
