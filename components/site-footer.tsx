import Link from "next/link";

import type { Locale, SiteContent } from "@/content/site-content";

type SiteFooterProps = {
  locale: Locale;
  content: SiteContent;
};

function resolveHref(href: string, locale: Locale) {
  return href.startsWith("/") ? `/${locale}${href}` : href;
}

function AfanaMark() {
  return (
    <svg aria-hidden="true" className="h-9 w-12" viewBox="0 0 56 40" fill="none">
      <path d="M4 30.5 17 9h10L14 30.5H4Z" fill="currentColor" />
      <path d="m22 30.5 13-21h10l-13 21H22Z" fill="currentColor" opacity=".7" />
      <path d="m29 20.5 6-11h10l-6 11H29Z" fill="currentColor" opacity=".42" />
    </svg>
  );
}

export function SiteFooter({ locale, content }: SiteFooterProps) {
  return (
    <footer className="bg-[var(--ink)] text-white">
      <div className="mx-auto grid w-full max-w-[1440px] gap-12 px-6 py-14 sm:px-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-10 lg:px-20 lg:py-20">
        <div className="max-w-sm">
          <Link href={`/${locale}`} className="inline-flex items-center gap-3 font-display text-xl font-semibold tracking-[-0.06em] text-white transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            <AfanaMark />
            <span>Afana</span>
          </Link>
          <p className="mt-6 max-w-xs text-sm leading-6 text-white/60">
            {locale === "id" ? "Ruang prototype untuk arah, identitas, dan pengalaman Afana." : "A prototype space for Afana's direction, identity, and experience."}
          </p>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">{locale === "id" ? "Jelajahi" : "Explore"}</h2>
          <nav aria-label="Footer primary navigation" className="mt-5 flex flex-col items-start gap-3">
            {content.nav.map((item) => (
              <Link key={item.label} href={resolveHref(item.href, locale)} className="text-sm text-white/75 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">{locale === "id" ? "Informasi" : "Information"}</h2>
          <nav aria-label="Footer utility navigation" className="mt-5 flex flex-col items-start gap-3">
            {content.mobileFooterNav.map((item) => (
              <Link key={item.label} href={resolveHref(item.href, locale)} className="text-sm text-white/75 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                {item.label}
              </Link>
            ))}
            <Link href={`/${locale === "id" ? "en" : "id"}`} className="text-sm text-white/75 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
              {content.languageLabel === "Bahasa" ? "English" : "Bahasa Indonesia"}
            </Link>
          </nav>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">{locale === "id" ? "Mulai" : "Start"}</h2>
          <p className="mt-5 max-w-xs text-sm leading-6 text-white/65">
            {locale === "id" ? "Sampaikan kebutuhan konten dan identitas yang ingin dikembangkan." : "Share the content and identity direction you want to develop."}
          </p>
          <Link href={content.headerCtaHref} className="mt-6 inline-flex min-h-11 items-center rounded-full border border-white/75 px-5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            {content.headerCtaLabel}
          </Link>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-2 px-6 py-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-20">
          <span>Afana / {locale.toUpperCase()}</span>
          <span>{locale === "id" ? "Prototype company profile" : "Company profile prototype"}</span>
        </div>
      </div>
    </footer>
  );
}
