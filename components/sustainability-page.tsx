import Image from "next/image";
import Link from "next/link";

import type { SustainabilityPageContent, SustainabilityStep } from "@/content/sustainability-content";
import { getLocaleHref } from "@/content/site-content";
import type { Locale } from "@/content/site-content";

type SustainabilityPageProps = {
  content: SustainabilityPageContent;
  locale: Locale;
};

function FlowStep({ step }: { step: SustainabilityStep }) {
  return (
    <li className="relative rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-6 sm:p-7 xl:rounded-none xl:border-0 xl:bg-transparent xl:px-0 xl:pb-0 xl:pr-7 xl:pt-10 xl:last:pr-0 xl:before:absolute xl:before:left-0 xl:before:top-1.5 xl:before:size-3 xl:before:rounded-full xl:before:bg-[var(--accent)] xl:before:ring-[6px] xl:before:ring-white">
      <span className="font-display text-sm font-semibold tracking-[0.14em] text-[var(--accent)]">{step.number}</span>
      <h3 className="mt-4 font-display text-[clamp(1.25rem,2vw,1.7rem)] font-semibold leading-tight tracking-[-0.045em] text-[var(--ink)] xl:min-h-16">{step.title}</h3>
      <p className="mt-3 text-base leading-7 text-[var(--muted)]">{step.body}</p>
    </li>
  );
}

