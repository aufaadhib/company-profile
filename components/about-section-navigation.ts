export function scrollToAboutSection(target: string) {
  const section = document.getElementById(target.replace(/^#/, ""));
  if (!section) {
    return;
  }

  const sectionNavigation = document.querySelector<HTMLElement>('nav[aria-label="About page sections"]');
  const navigationHeight = sectionNavigation?.getBoundingClientRect().height ?? 0;
  const headerHeight = document.querySelector<HTMLElement>(".site-header")?.getBoundingClientRect().height ?? 0;
  const targetDocumentTop = window.scrollY + section.getBoundingClientRect().top;
  const isScrollingDown = targetDocumentTop > window.scrollY;
  const targetOffset = navigationHeight + (isScrollingDown ? 0 : headerHeight);
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  window.scrollTo({
    top: Math.max(0, targetDocumentTop - targetOffset),
    behavior: prefersReducedMotion ? "auto" : "smooth",
  });
  window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);

  window.setTimeout(() => {
    const navigationBottom = sectionNavigation?.getBoundingClientRect().bottom ?? 0;
    const correction = section.getBoundingClientRect().top - navigationBottom;

    if (Math.abs(correction) > 1) {
      window.scrollBy({ top: correction, behavior: "auto" });
    }
  }, prefersReducedMotion ? 0 : 700);
}
