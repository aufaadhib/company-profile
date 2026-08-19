"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import type { Swiper as SwiperClass } from "swiper";
import { A11y, Autoplay, EffectFade, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { usePrefersReducedMotion } from "@/components/use-prefers-reduced-motion";
import type { AboutTimelineContent } from "@/content/about-content";

type AboutTimelineProps = {
  id: string;
  title: string;
  timeline: AboutTimelineContent;
};

export function AboutTimeline({ id, title, timeline }: AboutTimelineProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperClass | null>(null);
  const timelineRef = useRef<HTMLElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const periodRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function setProgress(progress: number) {
    const boundedProgress = Math.min(1, Math.max(0, progress));
    timelineRef.current?.style.setProperty("--timeline-progress", String(boundedProgress));
  }

  useEffect(() => {
    const swiper = swiperRef.current;
    setProgress(reducedMotion ? 1 : 0);

    if (!swiper) {
      return;
    }

    if (reducedMotion) {
      swiper.autoplay.stop();
      return;
    }

    if (!swiper.autoplay.running) {
      swiper.autoplay.start();
    }
  }, [reducedMotion]);

  useEffect(() => {
    const rail = railRef.current;
    const activePeriod = periodRefs.current[activeIndex];

    if (!rail || !activePeriod) {
      return;
    }

    const centeredPosition = activePeriod.offsetLeft - (rail.clientWidth - activePeriod.clientWidth) / 2;
    rail.scrollTo({ left: centeredPosition, behavior: reducedMotion ? "auto" : "smooth" });
  }, [activeIndex, reducedMotion]);

  function restartAutoplay(swiper: SwiperClass) {
    if (reducedMotion) {
      setProgress(1);
      return;
    }

    swiper.autoplay.stop();
    swiper.autoplay.start();
    setProgress(0);
  }

  function selectPeriod(index: number) {
    const swiper = swiperRef.current;
    if (!swiper) {
      return;
    }

    if (index !== activeIndex) {
      swiper.slideTo(index);
    }

    restartAutoplay(swiper);
  }

  function handlePeriodKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex = index;

    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % timeline.items.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (index - 1 + timeline.items.length) % timeline.items.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = timeline.items.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    periodRefs.current[nextIndex]?.focus();
    selectPeriod(nextIndex);
  }

  return (
    <section
      ref={timelineRef}
      id={id}
      aria-label={title}
      data-reduced-motion={reducedMotion}
      className="about-timeline relative isolate scroll-mt-20 overflow-hidden border-b border-[var(--line)] bg-[var(--ink)] text-white lg:scroll-mt-36"
    >
      <h2 className="sr-only">{title}</h2>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-30">
        <div className="mx-auto w-full max-w-[1180px] px-6 pt-6 sm:px-10 lg:px-12">
          <div
            ref={railRef}
            role="tablist"
            aria-label={timeline.periodLabel}
            className="about-timeline__rail pointer-events-auto flex overflow-x-auto overscroll-x-contain"
          >
            {timeline.items.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  ref={(node) => {
                    periodRefs.current[index] = node;
                  }}
                  key={item.id}
                  id={`timeline-tab-${item.id}`}
                  type="button"
                  role="tab"
                  aria-controls={`timeline-panel-${item.id}`}
                  aria-selected={isActive}
                  tabIndex={isActive ? 0 : -1}
                  className="about-timeline__period min-h-16 min-w-[10rem] flex-1 px-2 text-left text-sm font-semibold text-white/55 transition-colors hover:text-white focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white sm:min-w-[11rem]"
                  onClick={() => selectPeriod(index)}
                  onKeyDown={(event) => handlePeriodKeyDown(event, index)}
                >
                  <span className="flex items-center gap-2 whitespace-nowrap">
                    <span aria-hidden="true" className="about-timeline__dot size-2 rounded-full bg-white/35 transition-colors" />
                    <span>{item.period}</span>
                  </span>
                  <span aria-hidden="true" className="relative mt-3 block h-px overflow-hidden bg-white/35">
                    <span className="about-timeline__progress absolute inset-0 origin-left bg-[var(--accent)]" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <Swiper
        modules={[A11y, Autoplay, EffectFade, Keyboard]}
        className="h-[44rem] w-full sm:h-[40rem] lg:h-[34rem]"
        wrapperClass="h-full"
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={reducedMotion ? 0 : 700}
        rewind
        keyboard={{ enabled: true, onlyInViewport: true }}
        autoplay={{
          enabled: !reducedMotion,
          delay: 25000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
          waitForTransition: true,
        }}
        a11y={{
          prevSlideMessage: timeline.previousLabel,
          nextSlideMessage: timeline.nextLabel,
          slideLabelMessage: `${timeline.slideLabel} {{index}} / {{slidesLength}}`,
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.activeIndex);
          setProgress(reducedMotion ? 1 : 0);
        }}
        onAutoplayTimeLeft={(_, __, percentage) => setProgress(1 - percentage)}
      >
        {timeline.items.map((item) => (
          <SwiperSlide
            key={item.id}
            id={`timeline-panel-${item.id}`}
            role="tabpanel"
            aria-labelledby={`timeline-tab-${item.id}`}
            className="relative h-full overflow-hidden"
          >
            <Image src={item.image} alt={item.imageAlt} fill sizes="100vw" quality={90} className="object-cover" />
            <div className="pointer-events-none absolute inset-0 z-[1] bg-[rgba(2,12,16,.7)]" />
            <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(2,14,19,.96)_0%,rgba(3,24,31,.82)_48%,rgba(2,14,19,.58)_100%)]" />
            <div className="relative z-10 mx-auto flex h-full w-full max-w-[1180px] items-center px-6 pb-12 pt-40 sm:px-10 sm:pt-36 lg:px-12 lg:pt-32">
              <article className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/65 sm:text-sm">{item.title}</p>
                <h3 className="mt-3 font-display text-[clamp(2rem,5vw,3.4rem)] font-semibold leading-tight tracking-[-0.06em] text-white">
                  {timeline.journeyLabel} {item.period}
                </h3>
                <div className="mt-5 max-w-2xl space-y-4 text-base leading-7 text-white/90 sm:text-lg sm:leading-8">
                  {item.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </article>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

    </section>
  );
}
