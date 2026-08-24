"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import type { Swiper as SwiperClass } from "swiper";
import { A11y, Autoplay, EffectFade, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { usePrefersReducedMotion } from "@/components/use-prefers-reduced-motion";
import type { BusinessFocus } from "@/content/business-content";

type BusinessFocusShowcaseProps = {
  focuses: BusinessFocus[];
  previousLabel: string;
  nextLabel: string;
  slideLabel: string;
};

export function BusinessFocusShowcase({ focuses, previousLabel, nextLabel, slideLabel }: BusinessFocusShowcaseProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperClass | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function selectFocus(index: number) {
    const swiper = swiperRef.current;
    if (!swiper) return;

    swiper.slideTo(index);
    if (!reducedMotion) {
      swiper.autoplay.stop();
      swiper.autoplay.start();
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex = index;

    if (event.key === "ArrowDown" || event.key === "ArrowRight") nextIndex = (index + 1) % focuses.length;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft") nextIndex = (index - 1 + focuses.length) % focuses.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = focuses.length - 1;
    else return;

    event.preventDefault();
    tabRefs.current[nextIndex]?.focus();
    selectFocus(nextIndex);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.08fr_.92fr] lg:gap-5">
      <Swiper
        modules={[A11y, Autoplay, EffectFade, Keyboard]}
        key={reducedMotion ? "reduced-motion" : "autoplay"}
        className="h-[32rem] w-full overflow-hidden rounded-2xl bg-[var(--ink)] sm:h-[38rem] lg:h-[42rem]"
        wrapperClass="h-full"
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={reducedMotion ? 0 : 700}
        rewind
        keyboard={{ enabled: true, onlyInViewport: true }}
        autoplay={{ enabled: !reducedMotion, delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        a11y={{ prevSlideMessage: previousLabel, nextSlideMessage: nextLabel, slideLabelMessage: `${slideLabel} {{index}} / {{slidesLength}}` }}
        onSwiper={(swiper) => { swiperRef.current = swiper; }}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
      >
        {focuses.map((focus, index) => (
          <SwiperSlide
            key={focus.number}
            id={`business-focus-panel-${index}`}
            role="tabpanel"
            aria-labelledby={`business-focus-tab-${index}`}
            className="relative h-full overflow-hidden"
          >
            <Image src={focus.image} alt={focus.imageAlt} fill quality={90} sizes="(max-width: 1023px) calc(100vw - 3rem), 54vw" className="object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(5,14,20,.94)_0%,rgba(5,14,20,.18)_70%)]" />
            <article className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8 lg:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">{focus.number} &nbsp; {focus.label}</p>
              <h3 className="mt-3 max-w-xl font-display text-[clamp(1.75rem,3vw,2.6rem)] font-semibold leading-tight tracking-[-0.05em]">{focus.title}</h3>
              <p className="mt-4 max-w-xl text-base leading-7 text-white/75">{focus.body}</p>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>

      <div role="tablist" aria-label={slideLabel} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {focuses.map((focus, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              ref={(node) => { tabRefs.current[index] = node; }}
              key={focus.number}
              id={`business-focus-tab-${index}`}
              type="button"
              role="tab"
              aria-controls={`business-focus-panel-${index}`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => selectFocus(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={`group min-h-36 rounded-2xl p-5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] sm:p-6 lg:min-h-0 ${isActive ? "bg-[var(--ink)] text-white" : "bg-white text-[var(--ink)] hover:bg-[#eef0f1]"}`}
            >
              <span className={`text-xs font-semibold uppercase tracking-[0.16em] ${isActive ? "text-[var(--accent)]" : "text-[var(--muted)]"}`}>{focus.number} &nbsp; {focus.label}</span>
              <span className="mt-3 block font-display text-xl font-semibold leading-tight tracking-[-0.04em]">{focus.title}</span>
              <span className={`mt-2 block text-sm leading-6 ${isActive ? "text-white/65" : "text-[var(--muted)]"}`}>{focus.body}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