export function SustainabilityPage({ content, locale }: SustainabilityPageProps) {
  return (
    <main id="main-content" className="flex-1 bg-[var(--paper)]">
      <section className="relative isolate h-[60svh] min-h-[32rem] overflow-hidden bg-[var(--ink)] text-white">
        <Image src={content.heroImage} alt="" fill loading="eager" sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(1,20,27,.88)_0%,rgba(1,36,46,.52)_56%,rgba(1,20,27,.2)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(1,20,27,.9)_0%,rgba(1,20,27,.05)_72%)]" />
        <div className="relative z-10 mx-auto flex h-full w-full max-w-[1440px] items-end px-6 pb-16 pt-36 sm:px-10 sm:pb-20 lg:px-20 lg:pb-24">
          <div className="max-w-5xl">
            <p className="hero-breadcrumb mb-8 flex flex-wrap items-center gap-3 text-white/90">
              <span>{content.breadcrumbHome}</span><span aria-hidden="true" className="text-white/60">/</span><span>{content.breadcrumbCurrent}</span>
            </p>
            <p className="hero-eyebrow mb-5 text-[var(--accent)]">{content.eyebrow}</p>
            <h1 className="hero-title max-w-4xl text-white">{content.title}</h1>
            <p className="hero-description mt-7 max-w-3xl text-white/90">{content.description}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1440px] gap-10 border-b border-[var(--line)] px-6 py-16 sm:px-10 sm:py-20 lg:grid-cols-[.75fr_1.25fr] lg:gap-20 lg:px-20 lg:py-28">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">{content.introductionLabel}</p>
          <h2 className="mt-4 max-w-md font-display text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.06em] text-[var(--ink)]">{content.introductionTitle}</h2>
        </div>
        <div className="max-w-3xl space-y-5 text-lg leading-8 text-[var(--muted)] lg:pt-1">{content.introductionBody.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      </section>

      <section className="border-b border-[var(--line)] bg-white">
        <div className="mx-auto max-w-[1440px] px-6 py-16 sm:px-10 sm:py-20 lg:px-20 lg:py-28">
          <div className="grid gap-8 xl:grid-cols-[.7fr_1.3fr] xl:gap-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">{content.flowLabel}</p>
              <h2 className="mt-4 max-w-md font-display text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.06em] text-[var(--ink)]">{content.flowTitle}</h2>
              <p className="mt-5 max-w-md text-base leading-7 text-[var(--muted)]">{content.flowDescription}</p>
            </div>
            <ol className="relative grid gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-0 xl:before:absolute xl:before:left-0 xl:before:right-1/4 xl:before:top-3 xl:before:h-px xl:before:bg-[var(--line)]">{content.steps.map((step) => <FlowStep key={step.number} step={step} />)}</ol>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1440px] gap-10 border-b border-[var(--line)] px-6 py-16 sm:px-10 sm:py-20 lg:grid-cols-[1fr_1fr] lg:gap-20 lg:px-20 lg:py-28">
        <div className="relative min-h-[22rem] overflow-hidden rounded-2xl sm:min-h-[30rem] lg:min-h-full"><Image src={content.inspectionImage} alt="" fill quality={90} sizes="(max-width: 1023px) calc(100vw - 3rem), 50vw" className="object-cover" /></div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">{content.focusLabel}</p>
          <h2 className="mt-4 max-w-xl font-display text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.06em] text-[var(--ink)]">{content.focusTitle}</h2>
          <div className="mt-10 divide-y divide-[var(--line)]">{content.focuses.map((focus, index) => <article key={focus.title} className="py-6 first:pt-0"><p className="text-xs font-semibold tracking-[0.14em] text-[var(--accent)]">0{index + 1}</p><h3 className="mt-3 font-display text-xl font-semibold tracking-[-0.04em] text-[var(--ink)]">{focus.title}</h3><p className="mt-2 text-base leading-7 text-[var(--muted)]">{focus.body}</p></article>)}</div>
        </div>
      </section>

      <section className="bg-[var(--ink)] text-white">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-6 py-16 sm:px-10 sm:py-20 lg:grid-cols-[.7fr_1.3fr] lg:gap-20 lg:px-20 lg:py-28">
          <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">{content.practiceLabel}</p><h2 className="mt-4 max-w-md font-display text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.06em] text-white">{content.practiceTitle}</h2></div>
          <div className="grid gap-8 sm:grid-cols-3">{content.practices.map((practice, index) => <article key={practice.title} className="border-t border-white/20 pt-5"><p className="font-display text-sm font-semibold tracking-[0.14em] text-[var(--accent)]">0{index + 1}</p><h3 className="mt-5 font-display text-xl font-semibold tracking-[-0.04em] text-white">{practice.title}</h3><p className="mt-3 text-base leading-7 text-white/70">{practice.body}</p></article>)}</div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1440px] gap-10 border-b border-[var(--line)] px-6 py-16 sm:px-10 sm:py-20 lg:grid-cols-[1.1fr_.9fr] lg:gap-20 lg:px-20 lg:py-28">
        <div className="relative min-h-[20rem] overflow-hidden rounded-2xl sm:min-h-[28rem]"><Image src={content.infrastructureImage} alt={content.impactImageAlt} fill sizes="(max-width: 1023px) calc(100vw - 3rem), 55vw" className="object-cover" /></div>
        <div className="flex flex-col justify-center"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">{content.impactLabel}</p><h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.06em] text-[var(--ink)]">{content.impactTitle}</h2><ul className="mt-8 space-y-4 text-lg leading-8 text-[var(--muted)]">{content.impacts.map((impact) => <li key={impact} className="flex gap-3"><span aria-hidden="true" className="mt-3 size-2 shrink-0 rounded-full bg-[var(--accent)]" />{impact}</li>)}</ul></div>
      </section>

      <section className="bg-[var(--paper)] px-6 py-20 text-center sm:px-10 sm:py-24 lg:px-20 lg:py-32"><h2 className="mx-auto max-w-3xl font-display text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-none tracking-[-0.07em] text-[var(--ink)]">{content.ctaTitle}</h2><Link href={getLocaleHref(content.ctaHref, locale)} className="mt-8 inline-flex min-h-12 items-center rounded-full bg-[var(--ink)] px-6 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]">{content.ctaLabel}<span aria-hidden="true" className="ml-3 text-lg leading-none">→</span></Link></section>
    </main>
  );
}
