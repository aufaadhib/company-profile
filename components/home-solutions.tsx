"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { flushSync } from "react-dom";

import type { HomePageContent } from "@/content/home-content";

type HomeSolutionsProps = {
  content: HomePageContent["solutions"];
  detailHref: string;
};

type CardStyle = CSSProperties & {
  "--solution-card-delay": string;
};

type SolutionCardProps = {
  activeTabId: string;
  card: HomePageContent["solutions"]["tabs"][number]["cards"][number];
  hideDetailsLabel: string;
  index: number;
  isLocked: boolean;
  onToggle: () => void;
  showDetailsLabel: string;
};

type CardSide = "front" | "back";

const CARD_CLOSE_DURATION = 180;
const CARD_OPEN_DURATION = 260;

function SolutionCard({
  activeTabId,
  card,
  hideDetailsLabel,
  index,
  isLocked,
  onToggle,
  showDetailsLabel,
}: SolutionCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [visibleSide, setVisibleSide] = useState<CardSide>("front");
  const planeRef = useRef<HTMLSpanElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const transitionIdRef = useRef(0);
  const visibleSideRef = useRef<CardSide>("front");
  const requestedSide: CardSide = isLocked || isHovered ? "back" : "front";
  const descriptionId = `home-solution-description-${activeTabId}-${index}`;

  useEffect(() => {
    const plane = planeRef.current;
    if (!plane) return;

    const transitionId = ++transitionIdRef.current;
    const activeAnimation = animationRef.current;
    const currentTransform = getComputedStyle(plane).transform;
    activeAnimation?.cancel();

    if (requestedSide === visibleSideRef.current && !activeAnimation) {
      plane.style.transform = "rotateY(0deg)";
      return;
    }

    plane.style.transform = currentTransform === "none" ? "rotateY(0deg)" : currentTransform;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      plane.style.transform = "rotateY(0deg)";
      queueMicrotask(() => {
        if (transitionId !== transitionIdRef.current) return;
        visibleSideRef.current = requestedSide;
        setVisibleSide(requestedSide);
      });
      return;
    }

    /** Runs an interruptible two-stage turn while keeping only one rendered card plane. */
    async function turnCard(cardPlane: HTMLSpanElement) {
      if (requestedSide === visibleSideRef.current) {
        const straighten = cardPlane.animate(
          [{ transform: cardPlane.style.transform }, { transform: "rotateY(0deg)" }],
          {
            duration: CARD_CLOSE_DURATION,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            fill: "forwards",
          },
        );
        animationRef.current = straighten;

        try {
          await straighten.finished;
        } catch {
          return;
        }

        if (transitionId !== transitionIdRef.current) return;
        cardPlane.style.transform = "rotateY(0deg)";
        straighten.cancel();
        animationRef.current = null;
        return;
      }

      const closingTransform = requestedSide === "back" ? "rotateY(90deg)" : "rotateY(-90deg)";
      const openingTransform = requestedSide === "back" ? "rotateY(-90deg)" : "rotateY(90deg)";
      const close = cardPlane.animate(
        [{ transform: cardPlane.style.transform }, { transform: closingTransform }],
        {
          duration: CARD_CLOSE_DURATION,
          easing: "cubic-bezier(0.7, 0, 1, 1)",
          fill: "forwards",
        },
      );
      animationRef.current = close;

      try {
        await close.finished;
      } catch {
        return;
      }

      if (transitionId !== transitionIdRef.current) return;
      visibleSideRef.current = requestedSide;
      flushSync(() => setVisibleSide(requestedSide));
      cardPlane.style.transform = openingTransform;
      close.cancel();

      const open = cardPlane.animate(
        [{ transform: openingTransform }, { transform: "rotateY(0deg)" }],
        {
          duration: CARD_OPEN_DURATION,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          fill: "forwards",
        },
      );
      animationRef.current = open;

      try {
        await open.finished;
      } catch {
        return;
      }

      if (transitionId !== transitionIdRef.current) return;
      cardPlane.style.transform = "rotateY(0deg)";
      open.cancel();
      animationRef.current = null;
    }

    void turnCard(plane);
  }, [requestedSide]);

  useEffect(
    () => () => {
      transitionIdRef.current += 1;
      animationRef.current?.cancel();
    },
    [],
  );

  function handlePointerEnter(event: PointerEvent<HTMLButtonElement>) {
    if (
      event.pointerType !== "touch" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      setIsHovered(true);
    }
  }

  function handlePointerLeave() {
    setIsHovered(false);
  }

  return (
    <button
      type="button"
      aria-pressed={isLocked}
      aria-describedby={descriptionId}
      aria-label={`${isLocked ? hideDetailsLabel : showDetailsLabel}: ${card.title}`}
      data-flipped={requestedSide === "back" ? "true" : "false"}
      data-visible-side={visibleSide}
      onClick={onToggle}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      style={{ "--solution-card-delay": `${index * 70}ms` } as CardStyle}
      className="home-solution-card relative aspect-[4/5] min-w-[75vw] max-w-80 snap-start rounded-2xl border-0 bg-transparent p-0 text-left text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] sm:min-w-[43.5vw] sm:max-w-none md:min-w-0 md:w-3/4 xl:w-full"
    >
      <span id={descriptionId} className="sr-only">{card.body}</span>
      <span
        ref={planeRef}
        aria-hidden="true"
        className="home-solution-card__plane absolute inset-0 block overflow-hidden rounded-2xl bg-[var(--ink)]"
      >
        {visibleSide === "front" ? (
          <>
            <Image
              src={card.image}
              alt=""
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 78vw"
              className="object-cover"
            />
            <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,24,32,.08)_20%,rgba(16,24,32,.88)_100%)]" />
            <span className="absolute inset-0 flex flex-col justify-end p-6 sm:p-7">
              <span className="max-w-[16rem] font-display text-2xl font-semibold leading-tight tracking-[-0.035em] text-balance">{card.title}</span>
            </span>
          </>
        ) : (
          <span className="flex h-full flex-col p-6 sm:p-7">
            <span className="flex items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
              <span>Afana</span>
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
            </span>
            <span className="mt-auto block">
              <span className="block h-px w-12 bg-[var(--accent)]" />
              <span className="mt-6 block max-w-[16rem] font-display text-2xl font-semibold leading-tight tracking-[-0.035em] text-balance">{card.title}</span>
              <span className="mt-4 block max-w-[18rem] text-sm leading-6 text-white/70">{card.body}</span>
            </span>
          </span>
        )}
      </span>
    </button>
  );
}

