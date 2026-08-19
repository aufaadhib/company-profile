"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { scrollToAboutSection } from "@/components/about-section-navigation";
import { getLocaleHref, getOtherLocaleHref } from "@/content/site-content";
import type { Locale, SiteContent } from "@/content/site-content";

type SiteHeaderProps = {
  locale: Locale;
  content: SiteContent;
  solid?: boolean;
};

function AfanaMark() {
  return (
    <svg aria-hidden="true" className="h-9 w-12 sm:h-10 sm:w-14" viewBox="0 0 56 40" fill="none">
      <path d="M4 30.5 17 9h10L14 30.5H4Z" fill="currentColor" />
      <path d="m22 30.5 13-21h10l-13 21H22Z" fill="currentColor" opacity=".7" />
      <path d="m29 20.5 6-11h10l-6 11H29Z" fill="currentColor" opacity=".42" />
    </svg>
  );
}

function MenuIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" fill="none">
      <path
        d={isOpen ? "M6 6l12 12M18 6 6 18" : "M4 7h16M4 12h16M4 17h16"}
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg aria-hidden="true" className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`} viewBox="0 0 16 16" fill="none">
      <path d="m3.5 6 4.5 4 4.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" className="size-6" viewBox="0 0 24 24" fill="none">
      <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16 16 4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function SiteHeader({ locale, content, solid = false }: SiteHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(solid);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const headerRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const pathname = usePathname();
  const otherLocale: Locale = locale === "id" ? "en" : "id";
  const otherLabel = otherLocale === "id" ? "ID" : "EN";
  const otherLocaleHref = getOtherLocaleHref(pathname, locale);

  function handleSectionLink(event: MouseEvent<HTMLAnchorElement>, href: string) {
    const [targetPath, hash] = href.split("#");
    if (!hash || targetPath !== pathname) {
      return;
    }

    event.preventDefault();
    scrollToAboutSection(`#${hash}`);
  }

  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY;
      const isAtTop = currentScrollY <= 72;
      const isScrollingUp = currentScrollY < lastScrollY.current;

      setIsScrolled(solid || !isAtTop);
      setIsHeaderVisible(isAtTop || isScrollingUp || isOpen);
      lastScrollY.current = currentScrollY;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        setOpenDropdown(null);
      }
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, solid]);

  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) {
      return;
    }

    const updateHeaderOffset = () => {
      const offset = isHeaderVisible || isOpen ? header.getBoundingClientRect().height : 0;
      document.documentElement.style.setProperty("--header-offset", `${offset}px`);
    };

    updateHeaderOffset();
    const resizeObserver = new ResizeObserver(updateHeaderOffset);
    resizeObserver.observe(header);

    return () => {
      resizeObserver.disconnect();
      document.documentElement.style.removeProperty("--header-offset");
    };
  }, [isHeaderVisible, isOpen, isScrolled]);

  const headerTone = isScrolled ? "text-[var(--ink)]" : "text-white";
  const interactiveTone = isScrolled ? "hover:text-[var(--ink)]" : "hover:text-white";
  const isHeaderShown = isHeaderVisible || isOpen;

  return (
    <>
    <header ref={headerRef} className={`site-header fixed inset-x-0 top-0 ${isOpen ? "z-[70]" : "z-50"} border-b transition-[translate,background-color,box-shadow,color] duration-[var(--header-transition-duration)] ease-[var(--header-transition-easing)] ${isHeaderShown ? "translate-y-0" : "-translate-y-full focus-within:translate-y-0"} ${isScrolled ? "border-[var(--line)] bg-white/95 shadow-[0_8px_24px_rgba(16,24,32,.08)] backdrop-blur-md" : "border-transparent bg-transparent"} ${headerTone}`}>
      <div className={`relative z-[70] mx-auto flex w-full max-w-[1440px] items-center justify-between gap-8 px-5 transition-[min-height] duration-[var(--header-transition-duration)] ease-[var(--header-transition-easing)] sm:px-8 lg:px-12 ${isScrolled ? "min-h-20" : "min-h-24 lg:min-h-32"}`}>
        <Link
          href={`/${locale}`}
          className={`flex min-h-11 items-center gap-3 font-display text-xl font-semibold tracking-[-0.06em] transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 ${isScrolled ? "focus-visible:outline-[var(--ink)]" : "focus-visible:outline-white"}`}
          aria-label={`Afana — ${locale === "id" ? "Beranda" : "Home"}`}
        >
          <AfanaMark />
          <span>Afana</span>
        </Link>

        <div className={`hidden flex-col items-end lg:flex ${isScrolled ? "gap-0" : "gap-5"}`}>
          <nav aria-label="Utility navigation" className={`flex items-center gap-7 text-sm font-medium transition-opacity ${isScrolled ? "pointer-events-none absolute opacity-0" : "text-white/90 opacity-100"}`}>
            {content.utilityNav.map((item) => (
              <Link key={item.label} href={getLocaleHref(item.href, locale)} className={`transition-colors ${interactiveTone} focus-visible:outline-2 focus-visible:outline-offset-4 ${isScrolled ? "focus-visible:outline-[var(--ink)]" : "focus-visible:outline-white"}`}>
                {item.label}
              </Link>
            ))}
            <Link href={otherLocaleHref} className={`flex items-center gap-2 transition-colors ${interactiveTone} focus-visible:outline-2 focus-visible:outline-offset-4 ${isScrolled ? "focus-visible:outline-[var(--ink)]" : "focus-visible:outline-white"}`}>
              {content.languageLabel === "Bahasa" ? "ID" : "EN"}
              <span className="size-2 rounded-full bg-[var(--accent)]" aria-hidden="true" />
            </Link>
            <Link href={getLocaleHref(content.headerCtaHref, locale)} className="rounded-full border border-white/80 px-5 py-2.5 text-xs font-semibold transition-colors hover:bg-white hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
              {content.headerCtaLabel}
            </Link>
          </nav>

          <nav aria-label="Primary navigation" className="flex items-center gap-7 text-[0.98rem] font-semibold">
            {content.nav.map((item) => {
              const hasChildren = Boolean(item.children?.length);
              const isDropdownOpen = openDropdown === item.label;

              if (!hasChildren) {
                return (
                    <Link key={item.label} href={getLocaleHref(item.href, locale)} className={`whitespace-nowrap transition-colors ${isScrolled ? "hover:text-black/65" : "hover:text-white/70"} focus-visible:outline-2 focus-visible:outline-offset-4 ${isScrolled ? "focus-visible:outline-[var(--ink)]" : "focus-visible:outline-white"}`}>
                    {item.label}
                  </Link>
                );
              }

              return (
                <div key={item.label} className="group relative">
                  <button
                    type="button"
                    className={`flex min-h-11 items-center gap-2 whitespace-nowrap transition-colors ${isScrolled ? "hover:text-black/65" : "hover:text-white/70"} focus-visible:outline-2 focus-visible:outline-offset-4 ${isScrolled ? "focus-visible:outline-[var(--ink)]" : "focus-visible:outline-white"}`}
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="menu"
                    onClick={() => setOpenDropdown(isDropdownOpen ? null : item.label)}
                  >
                    {item.label}
                    <ChevronIcon isOpen={isDropdownOpen} />
                  </button>
                  <div className={`invisible absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-3 opacity-0 transition-[opacity,visibility] duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 ${isDropdownOpen ? "!visible !opacity-100" : ""}`}>
                    <div className="rounded-2xl bg-white p-3 text-left shadow-[0_20px_50px_rgba(0,24,36,.22)] ring-1 ring-black/5" role="menu">
                      {item.children?.map((child) => (
                        <Link
                          key={child.label}
                          href={getLocaleHref(child.href, locale)}
                          role="menuitem"
                          className="flex min-h-11 items-center rounded-xl px-4 text-[0.95rem] font-normal text-slate-500 transition-colors hover:bg-slate-50 hover:text-[var(--ink)] focus-visible:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--accent)]"
                          onClick={(event) => {
                            handleSectionLink(event, getLocaleHref(child.href, locale));
                            setOpenDropdown(null);
                          }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
            <button
              type="button"
              className={`flex min-h-11 min-w-11 items-center justify-center transition-opacity ${isScrolled ? "opacity-100" : "pointer-events-none opacity-0"} focus-visible:outline-2 ${isScrolled ? "focus-visible:outline-[var(--ink)]" : "focus-visible:outline-white"}`}
              aria-label={locale === "id" ? "Cari" : "Search"}
            >
              <SearchIcon />
            </button>
          </nav>
        </div>

        <button
          type="button"
          className={`relative z-[70] flex min-h-12 min-w-12 items-center justify-center transition-colors ${isScrolled ? "hover:text-black/65 focus-visible:outline-[var(--ink)]" : "hover:text-white/70 focus-visible:outline-white"} focus-visible:outline-2 focus-visible:outline-offset-4 lg:hidden`}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          aria-label={isOpen ? content.closeLabel : content.menuLabel}
          onClick={() => setIsOpen((current) => !current)}
        >
          <MenuIcon isOpen={isOpen} />
        </button>
      </div>

    </header>
    {isOpen ? (
      <div id="mobile-navigation" className="fixed inset-0 z-[55] overflow-y-auto bg-[rgba(1,14,18,.92)] backdrop-blur-[2px] lg:hidden">
        <div className="mx-auto flex min-h-full w-full max-w-[640px] flex-col px-6 pb-6 pt-28 sm:px-10">
          <div className="mb-4 flex justify-end">
            <Link href={otherLocaleHref} className="flex min-h-11 items-center gap-2 text-xs font-semibold tracking-[0.16em] text-white/80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" onClick={() => setIsOpen(false)}>
              {otherLabel}
              <span className="size-2 rounded-full bg-[var(--accent)]" aria-hidden="true" />
            </Link>
          </div>
          <nav aria-label="Mobile navigation" className="flex flex-1 flex-col">
          {content.nav.map((item) => {
            const hasChildren = Boolean(item.children?.length);
            const isDropdownOpen = openDropdown === item.label;

            if (!hasChildren) {
              return (
                <Link key={item.label} href={getLocaleHref(item.href, locale)} className="flex min-h-14 items-center justify-between border-b border-white/15 text-base font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" onClick={() => setIsOpen(false)}>
                  {item.label}
                  <ChevronIcon isOpen={false} />
                </Link>
              );
            }

            return (
              <div key={item.label} className="border-b border-white/15">
                <button
                  type="button"
                  className="flex min-h-14 w-full items-center justify-between border-b border-white/15 text-left text-base font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  aria-expanded={isDropdownOpen}
                  onClick={() => setOpenDropdown(isDropdownOpen ? null : item.label)}
                >
                  {item.label}
                  <ChevronIcon isOpen={isDropdownOpen} />
                </button>
                {isDropdownOpen ? (
                  <div className="-mx-1 mb-3 px-1 py-1">
                    {item.children?.map((child) => (
                      <Link key={child.label} href={getLocaleHref(child.href, locale)} className="flex min-h-11 items-center px-3 text-sm font-normal text-white/65 transition-[color,transform] duration-200 hover:translate-x-1 hover:text-[var(--accent)] focus-visible:translate-x-1 focus-visible:text-white focus-visible:outline-2 focus-visible:outline-white" onClick={(event) => {
                        handleSectionLink(event, getLocaleHref(child.href, locale));
                        setIsOpen(false);
                      }}>
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
          </nav>
          <div className="mt-8 border-t border-white/15 pt-5">
            <nav aria-label="Mobile utility navigation" className="flex items-center justify-center gap-6 text-xs font-medium text-white/85">
              {content.mobileFooterNav.map((item) => (
                <Link key={item.label} href={getLocaleHref(item.href, locale)} className="min-h-11 flex items-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" onClick={() => setIsOpen(false)}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <Link href={getLocaleHref(content.headerCtaHref, locale)} className="mx-auto mt-3 flex min-h-11 w-fit items-center rounded-full border border-white/80 px-5 text-xs font-semibold text-white transition-colors hover:bg-white hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" onClick={() => setIsOpen(false)}>
              {content.headerCtaLabel}
            </Link>
          </div>
        </div>
      </div>
    ) : null}
    </>
  );
}
