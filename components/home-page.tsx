import Image from "next/image";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";

import { HeroCarousel } from "@/components/hero-carousel";
import { HomeLatestMedia, HomeLatestMediaFallback } from "@/components/home-latest-media";
import { HomeSolutions } from "@/components/home-solutions";
import { homePageContent } from "@/content/home-content";
import type { Locale, SiteContent } from "@/content/site-content";

type HomePageProps = {
  locale: Locale;
  siteContent: SiteContent;
};

function EditorialLink({ href, children, inverse = false }: { href: string; children: ReactNode; inverse?: boolean }) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 items-center gap-3 border-b pb-1 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 ${inverse ? "border-white/40 text-white hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-white" : "border-[var(--ink)]/35 text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-[var(--accent)]"}`}
    >
      <span>{children}</span>
      <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="none">
        <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}

export function HomePage({ locale, siteContent }: HomePageProps) {
  const content = homePageContent[locale];
  const aboutHref = locale === "id" ? "/id/tentang-kami" : "/en/about";
  const businessHref = locale === "id" ? "/id/bisnis" : "/en/business";
  const focusHref = `${aboutHref}#fokus-solusi`;
  const sustainabilityHref = locale === "id" ? "/id/keberlanjutan" : "/en/sustainability";
  const mediaHref = locale === "id" ? "/id/media-informasi" : "/en/media-information";
  const contactHref = locale === "id" ? "/id/kontak" : "/en/contact";

  return (
    <>
      <HeroCarousel slides={siteContent.slides} content={siteContent} />

      <section id="profil-afana" className="scroll-mt-20 border-b border-[var(--line)] bg-[var(--paper)]">
        <div className="mx-auto grid w-full max-w-[1440px] gap-12 px-6 py-20 sm:px-10 sm:py-24 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-20 lg:px-20 lg:py-32">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[var(--line)]">
            <Image
              src="/images/about/afana-technicians.jpg"
              alt={content.about.imageAlt}
              fill
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover"
            />
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[var(--accent)]" />
          </div>

          <div className="lg:py-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">{content.about.label}</p>
            <h2 className="mt-5 max-w-3xl font-display text-[clamp(2.25rem,1.8rem+1.6vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.045em] text-balance">
              {content.about.title}
            </h2>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[var(--muted)]">{content.about.body}</p>
            <div className="mt-9">
              <EditorialLink href={aboutHref}>{content.about.linkLabel}</EditorialLink>
            </div>
          </div>
        </div>
      </section>

      <HomeSolutions content={content.solutions} detailHref={businessHref} />

      <section id="cara-kerja-afana" className="scroll-mt-20 bg-[var(--ink)] text-white">
        <div className="mx-auto w-full max-w-[1440px] px-6 py-20 sm:px-10 sm:py-24 lg:px-20 lg:py-28">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-20">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">{content.focus.label}</p>
            <div>
              <h2 className="max-w-4xl font-display text-[clamp(2.25rem,1.8rem+1.6vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.045em] text-balance">
                {content.focus.title}
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">{content.focus.description}</p>
            </div>
          </div>

          <ol className="mt-16 grid gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-4">
            {content.focus.steps.map((step) => (
              <li key={step.number} className="relative border-t border-white/25 pt-7">
                <span aria-hidden="true" className="absolute -top-1.5 left-0 h-3 w-3 rounded-full border-2 border-[var(--ink)] bg-[var(--accent)] ring-1 ring-[var(--accent)]" />
                <span className="text-xs font-semibold tracking-[0.16em] text-white/45">{step.number}</span>
                <h3 className="mt-5 font-display text-xl font-semibold tracking-[-0.03em]">{step.title}</h3>
                <p className="mt-4 text-base leading-7 text-white/60">{step.body}</p>
              </li>
            ))}
          </ol>

          <div className="mt-12 flex justify-end">
            <EditorialLink href={focusHref} inverse>{content.focus.linkLabel}</EditorialLink>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--line)] bg-white">
        <div className="mx-auto grid w-full max-w-[1440px] gap-12 px-6 py-20 sm:px-10 sm:py-24 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center lg:gap-20 lg:px-20 lg:py-32">
          <div className="lg:py-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">{content.sustainability.label}</p>
            <h2 className="mt-5 max-w-2xl font-display text-[clamp(2.25rem,1.8rem+1.6vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.045em] text-balance">
              {content.sustainability.title}
            </h2>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[var(--muted)]">{content.sustainability.body}</p>
            <div className="mt-9">
              <EditorialLink href={sustainabilityHref}>{content.sustainability.linkLabel}</EditorialLink>
            </div>
          </div>

          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-[var(--line)] lg:order-last">
            <Image
              src="/images/sustainability/power-quality-inspection.png"
              alt={content.sustainability.imageAlt}
              fill
              sizes="(min-width: 1024px) 52vw, 100vw"
              quality={90}
              className="object-cover"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_58%,rgba(16,24,32,.38)_100%)]" />
          </div>
        </div>
      </section>

      <section className="bg-[var(--paper)]">
        <div className="mx-auto w-full max-w-[1440px] px-6 py-20 sm:px-10 sm:py-24 lg:px-20 lg:py-28">
          <div className="grid gap-7 border-b border-[var(--line)] pb-10 lg:grid-cols-2 lg:items-end lg:gap-16 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_auto]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">{content.media.label}</p>
              <h2 className="mt-5 max-w-2xl font-display text-[clamp(2.25rem,1.8rem+1.6vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.045em] text-balance">
                {content.media.title}
              </h2>
            </div>
            <p className="max-w-xl text-lg leading-8 text-[var(--muted)]">{content.media.description}</p>
            <div className="lg:col-start-2 xl:col-start-auto">
              <EditorialLink href={mediaHref}>{content.media.allLabel}</EditorialLink>
            </div>
          </div>

          <div className="mt-12">
            <Suspense fallback={<HomeLatestMediaFallback locale={locale} />}>
              <HomeLatestMedia locale={locale} />
            </Suspense>
          </div>
        </div>
      </section>

      <section className="bg-[var(--accent)] text-white">
        <div className="mx-auto grid w-full max-w-[1440px] gap-8 px-6 py-16 sm:px-10 sm:py-20 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:px-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/75">{content.contact.label}</p>
            <h2 className="mt-5 max-w-4xl font-display text-[clamp(2.5rem,2rem+2vw,4.5rem)] font-semibold leading-[1] tracking-[-0.05em] text-balance">
              {content.contact.title}
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85">{content.contact.body}</p>
          </div>
          <Link
            href={contactHref}
            className="inline-flex min-h-12 w-fit items-center gap-3 rounded-full border border-white px-6 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[var(--accent-strong)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            {content.contact.linkLabel}
            <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