export function HomeSolutions({ content, detailHref }: HomeSolutionsProps) {
  const [activeTabId, setActiveTabId] = useState(content.tabs[0].id);
  const [flippedCardTitle, setFlippedCardTitle] = useState<string | null>(null);
  const activeTab = content.tabs.find((tab) => tab.id === activeTabId) ?? content.tabs[0];
  const panelId = "home-solutions-panel";

  function selectTab(tabId: string) {
    setActiveTabId(tabId);
    setFlippedCardTitle(null);
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (currentIndex + direction + content.tabs.length) % content.tabs.length;
    const nextTab = content.tabs[nextIndex];
    selectTab(nextTab.id);
    document.getElementById(`home-solutions-tab-${nextTab.id}`)?.focus();
  }

  return (
    <section id="bisnis-afana" className="scroll-mt-20 border-b border-[var(--line)] bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-16 sm:px-10 sm:py-24 lg:px-20 lg:py-28">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">{content.label}</p>
            <h2 className="mt-5 max-w-3xl font-display text-[clamp(2.25rem,1.8rem+1.6vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.045em] text-balance">
              {content.title}
            </h2>
          </div>
          <div className="lg:pb-1">
            <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">{content.description}</p>
            <Link
              href={detailHref}
              className="mt-7 inline-flex min-h-11 items-center gap-3 border-b border-[var(--ink)]/35 pb-1 text-sm font-semibold text-[var(--ink)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
            >
              {content.linkLabel}
              <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>

        <div
          role="tablist"
          aria-label={content.label}
          className="mt-10 grid min-h-12 w-full grid-cols-2 rounded-full bg-[#e9edf1] p-1 sm:mt-12 sm:inline-grid sm:w-auto"
        >
          {content.tabs.map((tab, index) => {
            const isActive = tab.id === activeTab.id;

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`home-solutions-tab-${tab.id}`}
                aria-controls={panelId}
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => selectTab(tab.id)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
                className={`min-h-11 rounded-full px-3 text-sm font-semibold transition-[background-color,color] focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[var(--accent)] sm:px-5 ${isActive ? "bg-[var(--ink)] text-white" : "text-[var(--ink)] hover:bg-white/70"}`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div
          key={activeTab.id}
          id={panelId}
          role="tabpanel"
          aria-labelledby={`home-solutions-tab-${activeTab.id}`}
          className="home-solutions__rail -mx-6 mt-5 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 pb-3 sm:-mx-10 sm:mt-6 sm:scroll-px-10 sm:px-10 md:mx-0 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 md:pb-0 xl:w-fit xl:grid-cols-[repeat(4,14rem)] xl:gap-4"
        >
          {activeTab.cards.map((card, index) => {
            const isFlipped = flippedCardTitle === card.title;

            return (
              <SolutionCard
                key={card.title}
                activeTabId={activeTab.id}
                card={card}
                hideDetailsLabel={content.hideDetailsLabel}
                index={index}
                isLocked={isFlipped}
                onToggle={() => setFlippedCardTitle(isFlipped ? null : card.title)}
                showDetailsLabel={content.showDetailsLabel}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
