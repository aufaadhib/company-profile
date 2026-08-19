"use client";

import { scrollToAboutSection } from "@/components/about-section-navigation";

type AboutSectionNavProps = {
  tabs: Array<{ label: string; target: string }>;
};

export function AboutSectionNav({ tabs }: AboutSectionNavProps) {
  function handleNavigate(target: string) {
    scrollToAboutSection(target);
  }

  return (
    <nav aria-label="About page sections" className="sticky top-[var(--header-offset)] z-30 hidden w-full border-b border-[var(--line)] bg-white shadow-[0_8px_24px_rgba(16,24,32,.06)] transition-[top] duration-[var(--header-transition-duration)] ease-[var(--header-transition-easing)] lg:block">
      <div className="grid w-full grid-cols-5">
        {tabs.map((tab) => (
          <a
            key={tab.target}
            href={tab.target}
            onClick={(event) => {
              event.preventDefault();
              handleNavigate(tab.target);
            }}
            className="flex min-h-16 min-w-[14rem] items-center justify-center border-r border-[var(--line)] px-5 text-center text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-[var(--ink)] focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--accent)] lg:min-w-0 lg:text-base"
          >
            {tab.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
