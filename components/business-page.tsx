import Image from "next/image";
import Link from "next/link";

import { BusinessFocusShowcase } from "@/components/business-focus-showcase";
import type { BusinessPageContent, BusinessStep } from "@/content/business-content";
import { getLocaleHref, type Locale } from "@/content/site-content";

type BusinessPageProps = {
  content: BusinessPageContent;
  locale: Locale;
};

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

function HeroSection({ content }: { content: BusinessPageContent }) {
  return (
    <section className="interior-hero relative isolate overflow-hidden bg-[var(--ink)] text-white">
      <Image
        src={content.heroImage}
        alt={content.heroImageAlt}
        fill
        loading="eager"
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(1,20,27,.88)_0%,rgba(1,36,46,.52)_56%,rgba(1,20,27,.2)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(1,20,27,.9)_0%,rgba(1,20,27,.05)_72%)]" />
      <div className="hero-safe-content relative z-10 mx-auto flex w-full max-w-[1440px] items-end px-6 pb-16 sm:px-10 sm:pb-20 lg:px-20 lg:pb-24">
        <div className="max-w-5xl">
          <p className="hero-breadcrumb mb-8 flex flex-wrap items-center gap-3 text-white/90">
            <span>{content.breadcrumbHome}</span>
            <span aria-hidden="true" className="text-white/60">/</span>
            <span>{content.breadcrumbCurrent}</span>
          </p>
          <p className="hero-eyebrow mb-5 text-[var(--accent)]">{content.eyebrow}</p>
          <h1 className="hero-title max-w-4xl text-white">{content.title}</h1>
          <p className="hero-description mt-7 max-w-3xl text-white/90">{content.description}</p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Introduction with highlight stat                                   */
/* ------------------------------------------------------------------ */

function IntroductionSection({ content }: { content: BusinessPageContent }) {
  return (
    <section className="border-b border-[var(--line)] bg-[var(--paper)]">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-16 sm:px-10 sm:py-20 lg:px-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr] lg:gap-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              {content.introductionLabel}
            </p>
            <h2 className="mt-4 max-w-lg font-display text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.06em] text-[var(--ink)]">
              {content.introductionTitle}
            </h2>
            {/* Highlight stat */}
            <div className="mt-10 border-l-2 border-[var(--accent)] pl-5">
              <span className="font-display text-[clamp(3.5rem,8vw,5.5rem)] font-semibold leading-none tracking-[-0.06em] text-[var(--ink)]">
                {content.introductionHighlight}
              </span>
              <p className="mt-2 max-w-xs text-sm leading-6 text-[var(--muted)]">
                {content.introductionHighlightLabel}
              </p>
            </div>
          </div>
          <div className="max-w-3xl space-y-5 text-lg leading-8 text-[var(--muted)] lg:pt-1">
            {content.introductionBody.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SystemFocusSection({ content }: { content: BusinessPageContent }) {
  return (
    <section className="border-b border-[var(--line)] bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-16 sm:px-10 sm:py-20 lg:px-20 lg:py-28">
        <div className="mb-12 max-w-2xl lg:mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
            {content.focusLabel}
          </p>
          <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.06em] text-[var(--ink)]">
            {content.focusTitle}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-[var(--muted)]">
            {content.focusDescription}
          </p>
        </div>
        <BusinessFocusShowcase
          focuses={content.focuses}
          previousLabel={content.focusPreviousLabel}
          nextLabel={content.focusNextLabel}
          slideLabel={content.focusSlideLabel}
        />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Equipment — full-bleed media with overlay copy                     */
/* ------------------------------------------------------------------ */

function EquipmentSection({ content }: { content: BusinessPageContent }) {
  return (
    <section className="relative isolate min-h-[32rem] overflow-hidden bg-[var(--ink)] text-white sm:min-h-[36rem] lg:min-h-[40rem]">
      <Image
        src={content.heroImage}
        alt={content.equipmentImageAlt}
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(5,14,20,.94)_0%,rgba(5,14,20,.6)_40%,rgba(5,14,20,.2)_75%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,14,20,.7)_0%,transparent_60%)]" />
      <div className="relative z-10 mx-auto flex h-full min-h-[inherit] w-full max-w-[1440px] items-end px-6 pb-16 pt-24 sm:px-10 sm:pb-20 lg:px-20 lg:pb-24">
        <div className="max-w-2xl">
          <span aria-hidden="true" className="mb-6 block h-px w-16 bg-[var(--accent)]" />
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
            {content.equipmentLabel}
          </p>
          <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.06em] text-white">
            {content.equipmentTitle}
          </h2>
          <div className="mt-7 space-y-5 text-lg leading-8 text-white/75">
            {content.equipmentBody.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Approach                                                           */
/* ------------------------------------------------------------------ */

function ApproachStep({ step }: { step: BusinessStep }) {
  return (
    <li className="flex min-h-64 flex-col rounded-2xl bg-white p-6 sm:p-7 lg:min-h-72 lg:even:translate-y-8">
      <span className="font-display text-[clamp(3.5rem,6vw,5rem)] font-semibold leading-none tracking-[-0.07em] text-[var(--accent)]/25">
        {step.number}
      </span>
      <h3 className="mt-auto pt-8 font-display text-[clamp(1.25rem,2vw,1.5rem)] font-semibold leading-tight tracking-[-0.04em] text-[var(--ink)]">
        {step.title}
      </h3>
      <p className="mt-3 text-base leading-7 text-[var(--muted)]">{step.body}</p>
    </li>
  );
}

function ApproachSection({ content }: { content: BusinessPageContent }) {
  return (
    <section className="bg-[var(--paper)]">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-16 sm:px-10 sm:py-20 lg:px-20 lg:py-28">
        <div className="mb-12 grid gap-6 lg:mb-16 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              {content.approachLabel}
            </p>
            <h2 className="mt-4 max-w-lg font-display text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.06em] text-[var(--ink)]">
              {content.approachTitle}
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-[var(--muted)] lg:pt-2">
            {content.approachDescription}
          </p>
        </div>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5 lg:pb-8">
          {content.steps.map((step) => (
            <ApproachStep key={step.number} step={step} />
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  CTA                                                                */
/* ------------------------------------------------------------------ */

function CtaSection({
  content,
  locale,
}: {
  content: BusinessPageContent;
  locale: Locale;
}) {
  return (
    <section className="bg-[var(--accent)] text-white">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-20 text-center sm:px-10 sm:py-24 lg:px-20 lg:py-32">
        <h2 className="mx-auto max-w-3xl font-display text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-none tracking-[-0.07em]">
          {content.ctaTitle}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/85">
          {content.ctaBody}
        </p>
        <Link
          href={getLocaleHref(content.ctaHref, locale)}
          className="mt-10 inline-flex min-h-12 items-center rounded-full border border-white bg-white px-7 text-sm font-semibold text-[var(--accent-strong)] transition-colors hover:bg-transparent hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          {content.ctaLabel}
          <span aria-hidden="true" className="ml-3 text-lg leading-none">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export function BusinessPage({ content, locale }: BusinessPageProps) {
  return (
    <main id="main-content" className="flex-1 bg-[var(--paper)]">
      <HeroSection content={content} />
      <IntroductionSection content={content} />
      <SystemFocusSection content={content} />
      <EquipmentSection content={content} />
      <ApproachSection content={content} />
      <CtaSection content={content} locale={locale} />
    </main>
  );
}
