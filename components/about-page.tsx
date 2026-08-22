import Image from "next/image";

import { AboutSectionHashSync } from "@/components/about-section-hash-sync";
import { AboutTimeline } from "@/components/about-timeline";
import { AboutSectionNav } from "@/components/about-section-nav";
import type { AboutPageContent, AboutSection } from "@/content/about-content";

type AboutPageProps = {
  content: AboutPageContent;
};

function AboutContentSection({ section }: { section: AboutSection }) {
  const isLogoMeaning = section.variant === "logo-meaning";

  return (
    <section id={section.id} className="scroll-mt-[calc(var(--header-offset)+5rem)] border-b border-[var(--line)] py-16 sm:py-20 lg:scroll-mt-[calc(var(--header-offset)+5rem)] lg:py-24">
      <div className="mx-auto max-w-5xl">
        {section.blocks ? (
          <div className={isLogoMeaning ? "space-y-10 sm:space-y-12" : "space-y-16"}>
            {section.blocks.map((block) => (
              <div key={block.title} className="max-w-5xl">
                <h2 className={`${isLogoMeaning ? "text-[clamp(1.45rem,2.5vw,2rem)] tracking-[-0.04em]" : "text-[clamp(2rem,4vw,3.5rem)] tracking-[-0.06em]"} font-display font-semibold leading-none text-[var(--ink)]`}>
                  {block.title}
                </h2>
                <div className={`${isLogoMeaning ? "mt-5 space-y-4 text-left text-base leading-7 sm:text-lg sm:leading-8" : "mt-4 space-y-5 text-justify text-lg leading-8"} text-[var(--muted)]`}>
                  {block.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {block.list ? (
                  <ol className={`${isLogoMeaning ? "mt-5 space-y-3 text-left" : "mt-5 space-y-2 text-justify"} list-decimal pl-5 text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8`}>
                    {block.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ol>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <>
            <h2 className="font-display text-[clamp(2rem,4vw,4rem)] font-semibold leading-none tracking-[-0.06em] text-[var(--ink)]">
              {section.title}
            </h2>
            <div className="mt-6 max-w-5xl space-y-5 text-justify text-lg leading-8 text-[var(--muted)]">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </>
        )}
        {section.image ? (
          <figure className="mt-10 overflow-hidden rounded-2xl">
            <Image
              src={section.image.src}
              alt={section.image.alt}
              width={2528}
              height={1686}
              unoptimized
              sizes="(max-width: 640px) calc(100vw - 3rem), (max-width: 1024px) calc(100vw - 5rem), 1024px"
              className="h-auto w-full object-cover"
            />
          </figure>
        ) : null}
        {section.logo ? (
          <figure className="mt-14 flex justify-center sm:mt-16 lg:relative lg:left-1/2 lg:w-screen lg:-translate-x-1/2">
            <Image
              src={section.logo.src}
              alt={section.logo.alt}
              width={250}
              height={80}
              sizes="(max-width: 639px) calc(100vw - 3rem), 76vw"
              className="h-auto w-[clamp(20rem,76vw,64rem)] max-w-full"
            />
          </figure>
        ) : null}
      </div>
    </section>
  );
}

export function AboutPage({ content }: AboutPageProps) {
  return (
    <main id="main-content" className="flex-1 bg-[var(--paper)]">
      <AboutSectionHashSync />
      <section className="relative isolate h-[60svh] min-h-[32rem] overflow-hidden bg-[var(--ink)] text-white">
        <Image
          src={content.heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(1,20,27,.8)_0%,rgba(1,36,46,.45)_52%,rgba(1,20,27,.3)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(1,20,27,.86)_0%,rgba(1,20,27,.08)_68%)]" />
        <div className="relative z-10 mx-auto flex h-full w-full max-w-[1440px] items-end px-6 pb-16 pt-36 sm:px-10 sm:pb-20 lg:px-20 lg:pb-24">
          <div className="max-w-5xl">
            <p className="hero-breadcrumb mb-8 flex flex-wrap items-center gap-3 text-white/90">
              <span>{content.breadcrumbHome}</span>
              <span aria-hidden="true" className="text-white/60">/</span>
              <span>{content.breadcrumbCurrent}</span>
            </p>
            <h1 className="hero-title text-white">
              {content.title}
            </h1>
            <p className="hero-description mt-7 max-w-4xl text-white/90">
              {content.description}
            </p>
          </div>
        </div>
      </section>

      <AboutSectionNav tabs={content.tabs} />

      <div>
        {content.sections.map((section) =>
          section.timeline ? (
            <AboutTimeline key={section.id} id={section.id} title={section.title} timeline={section.timeline} />
          ) : (
            <div key={section.id} className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-20">
              <AboutContentSection section={section} />
            </div>
          ),
        )}
      </div>
    </main>
  );
}
