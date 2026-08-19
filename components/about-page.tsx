import Image from "next/image";

import { AboutTimeline } from "@/components/about-timeline";
import type { AboutPageContent, AboutSection } from "@/content/about-content";

type AboutPageProps = {
  content: AboutPageContent;
};

function AboutContentSection({ section }: { section: AboutSection }) {
  return (
    <section id={section.id} className="scroll-mt-20 border-b border-[var(--line)] py-16 sm:py-20 lg:scroll-mt-36 lg:py-24">
      <div className="mx-auto max-w-5xl">
        {section.blocks ? (
          <div className="space-y-16">
            {section.blocks.map((block) => (
              <div key={block.title} className="max-w-5xl">
                <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.06em] text-[var(--ink)]">
                  {block.title}
                </h2>
                <div className="mt-4 space-y-5 text-justify text-lg leading-8 text-[var(--muted)]">
                  {block.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {block.list ? (
                  <ol className="mt-5 list-decimal space-y-2 pl-5 text-justify text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8">
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
      </div>
    </section>
  );
}

export function AboutPage({ content }: AboutPageProps) {
  return (
    <main id="main-content" className="flex-1 bg-[var(--paper)]">
      <section className="relative isolate min-h-[35rem] overflow-hidden bg-[var(--ink)] text-white lg:min-h-[calc(100svh-4rem)]">
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
        <div className="relative z-10 mx-auto flex min-h-[35rem] w-full max-w-[1440px] items-end px-6 pb-16 pt-36 sm:px-10 sm:pb-20 lg:min-h-[calc(100svh-4rem)] lg:px-20 lg:pb-24">
          <div className="max-w-5xl">
            <p className="mb-8 flex flex-wrap items-center gap-3 text-sm font-medium text-white/90 sm:text-base">
              <span>{content.breadcrumbHome}</span>
              <span aria-hidden="true" className="text-white/60">/</span>
              <span>{content.breadcrumbCurrent}</span>
            </p>
            <h1 className="font-display text-[clamp(3rem,7vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.07em] text-white">
              {content.title}
            </h1>
            <p className="mt-7 max-w-4xl text-base leading-7 text-white/90 sm:text-lg sm:leading-8">
              {content.description}
            </p>
          </div>
        </div>
      </section>

      <nav aria-label="About page sections" className="sticky top-[var(--header-offset)] z-30 hidden w-full border-b border-[var(--line)] bg-white shadow-[0_8px_24px_rgba(16,24,32,.06)] transition-[top] duration-[var(--header-transition-duration)] ease-[var(--header-transition-easing)] lg:block">
        <div className="grid w-full grid-cols-5">
          {content.tabs.map((tab) => (
            <a
              key={tab.target}
              href={tab.target}
              className="flex min-h-16 min-w-[14rem] items-center justify-center border-r border-[var(--line)] px-5 text-center text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-[var(--ink)] focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--accent)] lg:min-w-0 lg:text-base"
            >
              {tab.label}
            </a>
          ))}
        </div>
      </nav>

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
